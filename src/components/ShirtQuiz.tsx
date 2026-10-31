import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, CircleHelp, ExternalLink, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildShirtQuiz, quizScore, type QuizProduct } from "@/lib/shirtQuiz";

export default function ShirtQuiz({ product }: { product: QuizProduct }) {
  const questions = useMemo(() => buildShirtQuiz(product), [product]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const current = questions[index];
  const answered = answers[index] != null;
  const finished = index >= questions.length;
  const reset = () => { setAnswers([]); setIndex(0); setStarted(true); };

  return (
    <section aria-label="Shirt quiz" className="border-y border-border py-6 mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-display text-xl font-semibold flex items-center gap-2"><CircleHelp className="h-5 w-5 text-primary" /> Shirt quiz</h3>
        {started && <Button variant="ghost" size="icon" aria-label="Close quiz" onClick={() => setStarted(false)}><X /></Button>}
      </div>
      {!started ? (
        <Button variant="gold-outline" className="w-full" onClick={reset}><CircleHelp /> Play quiz · {questions.length} questions</Button>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={finished ? "result" : index} initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -20 }} transition={{ duration: reducedMotion ? 0 : 0.3 }}>
            {finished ? (
              <div className="space-y-4" role="status">
                <Trophy className="h-9 w-9 text-primary" />
                <p className="font-display text-2xl font-semibold">{quizScore(questions, answers)} / {questions.length} correct</p>
                <p className="text-sm text-muted-foreground">{quizScore(questions, answers) === questions.length ? "Perfect score!" : "Quiz complete!"}</p>
                <Button variant="outline" onClick={reset}><RotateCcw /> Play again</Button>
              </div>
            ) : current ? (
              <div>
                <p className="text-xs text-primary mb-3">Question {index + 1} / {questions.length}</p>
                <div className="flex gap-1 mb-5" aria-hidden="true">{questions.map((item, step) => <span key={item.id} className={`h-1 flex-1 rounded ${step <= index ? "bg-primary" : "bg-muted"}`} />)}</div>
                <h4 className="text-lg font-semibold mb-4">{current.prompt}</h4>
                <div className="grid gap-2">
                  {current.options.map((option, optionIndex) => (
                    <Button key={option} variant="outline" disabled={answered} onClick={() => setAnswers(prev => { if (prev[index] != null) return prev; const next = [...prev]; next[index] = option; return next; })}
                      className={`w-full h-auto min-h-12 justify-start whitespace-normal text-left py-3 disabled:opacity-100 ${answered && option === current.answer ? "border-primary bg-primary/10 text-primary" : answered && answers[index] === option ? "border-destructive text-destructive" : ""}`}>
                      <span className="text-xs text-muted-foreground w-4 shrink-0">{String.fromCharCode(65 + optionIndex)}</span><span className="flex-1 min-w-0 break-words">{option}</span>
                      {answered && option === current.answer && <Check />}
                      {answered && answers[index] === option && option !== current.answer && <X />}
                    </Button>
                  ))}
                </div>
                {answered && <div className="mt-4 space-y-3" role="status" aria-live="polite">
                  <p className="font-semibold text-sm">{answers[index] === current.answer ? "Correct!" : `Correct answer: ${current.answer}`}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{current.explanation}</p>
                  {current.source && <Button asChild variant="link" className="h-auto p-0 whitespace-normal text-left"><a href={current.source.url} target="_blank" rel="noopener noreferrer">{current.source.label}<ExternalLink /></a></Button>}
                  <Button onClick={() => setIndex(prev => prev + 1)} className="w-full">{index === questions.length - 1 ? "See score" : "Next question"}<ArrowRight /></Button>
                </div>}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}