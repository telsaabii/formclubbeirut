"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  className?: string;
  /** CSS selector for staggered children; omit to reveal the wrapper as one block */
  selector?: string;
  y?: number;
  stagger?: number;
};

/** GSAP scroll-reveal wrapper. Respects prefers-reduced-motion. */
export default function Reveal({
  children,
  className,
  selector,
  y = 30,
  stagger = 0.1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = selector
          ? gsap.utils.toArray<HTMLElement>(selector, ref.current!)
          : [ref.current!];
        gsap.from(targets, {
          y,
          opacity: 0,
          duration: 0.95,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 84%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
