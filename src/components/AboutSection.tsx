import aboutImage from "@/assets/about-athlete.jpg";

const AboutSection = () => {
  return (
    <section className="bg-foreground text-background">
      <div className="grid md:grid-cols-2 min-h-[80vh]">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={aboutImage}
            alt="NTY athlete focused and determined"
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
          <h2 className="font-heading text-5xl md:text-7xl tracking-wider text-secondary-foreground mb-6">
            NO SHORTCUTS.<br />NO EXCUSES.
          </h2>
          <p className="font-body text-sm md:text-base leading-relaxed text-accent-foreground/70 mb-12 max-w-md">
            In a world where filters, Photoshop, and performance enhancing drugs distort reality, NATTY was born to challenge the illusion. Our mission is simple: celebrate real effort, discipline, and natural strength.
            <br /><br />
            This is more than apparel, it's a movement for authenticity and integrity in an industry that often rewards the opposite. No shortcuts, no lies. Just real effort, real results, and real pride in the process.
            <br /><br />
            Our apparel is a badge of honor for natural bodies. Built with premium quality and integrity, not cheap materials or fake hype. Whether you're in the gym or out living your truth, NATTY is your uniform, a symbol of strength that's earned, not cheated.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
