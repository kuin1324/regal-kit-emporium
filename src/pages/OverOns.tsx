import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OverOns = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">{t("about.eyebrow")}</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-8">
              {t("about.title")} <span className="text-gradient-gold">The Home of Football Style</span>
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6 text-muted-foreground leading-relaxed">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>
              {t("about.p3Before")}
              <a href="mailto:the_home_of_football_style@outlook.com" className="text-primary hover:underline">
                the_home_of_football_style@outlook.com
              </a>
              {t("about.p3After")}
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OverOns;
