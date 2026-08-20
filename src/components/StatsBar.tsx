const stats = [
  { value: "100%", label: "Natural" },
  { value: "24/7", label: "Dedication" },
  { value: "1 Mission", label: "Self-Improvement" },
  { value: "0%", label: "Compromise" },
];

const StatsBar = () => {
  return (
    <section className="bg-foreground text-background py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 items-start gap-x-6 gap-y-8 md:gap-x-12">
        {stats.map((stat, i) => (
          <div key={stat.label} className="relative text-center px-2">
            {i > 0 && (
              <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 w-px h-8 bg-background/20" />
            )}
            <p className="font-heading text-xl md:text-3xl tracking-wider mb-2 leading-none whitespace-nowrap">{stat.value}</p>
            <p className="font-body text-[9px] md:text-xs tracking-[0.15em] uppercase text-background/60 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
