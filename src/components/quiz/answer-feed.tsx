"use client";

import * as React from "react";
import {
  ArrowRightCircle,
  ArrowUpRight,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnswerSnapshot } from "./quiz-types";

type AnswerFeedProps = {
  history: AnswerSnapshot[];
};

export function AnswerFeed({ history }: AnswerFeedProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary/40 bg-card px-6 py-8 text-sm text-muted-foreground shadow-sm">
        <ArrowRightCircle
          className="mb-3 h-7 w-7 text-primary opacity-70"
          aria-hidden="true"
        />
        Commence par swiper une carte : tu verras ici tes coups d’éclat (et tes
        petites erreurs).
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {history.map((entry) => (
        <li
          key={`${entry.card.id}-${entry.timestamp}`}
          className={cn(
            "group grid gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[auto_1fr]",
            entry.wasCorrect
              ? "border-sky-300/60 text-sky-900 dark:border-sky-500/40 dark:text-sky-100"
              : "border-rose-300/60 text-rose-900 dark:border-rose-500/40 dark:text-rose-100",
          )}
        >
          <span
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-105",
              entry.wasCorrect
                ? "bg-primary text-primary-foreground shadow-sky-400/40"
                : "bg-rose-500 text-white shadow-rose-400/50",
            )}
          >
            {entry.wasCorrect ? (
              <ThumbsUp className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ThumbsDown className="h-5 w-5" aria-hidden="true" />
            )}
          </span>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-foreground shadow-sm dark:bg-white/10">
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                {entry.card.domain}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-0.5 text-[0.7rem] uppercase dark:bg-white/5">
                {entry.card.difficulty}
              </span>
            </div>

            <p className="font-medium text-foreground">{entry.card.prompt}</p>

            <p className="text-xs text-muted-foreground">
              Ta réponse :{" "}
              <span className="font-semibold text-foreground">
                {entry.guessIsTrue ? "Vrai" : "Faux"}
              </span>{" "}
              — Réponse attendue :{" "}
              <span className="font-semibold text-foreground">
                {entry.card.answerIsTrue ? "Vrai" : "Faux"}
              </span>
            </p>
            <p className="text-xs text-muted-foreground/80">
              {entry.wasCorrect
                ? "Bien vu 💡 !"
                : "Ce n’est pas ça, mais tu ne lâches rien 💪."}
            </p>

            <p className="text-xs text-muted-foreground">
              {entry.card.explanation}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
