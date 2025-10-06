"use client";

import * as React from "react";
import { BadgeCheck, Flame, Scale, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KnowledgeDomain, QuizCard } from "./question-bank";

const domainBadge: Record<
  KnowledgeDomain,
  { label: string; badgeClass: string; surfaceClass: string }
> = {
  Économie: {
    label: "Éco",
    badgeClass:
      "bg-sky-500 text-white shadow-sm shadow-sky-200/40 dark:bg-sky-500",
    surfaceClass: "bg-card",
  },
  "Droit français": {
    label: "Droit",
    badgeClass:
      "bg-blue-600 text-white shadow-sm shadow-blue-200/40 dark:bg-blue-500",
    surfaceClass: "bg-card",
  },
};

const difficultyIcons: Record<QuizCard["difficulty"], React.ReactNode> = {
  facile: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
  moyen: <Scale className="h-3.5 w-3.5" aria-hidden="true" />,
  costaud: <Flame className="h-3.5 w-3.5" aria-hidden="true" />,
};

const difficultyLabels: Record<QuizCard["difficulty"], string> = {
  facile: "Ça passe crème",
  moyen: "Faut cogiter",
  costaud: "Niveau boss",
};

const difficultyStyles: Record<QuizCard["difficulty"], string> = {
  facile:
    "border border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/15 dark:text-sky-100",
  moyen:
    "border border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-100",
  costaud:
    "border border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-100",
};

export type SwipeDirection = "left" | "right";

type FlashcardProps = {
  card: QuizCard;
  isActive: boolean;
  style?: React.CSSProperties;
  swipePreview?: SwipeDirection | null;
  status?: "pending" | "correct" | "incorrect";
  reveal: boolean;
};

export function Flashcard({
  card,
  isActive,
  style,
  swipePreview,
  status = "pending",
  reveal,
}: FlashcardProps) {
  const domain = domainBadge[card.domain];
  const difficultyIcon = difficultyIcons[card.difficulty];
  const difficultyLabel = difficultyLabels[card.difficulty];

  const statusClasses =
    status === "correct"
      ? "border-sky-400/60 shadow-lg shadow-sky-400/25"
      : status === "incorrect"
        ? "border-rose-400/60 shadow-lg shadow-rose-400/25"
        : "border-border/70 shadow-[0_16px_32px_-24px_rgba(15,37,72,0.4)] dark:shadow-[0_18px_36px_-28px_rgba(8,47,73,0.6)]";

  return (
    <article
      className={cn(
        "relative flex w-full max-w-lg flex-col gap-4 rounded-[2rem] border bg-card p-6 shadow-lg transition-all duration-300 ease-out",
        "will-change-transform",
        domain.surfaceClass,
        isActive
          ? "pointer-events-auto hover:-translate-y-1 hover:shadow-2xl"
          : "pointer-events-none scale-[0.96] opacity-80",
        statusClasses,
      )}
      style={style}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            domain.badgeClass,
          )}
        >
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{domain.label}</span>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            difficultyStyles[card.difficulty],
          )}
          aria-label={`Difficulté : ${difficultyLabel}`}
        >
          {difficultyIcon}
          <span>{difficultyLabel}</span>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <p className="text-balance text-lg font-semibold leading-tight text-foreground sm:text-xl">
          {card.prompt}
        </p>

        {card.spiceLine && (
          <p className="text-sm font-medium text-muted-foreground/80">
            {card.spiceLine}
          </p>
        )}
      </div>

      <footer
        className={cn(
          "mt-auto rounded-2xl border border-border/60 bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground shadow-inner transition-[max-height,opacity] duration-300 ease-out dark:bg-white/5",
          reveal
            ? "max-h-72 opacity-100"
            : "max-h-[0px] overflow-hidden opacity-0",
        )}
        aria-live="polite"
      >
        <p>{card.explanation}</p>
      </footer>

      <SwipeIndicator preview={swipePreview} />
    </article>
  );
}

type SwipeIndicatorProps = {
  preview: SwipeDirection | null | undefined;
};

function SwipeIndicator({ preview }: SwipeIndicatorProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-transparent transition-all duration-300 ease-out",
        preview ? "scale-[1.01] opacity-100" : "scale-100 opacity-0",
        preview === "right"
          ? "bg-sky-400/15 ring-sky-300/50"
          : "bg-rose-400/15 ring-rose-300/50",
      )}
      aria-hidden="true"
    />
  );
}
