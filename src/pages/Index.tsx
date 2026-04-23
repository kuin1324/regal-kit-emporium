import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import SearchHero from "@/components/SearchHero";
import ProductRow from "@/components/ProductRow";
import ShopByLeague from "@/components/ShopByLeague";
import FeatureBanner from "@/components/FeatureBanner";
import ReviewsMarquee from "@/components/ReviewsMarquee";
import Footer from "@/components/Footer";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";

const Index = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const recommendations = allProducts.slice(0, 6);
  const specials = allProducts.filter((p) => p.leagues.includes("Special"));
  const national = allProducts.filter((p) => p.leagues.includes("Nationaal"));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />
      <SearchHero />
      <FeatureBanner />
      <ProductRow
        title="Aanbevolen"
        products={recommendations}
        seeAllHref="/collectie"
        onProductClick={setSelected}
      />
      <ProductRow
        title="Special Editions"
        products={specials}
        seeAllHref="/special-edition"
        onProductClick={setSelected}
      />
      <ShopByLeague />
      <ProductRow
        title="Nationale Teams"
        products={national}
        seeAllHref="/collectie"
        onProductClick={setSelected}
      />
      <ReviewsMarquee />
      <Footer />
      <ProductDetailModal productName={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Index;
