const ITEMS = [
  "Fitness",
  "Personal Training",
  "Muay Thai",
  "Rehabilitation",
  "Strength",
  "Mobility",
  "Conditioning",
  "Verdun · بيروت",
];

export default function Marquee() {
  const row = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="display whitespace-nowrap px-6 text-2xl text-bone/90 md:text-3xl">
            {item}
          </span>
          <svg viewBox="0 0 12 12" className="h-3 w-3 fill-violet-hi" aria-hidden="true">
            <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-line bg-raised py-5">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
