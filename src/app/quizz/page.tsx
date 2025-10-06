import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { QuizArena } from "@/components/quiz/quiz-arena";

export const metadata: Metadata = {
  title: "Quiz de révision | StockAI",
  description:
    "Flashcards interactives façon Tinder pour muscler tes connaissances en économie et en droit français.",
};

export default function QuizzPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:py-12">
      <section className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/80 p-8 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Quiz Flashcards : swipe, apprends, recommence !
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Chaque carte t’oppose à une affirmation sur l’économie ou le droit
              français. Glisse vers la droite pour « Vrai », vers la gauche pour
              « Faux » et décroche des points. Les explications arrivent tout de
              suite pour t’aider à mémoriser.
            </p>
          </div>
        </div>
      </section>

      <QuizArena />
    </main>
  );
}
