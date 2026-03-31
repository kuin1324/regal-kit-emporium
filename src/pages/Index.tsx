import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedCollection from "@/components/FeaturedCollection";
import FeatureBanner from "@/components/FeatureBanner";
import Footer from "@/components/Footer";
import ReviewsMarquee from "@/components/ReviewsMarquee";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeatureBanner />
      <FeaturedCollection />
      <ReviewsMarquee />
      <Footer />
    </div>
  );
};

export default Index;
