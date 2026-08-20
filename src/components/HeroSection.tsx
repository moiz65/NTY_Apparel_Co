import heroImage from "@/assets/hero-athlete.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[calc(100vh-90px)] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Natural lifter training with intensity"
          className="w-full h-full object-cover"
          style={{ objectPosition: "65% center" }}
        />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h1 className="font-heading text-6xl sm:text-8xl md:text-9xl tracking-wider text-foreground animate-fade-in-up">
          WEAR<br />YOUR REAL
        </h1>
        <p className="font-body text-sm md:text-base tracking-[0.2em] uppercase text-muted-foreground mt-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          Premium apparel for natural athletes
        </p>
        <a
          href="#shop"
          className="inline-block bg-foreground text-background font-body text-sm tracking-[0.2em] uppercase px-10 py-4 hover:bg-accent hover:text-accent-foreground transition-colors duration-200 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          Shop the Drop
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
