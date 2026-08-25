import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { topClubs, topCountries } from "@/lib/collection";

/** Landcodes voor vlaggen (flagcdn); clubs krijgen hun clublogo. */
const FLAGS: Record<string, string> = {
  Brazil: "br", Argentina: "ar", Japan: "jp", Mexico: "mx", Portugal: "pt",
  Spain: "es", France: "fr", England: "gb-eng", Germany: "de", Italy: "it",
  Netherlands: "nl", Nederland: "nl", Colombia: "co", Belgium: "be",
  Uruguay: "uy", USA: "us", Croatia: "hr", Morocco: "ma", Chile: "cl",
  Peru: "pe", Ecuador: "ec", Nigeria: "ng", "South Korea": "kr", Turkey: "tr",
  Ghana: "gh", Egypt: "eg", Cameroon: "cm", Senegal: "sn", Algeria: "dz",
  "Ivory Coast": "ci", Sweden: "se", Denmark: "dk", Poland: "pl",
  Switzerland: "ch", Austria: "at", Scotland: "gb-sct", Wales: "gb-wls",
  Ireland: "ie", Norway: "no", Serbia: "rs", Canada: "ca", Australia: "au",
  "Saudi Arabia": "sa", Qatar: "qa", Iran: "ir", China: "cn", Paraguay: "py",
  Venezuela: "ve", Bolivia: "bo", "Costa Rica": "cr", Panama: "pa",
  Jamaica: "jm", Tunisia: "tn", "South Africa": "za", Greece: "gr",
  "Czech Republic": "cz", Ukraine: "ua", Hungary: "hu", Finland: "fi",
  Iceland: "is", Slovakia: "sk", Slovenia: "si",
};


/** Clublogo's, lokaal opgeslagen in public/logos/. */
const CLUB_LOGOS: Record<string, string> = {
  "Real Madrid": "real-madrid",
  "Manchester United": "manchester-united",
  "Manchester City": "manchester-city",
  "FC Barcelona": "fc-barcelona",
  Barcelona: "fc-barcelona",
  Liverpool: "liverpool",
  Arsenal: "arsenal",
  Chelsea: "chelsea",
  Tottenham: "tottenham",
  "Tottenham Hotspur": "tottenham",
  "Paris Saint-Germain": "paris-saint-germain",
  PSG: "paris-saint-germain",
  Inter: "inter",
  "Inter Milan": "inter",
  "AC Milan": "ac-milan",
  Milan: "ac-milan",
  Juventus: "juventus",
  Napoli: "napoli",
  "SSC Napoli": "napoli",
  Roma: "roma",
  "AS Roma": "roma",
  Bayern: "bayern",
  "Bayern Munich": "bayern",
  "Borussia Dortmund": "borussia-dortmund",
  Dortmund: "borussia-dortmund",
  Ajax: "ajax",
  Feyenoord: "feyenoord",
  PSV: "psv",
  Atletico: "atletico-madrid",
  "Atletico Madrid": "atletico-madrid",
  "Atlético Madrid": "atletico-madrid",
  Benfica: "benfica",
  Porto: "porto",
  Marseille: "marseille",
  "Olympique Marseille": "marseille",
  Newcastle: "newcastle",
  Everton: "everton",
  "Bayer Leverkusen": "bayer-leverkusen",
  Leverkusen: "bayer-leverkusen",
  Galatasaray: "galatasaray",
  Celtic: "celtic",
  Rangers: "rangers",
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
  const slug = CLUB_LOGOS[team];
  const [broken, setBroken] = useState(false);
  if (!slug || broken)
    return (
      <span className="font-display text-2xl font-bold text-primary transition-transform duration-300 group-hover:scale-110 sm:text-3xl">
        {monogram(team)}
      </span>
    );
  return (
    <img
      src={`/logos/${slug}.png`}
      alt={`${team} logo`}
      loading="lazy"
      onError={() => setBroken(true)}
      className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11"
    />
  );
};



/** Eerst alle clubs, daarna alle landen; even veel van beide zodat de rij vol eindigt. */
const items = [...topClubs, ...topCountries];

const ShopByTeam = () => (
  <section className="py-12">
    <div className="container mx-auto px-6">
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6">
        Shop by team &amp; country
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4">
        {items.map((t, i) => {
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
                    <ClubLogo team={t.team} />
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
