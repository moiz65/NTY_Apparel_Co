import UrgencyBanner from "@/components/UrgencyBanner";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import AboutSection from "@/components/AboutSection";
import BestSellers from "@/components/BestSellers";
import PartnerSection from "@/components/PartnerSection";
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* <WelcomePopup /> */}
      <UrgencyBanner />
      <Header />
      <HeroSection />
      <StatsBar />
      <BestSellers />
      <AboutSection />
      <div className="w-full h-[6px] bg-background" />
      <PartnerSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
