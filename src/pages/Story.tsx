import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrgencyBanner from "@/components/UrgencyBanner";
import AboutSection from "@/components/AboutSection";
import aboutImage from "@/assets/about-athlete.jpg";

const Story = () => {
  return (
    <div className="min-h-screen bg-background">
      <UrgencyBanner />
      <Header />
      <section className="pt-16 pb-12 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-6xl md:text-8xl tracking-wider text-foreground mb-6">
            THE NTY STORY
          </h1>
          <p className="font-body text-sm md:text-base leading-relaxed text-muted-foreground max-w-xl mx-auto">
            Every brand has an origin. Ours started with iron, chalk, and a refusal to fake it.
          </p>
        </div>
      </section>
      <AboutSection />
      <section className="bg-background py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl md:text-6xl tracking-wider text-foreground mb-8">
            WHY NATURAL?
          </h2>
          <p className="font-body text-sm md:text-base leading-relaxed text-muted-foreground mb-6">
            In a world of shortcuts, we chose the hard way. NTY was founded on the belief that
            real progress comes from discipline, consistency, and honesty, both in the gym
            and in the clothes you wear.
          </p>
          <p className="font-body text-sm md:text-base leading-relaxed text-muted-foreground">
            Every piece we make is designed for athletes who earn their physique. No gimmicks.
            No compromises. Just clean design, premium materials, and a community that holds
            itself to a higher standard.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Story;
