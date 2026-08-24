import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: (email: string) => void;
}

/** Nette in-app e-mailvraag in plaats van de lelijke browser prompt(). */
const EmailPromptModal = ({
  open,
  title = "Your email address",
  description = "We need your email for the order confirmation and track & trace.",
  confirmLabel = "Continue",
  onCancel,
  onConfirm,
}: Props) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setError("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const submit = () => {
    const email = value.trim();
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address, e.g. name@example.com");
      return;
    }
    onConfirm(email);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <button
              onClick={onCancel}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pt-7 pb-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>

              <input
                ref={inputRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                  if (e.key === "Escape") onCancel();
                }}
                placeholder="name@example.com"
                className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

              <div className="mt-5 flex gap-2">
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={submit}
                  className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmailPromptModal;
