import UrgencyBanner from "@/components/UrgencyBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NattyVerifiedForm from "@/components/NattyVerifiedForm";
const NattyVerified = () => {
  return (
    <div className="min-h-screen bg-background">
      <UrgencyBanner />
      <Header />
      <NattyVerifiedForm />
      <Footer />
    </div>
  );
};

export default NattyVerified;
