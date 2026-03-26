const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-lg font-bold tracking-widest uppercase text-gradient-gold mb-4">
              The Home of Football Style
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              De ultieme bestemming voor zeldzame en iconische voetbalshirts.
            </p>
          </div>
          {[
            { title: "Shop", links: ["Collectie", "Retro", "Special Edition", "Nieuw Binnen"] },
            { title: "Info", links: ["Over Ons", "Contact", "FAQ", "Verzending"] },
            { title: "Volg Ons", links: ["Instagram", "Twitter", "TikTok"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 The Home of Football Style. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
