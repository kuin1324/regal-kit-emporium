import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { topTeams } from "@/lib/collection";

/** Landcodes voor vlaggen (flagcdn); clubs krijgen hun clublogo. */
const FLAGS: Record<string, string> = {
  Brazil: "br", Argentina: "ar", Japan: "jp", Mexico: "mx", Portugal: "pt",
  Spain: "es", France: "fr", England: "gb-eng", Germany: "de", Italy: "it",
  Netherlands: "nl", Nederland: "nl", Colombia: "co", Belgium: "be",
  Uruguay: "uy", USA: "us", Croatia: "hr", Morocco: "ma", Chile: "cl",
  Peru: "pe", Ecuador: "ec", Nigeria: "ng", "South Korea": "kr", Turkey: "tr",
};

/** Clubdomeinen voor logo's (Clearbit logo-API). */
const CLUB_DOMAINS: Record<string, string> = {
  "Real Madrid": "realmadrid.com",
  "Manchester United": "manutd.com",
  "Manchester City": "mancity.com",
  "FC Barcelona": "fcbarcelona.com",
  Barcelona: "fcbarcelona.com",
  Liverpool: "liverpoolfc.com",
  Arsenal: "arsenal.com",
  Chelsea: "chelseafc.com",
  Tottenham: "tottenhamhotspur.com",
  "Paris Saint-Germain": "psg.fr",
  PSG: "psg.fr",
  Inter: "inter.it",
  "AC Milan": "acmilan.com",
  Milan: "acmilan.com",
  Juventus: "juventus.com",
  Napoli: "sscnapoli.it",
  Roma: "asroma.com",
  Bayern: "fcbayern.com",
  "Bayern Munich": "fcbayern.com",
  "Borussia Dortmund": "bvb.de",
  Ajax: "ajax.nl",
  Feyenoord: "feyenoord.nl",
  PSV: "psv.nl",
  Atletico: "atleticodemadrid.com",
  "Atletico Madrid": "atleticodemadrid.com",
  Benfica: "slbenfica.pt",
  Porto: "fcporto.pt",
  Marseille: "om.fr",
  Newcastle: "nufc.co.uk",
  Everton: "evertonfc.com",
  "Bayer Leverkusen": "bayer04.de",
  Galatasaray: "galatasaray.org",
  Celtic: "celticfc.com",
  Rangers: "rangers.co.uk",
  "Boca Juniors": "bocajuniors.com.ar",
  "River Plate": "cariverplate.com.ar",
  Flamengo: "flamengo.com.br",
};

const monogram = (team: string) =>
  team
    .replace(/^(FC|AC|SSC|RB)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Clublogo met terugval op een monogram wanneer het logo niet bestaat. */
const ClubLogo = ({ team }: { team: string }) => {
  const domain = CLUB_DOMAINS[team];
  const [broken, setBroken] = useState(false);
  if (!domain || broken)
    return (
      <span className="font-display text-2xl font-bold text-primary transition-transform duration-300 group-hover:scale-110 sm:text-3xl">
        {monogram(team)}
      </span>
    );
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={`${team} logo`}
      loading="lazy"
      onError={() => setBroken(true)}
      className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11"
    />
  );
};


const ShopByTeam = () => (
  <section className="py-12">
    <div className="container mx-auto px-6">
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6">
        Shop by team & country
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4">
        {topTeams.map((t, i) => {
          const flag = FLAGS[t.team];
          return (
            <motion.div
              key={t.team}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: Math.min(i, 10) * 0.03 }}
            >
              <Link
                to={`/collectie?q=${encodeURIComponent(t.team)}`}
                className="group flex flex-col items-center gap-2"
                aria-label={t.team}
              >
                <div className="flex aspect-square w-full items-center justify-center rounded-full border border-border/60 bg-card transition-all group-hover:border-primary/50 group-hover:shadow-[var(--shadow-gold)]">
                  {flag ? (
                    <img
                      src={`https://flagcdn.com/w80/${flag}.png`}
                      alt={t.team}
                      loading="lazy"
                      className="h-8 w-11 rounded-sm object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <span className="font-display text-2xl sm:text-3xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">
                      {monogram(t.team)}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-center font-medium tracking-wide text-muted-foreground group-hover:text-primary line-clamp-1">
                  {t.team}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default ShopByTeam;
