import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrgencyBanner from "@/components/UrgencyBanner";
import FAQSection from "@/components/FAQSection";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <UrgencyBanner />
      <Header />
      <section className="pt-16 pb-4 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-6xl md:text-8xl tracking-wider text-foreground mb-4">
            FAQ
          </h1>
          <p className="font-body text-sm text-muted-foreground tracking-[0.15em] uppercase">
            Frequently Asked Questions
          </p>
        </div>
      </section>
      <FAQSection />
      <Footer />
    </div>
  );
};

export default FAQ;
