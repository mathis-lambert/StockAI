"use client";

import * as React from "react";
import { BrainCircuit, GaugeCircle, PartyPopper, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KnowledgeDomain } from "./question-bank";

type DomainStats = {
  domain: KnowledgeDomain;
  remaining: number;
};

type QuizHudProps = {
  score: number;
  totalCards: number;
  answeredCards: number;
  streak: number;
  bestStreak: number;
  remainingByDomain: DomainStats[];
};

export function QuizHud({
  score,
  totalCards,
  answeredCards,
  streak,
  bestStreak,
  remainingByDomain,
}: QuizHudProps) {
  const completion = Math.round((answeredCards / totalCards) * 100);

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <HudCard
        title="Score total"
        description={`${score} point${score > 1 ? "s" : ""} cumulé${score > 1 ? "s" : ""}`}
        icon={<PartyPopper className="h-5 w-5" aria-hidden="true" />}
        emphasis
      >
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-black tracking-tight text-primary">
            {score}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            points
          </span>
        </div>
      </HudCard>

      <HudCard
        title="Progression"
        description={`${answeredCards}/${totalCards} cartes jouées`}
        icon={<GaugeCircle className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60 dark:bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${completion}%` }}
            aria-hidden="true"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {completion}% complété
        </span>
      </HudCard>

      <HudCard
        title="Séries"
        description={`Meilleure : ${bestStreak}`}
        icon={<BrainCircuit className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-lg font-semibold transition-colors",
              streak >= 3 ? "text-primary" : "text-foreground",
            )}
          >
            Série en cours : {streak}
          </span>
          {streak >= 3 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              🔥 Bravo !
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Record : {bestStreak}</span>
          <span>
            {bestStreak > 0 ? "Garde ce flow !" : "On s’échauffe encore 💪"}
          </span>
        </div>
      </HudCard>

      <div className="sm:col-span-2 xl:col-span-3">
        <HudCard
          title="Cartes restantes"
          icon={<Repeat2 className="h-5 w-5" aria-hidden="true" />}
          description="Garde un œil sur tes zones de confort (et de sueur)."
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {remainingByDomain.map(({ domain, remaining }) => (
              <li
                key={domain}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/40"
              >
                <span className="text-sm font-semibold">{domain}</span>
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {remaining} carte{remaining > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        </HudCard>
      </div>
    </section>
  );
}

type HudCardProps = {
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  emphasis?: boolean;
};

function HudCard({
  title,
  icon,
  description,
  children,
  emphasis = false,
}: HudCardProps) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl border border-border/60 bg-card p-5 shadow-sm transition-colors",
        emphasis ? "border-primary/60 shadow-md" : "hover:border-primary/40",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground",
            emphasis && "bg-primary/10 text-primary",
          )}
        >
          {icon}
        </span>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
