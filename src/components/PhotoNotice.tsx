import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Melding boven elke collectie: foto's kunnen kleine randjes missen. */
const PhotoNotice = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("notice.photos", {
          defaultValue:
            "Let op: onze foto's kunnen kleine uithappen of veegjes hebben. Dat komt doordat onze AI-achtergrondverwijderaar nog niet perfect werkt — het shirt zelf is helemaal in orde. Vraag gerust om extra foto's via e-mail of de chat.",
        })}
      </p>
    </div>
  );
};

export default PhotoNotice;
