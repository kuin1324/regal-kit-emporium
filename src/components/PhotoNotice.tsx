import { Info, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

/** Meldingen boven elke collectie. Elke melding is los weg te drukken (blijft weg via localStorage). */
const NOTICES = ["photos", "monthly", "duplicates"] as const;
type NoticeId = (typeof NOTICES)[number];

const storageKey = (id: NoticeId) => `notice-dismissed-${id}`;

const PhotoNotice = () => {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    for (const id of NOTICES) {
      try {
        state[id] = localStorage.getItem(storageKey(id)) === "1";
      } catch {
        state[id] = false;
      }
    }
    return state;
  });

  const dismiss = (id: NoticeId) => {
    try {
      localStorage.setItem(storageKey(id), "1");
    } catch {
      /* private mode: melding verdwijnt alleen deze sessie */
    }
    setDismissed((s) => ({ ...s, [id]: true }));
  };

  const restoreAll = () => {
    for (const id of NOTICES) {
      try {
        localStorage.removeItem(storageKey(id));
      } catch {
        /* private mode */
      }
    }
    setDismissed({});
  };

  const anyDismissed = NOTICES.some((id) => dismissed[id]);

  const closeButton = (id: NoticeId) => (
    <button
      onClick={() => dismiss(id)}
      aria-label={t("notice.dismiss", { defaultValue: "Dismiss" })}
      className="ml-auto shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );

  return (
    <>
      {!dismissed.photos && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("notice.photos")}
          </p>
          {closeButton("photos")}
        </div>
      )}
      {!dismissed.monthly && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3">
          <p className="text-xs font-semibold text-primary">{t("notice.monthly")}</p>
          {closeButton("monthly")}
        </div>
      )}
      {!dismissed.duplicates && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
          <p className="text-xs leading-relaxed text-muted-foreground">{t("notice.duplicates")}</p>
          {closeButton("duplicates")}
        </div>
      )}
      {anyDismissed && (
        <button
          onClick={restoreAll}
          className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          {t("notice.restore", { defaultValue: "Show hidden notices" })}
        </button>
      )}
    </>
  );
};

export default PhotoNotice;
