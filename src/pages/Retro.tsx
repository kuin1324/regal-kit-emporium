import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoNotice from "@/components/PhotoNotice";
import CollectionView from "@/components/CollectionView";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";
import { useTranslation } from "react-i18next";

const items = allProducts.filter((p) => p.leagues.includes("Retro"));

const Retro = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pb-24 pt-28">
        <div className="container mx-auto px-6">
          <PhotoNotice />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-primary">{t("collection.eyebrow")}</p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("nav.retro", { defaultValue: "Retro" })}</h1>
          </motion.div>
          <CollectionView items={items} onSelect={setSelected} />
        </div>
      </section>
      <Footer />
      <ProductDetailModal productName={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Retro;
