import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PhotoNotice from "@/components/PhotoNotice";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CollectionView from "@/components/CollectionView";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";

const SpecialEdition = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const specialProducts = useMemo(
    () => allProducts.filter((p) => p.leagues.includes("Special")),
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <PhotoNotice />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">{t("special.eyebrow")}</p>
            <Breadcrumbs />
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{t("special.title")}</h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">{t("special.subtitle")}</p>
          </motion.div>

          <CollectionView items={specialProducts} onSelect={setSelectedProduct} />
        </div>
      </section>
      <Footer />
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default SpecialEdition;
