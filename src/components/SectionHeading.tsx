type Props = {
  kicker: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ kicker, title, lead, align = "left" }: Props) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="kicker" data-reveal>
        {kicker}
      </p>
      <h2
        className="display mt-4 text-4xl text-bone sm:text-5xl md:text-6xl"
        data-reveal
      >
        {title}
      </h2>
      {lead && (
        <p className="mt-5 text-base leading-relaxed text-ash md:text-lg" data-reveal>
          {lead}
        </p>
      )}
    </div>
  );
}
