import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, EyeOff, Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHidden } from "@/lib/hiddenWidgets";


interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatWidget = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: t("chat.welcome", { defaultValue: "Hi! 👋 Ask me anything about our shirts, sizes, shipping or your order." }) },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const draggedRef = useRef(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, busy]);

  // Welkomstbericht meevertalen zolang er nog niets gevraagd is.
  useEffect(() => {
    setMessages((m) =>
      m.length === 1 && m[0].role === "assistant"
        ? [{ role: "assistant", content: t("chat.welcome", { defaultValue: "Hi! 👋 Ask me anything about our shirts, sizes, shipping or your order." }) }]
        : m,
    );
  }, [i18n.language, t]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          language: i18n.language,
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const fallback =
          res.status === 429
            ? t("chat.rateLimit", { defaultValue: "Busy right now — please try again in a moment." })
            : res.status === 402
              ? t("chat.noCredits", { defaultValue: "The assistant is temporarily unavailable. Feel free to email us!" })
              : t("chat.error", { defaultValue: "Something went wrong. Please try again or email us." });
        setMessages([...next, { role: "assistant", content: fallback }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      setMessages([...next, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
            if (delta) {
              answer += delta;
              setMessages([...next, { role: "assistant", content: answer }]);
            }
          } catch {
            /* onvolledige chunk overslaan */
          }
        }
      }
    } catch {
      setMessages([...next, { role: "assistant", content: t("chat.error", { defaultValue: "Something went wrong. Please try again or email us." }) }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        drag
        dragMomentum={false}
        dragElastic={0.08}
        onDragStart={() => (draggedRef.current = true)}
        onDragEnd={(_, info) => {
          // Snap to grid van 20px zodat de knop netjes uitgelijnd blijft.
          const snap = (v: number) => Math.round(v / 20) * 20;
          setOffset((o) => ({ x: snap(o.x + info.offset.x), y: snap(o.y + info.offset.y) }));
          setTimeout(() => (draggedRef.current = false), 0);
        }}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={() => {
          if (draggedRef.current) return;
          setOpen((o) => !o);
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        title={t("chat.drag", { defaultValue: "Drag me somewhere else" })}
        aria-label={t("chat.open", { defaultValue: "Chat with our assistant" })}
        className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6366F1,#EC4899_45%,#F59E0B)] cursor-grab active:cursor-grabbing text-white shadow-[0_10px_30px_-8px_rgba(99,102,241,0.7)] transition-shadow hover:shadow-[0_14px_44px_-8px_rgba(236,72,153,0.75)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            style={{ transformOrigin: "bottom left" }}
            className="fixed bottom-24 left-5 z-50 flex h-[26rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl"
          >
            <div className="relative flex items-center gap-3 overflow-hidden px-4 py-3 text-white bg-[linear-gradient(120deg,#6366F1,#8B5CF6_35%,#EC4899_70%,#F59E0B)]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold leading-tight">{t("chat.title", { defaultValue: "HOFS Assistant" })}</p>
                <p className="text-[11px] text-white/80">{t("chat.subtitle", { defaultValue: "Usually replies within seconds" })}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("chat.close")}
                title={t("chat.close")}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
              >
                <X className="h-4 w-4" />
              </button>
            </div>


            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-[linear-gradient(135deg,#6366F1,#EC4899)] px-3.5 py-2 text-sm text-white"
                        : "max-w-[90%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                    }
                  >

                    {m.content}
                  </div>
                </motion.div>
              ))}
              {busy && messages[messages.length - 1]?.role === "user" && (
                <p className="animate-pulse text-sm text-muted-foreground">{t("chat.thinking", { defaultValue: "Typing…" })}</p>
              )}
            </div>

            <div className="border-t border-border/60 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder={t("chat.placeholder", { defaultValue: "Ask your question…" })}
                  className="max-h-24 flex-1 resize-none rounded-xl border border-border/60 bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/60"
                />
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={busy || !input.trim()}
                  aria-label={t("chat.send", { defaultValue: "Send" })}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#6366F1,#EC4899)] text-white transition-opacity disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
