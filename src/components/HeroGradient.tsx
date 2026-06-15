"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background — a single full-screen WebGL fragment shader rendering a
 * dark, slow, premium violet-on-black gradient.
 *
 * Design constraints (why it's built the way it is):
 *  - The FORM logo PNG has dark anti-aliased fringing on its letter edges. Any
 *    bright glow placed *directly behind* the wordmark makes those edges read as
 *    an ugly black outline. So the field stays near-black, the glow lives AROUND
 *    the logo (bottom / corners), and an elliptical "logo guard" actively dims
 *    the region right behind FORM so its edges blend into black.
 *  - Smooth domain-warped fractal field (no contour level-sets) → a flowing
 *    gradient, not electric veins.
 *
 * No three.js / no ShaderGradient — raw WebGL1, zero new dependencies.
 * Reduced motion → one frozen frame, no loop (AGENTS.md invariant #2).
 */

/** Glow placement: 0 aurora haze · 1 bottom uplight · 2 corner pools. */
const MODE = 1;
/** Overall brightness multiplier. */
const GLOW = 1.0;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform float u_mode;
uniform float u_glow;
uniform vec2  u_mouse; // pointer in uv space (y up), eased in JS
uniform float u_mstr;  // 0→1 ramp after first pointer move (0 = current look)

float hash(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++){
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / u_res.y;
  float t = u_time * 0.025; // slow

  // smooth, domain-warped flowing field (no contours → soft gradient)
  vec2 q = vec2(uv.x * aspect, uv.y) * 1.5;
  vec2 warp = vec2(fbm(q + t), fbm(q + vec2(3.1, 1.7) - t * 0.8));
  float field = fbm(q + 0.9 * warp);
  field = smoothstep(0.25, 0.95, field);

  // glow placement mask — keeps the logo region dark by construction
  float mask;
  if (u_mode < 0.5) {
    // 0 — aurora: uniformly dim, a touch stronger toward the bottom
    mask = mix(0.30, 0.62, smoothstep(0.95, 0.0, uv.y));
  } else if (u_mode < 1.5) {
    // 1 — bottom uplight: violet pooled center-bottom, behind tagline/buttons
    float dx = (uv.x - 0.5) * aspect;
    mask = smoothstep(0.72, 0.02, uv.y) * exp(-dx * dx * 1.1);
  } else {
    // 2 — corner pools: two soft glows in the lower corners
    float dl = distance(vec2(uv.x * aspect, uv.y), vec2(0.0, 0.05));
    float dr = distance(vec2(uv.x * aspect, uv.y), vec2(aspect, 0.05));
    mask = exp(-dl * dl * 1.0) + exp(-dr * dr * 1.0);
  }

  // cursor pool — a soft violet glow that drifts toward the pointer; the
  // logo guard below still dims it behind the wordmark, so FORM stays clean
  vec2 mp = vec2((uv.x - u_mouse.x) * aspect, uv.y - u_mouse.y);
  mask += exp(-dot(mp, mp) * 3.2) * 0.5 * u_mstr;

  float lum = field * clamp(mask, 0.0, 1.0) * u_glow;

  // palette: near-black ink → deep violet → violet-hi (dim, premium)
  vec3 ink      = vec3(0.027, 0.024, 0.043); // ~#07060b
  vec3 violet   = vec3(0.34, 0.13, 0.66);
  vec3 violetHi = vec3(0.55, 0.34, 0.88);

  vec3 col = ink;
  col = mix(col, violet, clamp(lum, 0.0, 1.0));
  col = mix(col, violetHi, clamp(lum - 0.55, 0.0, 1.0) * 0.7);

  // logo guard — dim an ellipse right behind the FORM wordmark so the PNG's
  // dark edges blend into black instead of showing as an outline
  vec2 lp = vec2((uv.x - 0.5) * aspect, uv.y - 0.62);
  float guard = exp(-(lp.x * lp.x / 0.12 + lp.y * lp.y / 0.022));
  col = mix(col, ink, 0.78 * guard);

  // vignette → deep at the edges
  float vig = smoothstep(1.08, 0.34, distance(uv, vec2(0.5)) * 1.24);
  col = mix(ink, col, mix(0.45, 1.0, vig));

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // A lost context makes every GL query return null/false — that surfaces here
    // as a bogus "compile failure" with a null info log. It's not a shader bug, so
    // don't shout about it; the contextrestored handler rebuilds when the GPU is back.
    if (!gl.isContextLost()) {
      console.error("HeroGradient: shader compile failed —", gl.getShaderInfoLog(sh));
    }
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function HeroGradient({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: true, alpha: false }) as WebGLRenderingContext | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return; // CSS fallback background stays visible

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    let disposed = false;
    let start = performance.now();
    let uRes: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uMouse: WebGLUniformLocation | null = null;
    let uMstr: WebGLUniformLocation | null = null;

    // pointer state — `cur` eases toward `target` each frame so the glow
    // drifts rather than tracks; strength ramps from 0 on first pointer move,
    // so devices without a pointer keep the exact pre-cursor look
    const target = { x: 0.5, y: 0.3 };
    const cur = { x: 0.5, y: 0.3 };
    let targetStr = 0;
    let curStr = 0;

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height; // gl_FragCoord is y-up
      targetStr = 1;
    }

    function resize() {
      if (!canvas || !gl || gl.isContextLost()) return;
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    }

    function frame(now: number) {
      if (!running || !gl || gl.isContextLost()) return;
      cur.x += (target.x - cur.x) * 0.045;
      cur.y += (target.y - cur.y) * 0.045;
      curStr += (targetStr - curStr) * 0.03;
      gl.uniform1f(uTime, (now - start) / 1000);
      if (uMouse) gl.uniform2f(uMouse, cur.x, cur.y);
      if (uMstr) gl.uniform1f(uMstr, curStr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }

    // (Re)create all GL resources. Idempotent and safe to re-run after a context
    // restore. Returns false (silently) if the context is gone — the
    // webglcontextrestored handler will call it again once the GPU recovers.
    function build(): boolean {
      if (disposed || !gl || gl.isContextLost()) return false;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return false;

      const prog = gl.createProgram();
      if (!prog) return false;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        if (!gl.isContextLost()) {
          console.error("HeroGradient: program link failed —", gl.getProgramInfoLog(prog));
        }
        return false;
      }
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      uRes = gl.getUniformLocation(prog, "u_res");
      uTime = gl.getUniformLocation(prog, "u_time");
      uMouse = gl.getUniformLocation(prog, "u_mouse");
      uMstr = gl.getUniformLocation(prog, "u_mstr");
      gl.uniform1f(gl.getUniformLocation(prog, "u_mode"), MODE);
      gl.uniform1f(gl.getUniformLocation(prog, "u_glow"), GLOW);
      if (uMouse) gl.uniform2f(uMouse, cur.x, cur.y);
      if (uMstr) gl.uniform1f(uMstr, curStr);

      resize();

      if (reduced) {
        // one frozen frame, no loop (AGENTS.md invariant #2)
        gl.uniform1f(uTime, 8.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return true;
      }

      start = performance.now();
      running = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
      return true;
    }

    // Real GPU context loss (driver reset, tab backgrounded, GPU process recycled).
    // preventDefault() opts into automatic restoration; we rebuild on restore.
    function onLost(e: Event) {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
    }
    function onRestored() {
      build();
    }
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    if (!reduced) window.addEventListener("pointermove", onPointerMove);

    build();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let io: IntersectionObserver | null = null;
    if (!reduced) {
      io = new IntersectionObserver(
        ([e]) => {
          if (disposed || !gl || gl.isContextLost()) return;
          if (e.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(frame);
          } else if (!e.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0 }
      );
      io.observe(canvas);
    }

    return () => {
      // Stop work and detach listeners only. We intentionally do NOT call
      // WEBGL_lose_context.loseContext() here: in dev, React StrictMode runs this
      // cleanup between two mounts on the *same* canvas, and a deliberately-lost
      // context is handed back by the next getContext() call — making every GL
      // query (incl. shader compile) fail with a null info log. The browser
      // reclaims the context on GC once the canvas is unmounted.
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ background: "#07060b" }}
    />
  );
}
