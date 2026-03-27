import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Retro = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">
              Terug in de tijd
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              Retro Collectie
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Herbeleef de mooiste momenten uit de voetbalgeschiedenis met onze retro shirts.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Retro;
