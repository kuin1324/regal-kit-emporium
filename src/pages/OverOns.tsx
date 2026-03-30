import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OverOns = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-3">
              Over Ons
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-8">
              De Passie Achter <span className="text-gradient-gold">The Home of Football Style</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-muted-foreground leading-relaxed"
          >
            <p>
              Wij zijn een team van voetballiefhebbers met een passie voor iconische shirts. 
              Elk shirt in onze collectie is zorgvuldig geselecteerd op kwaliteit en stijl.
            </p>
            <p>
              Van legendarische WK-shirts tot zeldzame clubshirts — wij brengen de mooiste 
              voetbalgeschiedenis naar jouw garderobe. Onze missie is simpel: het bewaren en 
              delen van voetbalerfgoed door middel van premium kwaliteit shirts.
            </p>
            <p>
              Elke aankoop wordt veilig verpakt en wereldwijd verzonden. Verzending naar 
              Europa duurt ongeveer 15 dagen. Heb je vragen? Neem gerust contact met ons 
              op — wij helpen je graag.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OverOns;
