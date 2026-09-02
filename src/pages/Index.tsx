import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import SearchHero from "@/components/SearchHero";
import ProductRow from "@/components/ProductRow";
import ShopByLeague from "@/components/ShopByLeague";
import ShopByTeam from "@/components/ShopByTeam";
import FeatureBanner from "@/components/FeatureBanner";
import ReviewsMarquee from "@/components/ReviewsMarquee";
import Footer from "@/components/Footer";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";
import WelcomeGuideModal from "@/components/WelcomeGuideModal";

/** Door elkaar husselen zodat de homepage niet alfabetisch oogt (stabiel per sessie). */
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const recommendations = shuffle(allProducts).slice(0, 16);
const specials = shuffle(allProducts.filter((p) => p.leagues.includes("Special"))).slice(0, 16);
const national = shuffle(allProducts.filter((p) => p.leagues.includes("Nationaal"))).slice(0, 16);

const Index = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const { t } = useTranslation();



  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />
      <SearchHero />
      <FeatureBanner />
      <ShopByTeam />
      <ProductRow title={t("home.recommended")} products={recommendations} seeAllHref="/collectie" onProductClick={setSelected} />
      <ProductRow title={t("home.specials")} products={specials} seeAllHref="/special-edition" onProductClick={setSelected} />
      <ShopByLeague />
      <ProductRow title={t("home.national")} products={national} seeAllHref="/collectie" onProductClick={setSelected} />
      <ReviewsMarquee />
      <Footer />
      <ProductDetailModal productName={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Index;
