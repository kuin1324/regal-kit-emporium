import { motion } from "framer-motion";
import { Award, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

const FeatureBanner = () => {
  const { t } = useTranslation();
  const features = [
    { icon: Award, title: t("home.features.qualityTitle"), desc: t("home.features.qualityDesc") },
    { icon: Truck, title: t("home.features.shippingTitle"), desc: t("home.features.shippingDesc") },
  ];

  return (
    <section className="border-y border-border bg-card/50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="h-12 w-12 rounded-full border border-primary/30 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-sm font-semibold tracking-wide uppercase">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBanner;
