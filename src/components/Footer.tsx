import { Link } from "react-router-dom";

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
          <div>
            <h4 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/collectie" className="text-sm text-muted-foreground hover:text-primary transition-colors">Collectie</Link></li>
              <li><Link to="/retro" className="text-sm text-muted-foreground hover:text-primary transition-colors">Retro</Link></li>
              <li><Link to="/special-edition" className="text-sm text-muted-foreground hover:text-primary transition-colors">Special Edition</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-4">Info</h4>
            <ul className="space-y-2">
              <li><Link to="/over-ons" className="text-sm text-muted-foreground hover:text-primary transition-colors">Over Ons</Link></li>
              <li><Link to="/favorieten" className="text-sm text-muted-foreground hover:text-primary transition-colors">Favorieten</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-4">Volg Ons</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.tiktok.com/@footballshirts119?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  TikTok
                </a>
              </li>
              <li>
              <a href="https://www.snapchat.com/@jamairofaisel?sender_web_id=89b2f39e-7886-409e-ab63-9d8c5bb13eb5&device_type=desktop&is_copy_url=true" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Snapchat
                </a>
              </li>
              <li>
                <a href="https://www.vinted.nl/member/242654802-ebbekreuwel?utm_medium=social&utm_source=heylink.me" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Vinted
                </a>
              </li>
            </ul>
          </div>
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
