"use client";

import * as React from "react";
import { BadgeCheck, Flame, Scale, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KnowledgeDomain, QuizCard } from "./question-bank";

const domainBadge: Record<KnowledgeDomain, { label: string; accent: string }> =
  {
    Économie: {
      label: "Éco",
      accent: "from-emerald-400/80 via-emerald-500/80 to-emerald-600/80",
    },
    "Droit français": {
      label: "Droit",
      accent: "from-sky-400/80 via-sky-500/80 to-sky-600/80",
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

  const statusColors =
    status === "correct"
      ? "ring-emerald-400/70 shadow-emerald-400/30"
      : status === "incorrect"
        ? "ring-rose-500/70 shadow-rose-500/30"
        : "ring-border shadow-black/10";

  return (
    <article
      className={cn(
        "pointer-events-none relative flex w-full max-w-lg flex-col gap-3 rounded-3xl border border-border/70 bg-card/95 p-5 shadow-xl transition-all duration-200",
        "backdrop-blur-md will-change-transform",
        isActive ? "pointer-events-auto" : "scale-[0.96] opacity-90",
        statusColors,
      )}
      style={style}
    >
      <header className="flex items-center justify-between">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white shadow-sm",
            domain.accent,
          )}
        >
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{domain.label}</span>
        </div>

        <div
          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
          aria-label={`Difficulté : ${difficultyLabel}`}
        >
          {difficultyIcon}
          <span>{difficultyLabel}</span>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <p className="text-balance text-lg font-semibold leading-snug text-foreground">
          {card.prompt}
        </p>

        {card.spiceLine && (
          <p className="text-sm text-muted-foreground/90">{card.spiceLine}</p>
        )}
      </div>

      <footer
        className={cn(
          "mt-auto rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-sm transition-[max-height,opacity] duration-200 ease-out",
          reveal
            ? "max-h-72 opacity-100"
            : "max-h-[0px] overflow-hidden opacity-0",
        )}
        aria-live="polite"
      >
        <p className="text-muted-foreground">{card.explanation}</p>
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
        "pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-200",
        preview ? "opacity-100" : "opacity-0",
        preview === "right"
          ? "bg-emerald-400/20 ring-emerald-300/60"
          : "bg-rose-400/20 ring-rose-300/60",
      )}
      aria-hidden="true"
    />
  );
}
