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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
        <ArrowRightCircle
          className="mb-2 h-6 w-6 opacity-60"
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
            "flex items-start gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm transition-colors",
            entry.wasCorrect
              ? "border-emerald-400/60 bg-emerald-50/30 text-emerald-900"
              : "border-rose-400/60 bg-rose-50/40 text-rose-900",
          )}
        >
          <span
            className={cn(
              "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              entry.wasCorrect
                ? "bg-emerald-500 text-white shadow-emerald-400/50"
                : "bg-rose-500 text-white shadow-rose-400/50",
            )}
          >
            {entry.wasCorrect ? (
              <ThumbsUp className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ThumbsDown className="h-5 w-5" aria-hidden="true" />
            )}
          </span>

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              {entry.card.domain} • {entry.card.difficulty}
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
