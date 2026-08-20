const UrgencyBanner = () => {
  return (
    <div className="bg-foreground py-2 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-8 text-xs font-body tracking-[0.2em] uppercase text-background">
            LIMITED DROP — FREE SHIPPING ON ORDERS OVER $75
          </span>
        ))}
      </div>
    </div>
  );
};

export default UrgencyBanner;
