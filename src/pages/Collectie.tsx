import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoNotice from "@/components/PhotoNotice";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CollectionView from "@/components/CollectionView";
import ProductDetailModal from "@/components/ProductDetailModal";
import { collectieShirts } from "@/data/collectie_shirts";
import { publicCollectieShirts } from "@/data/public_collectie";

const seen = new Set(collectieShirts.map((p) => p.name));
const allCollectieItems = [
  ...collectieShirts,
  ...publicCollectieShirts.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  }),
];

const Collectie = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pb-24 pt-28">
        <div className="w-full px-2 sm:px-3">
          <PhotoNotice />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-primary">{t("collection.eyebrow")}</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("collection.title")}</h1>
          </motion.div>

          <CollectionView items={allCollectieItems} onSelect={setSelectedProduct} />
        </div>
      </section>
      <Footer />
      <ProductDetailModal productName={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Collectie;
