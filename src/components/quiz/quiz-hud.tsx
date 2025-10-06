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
    <section className="grid gap-3 md:grid-cols-3">
      <HudCard
        title="Score total"
        description={`${score} point${score > 1 ? "s" : ""} cumulé${score > 1 ? "s" : ""}`}
        icon={<PartyPopper className="h-5 w-5" aria-hidden="true" />}
        emphasis
      >
        <span className="text-3xl font-bold text-primary">{score}</span>
      </HudCard>

      <HudCard
        title="Progression"
        description={`${answeredCards}/${totalCards} cartes jouées`}
        icon={<GaugeCircle className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-200"
            style={{ width: `${completion}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{completion}%</span>
      </HudCard>

      <HudCard
        title="Séries"
        description={`Meilleure : ${bestStreak}`}
        icon={<BrainCircuit className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-lg font-semibold",
              streak >= 3 ? "text-emerald-500" : "text-foreground",
            )}
          >
            Série en cours : {streak}
          </span>
          {streak >= 3 && (
            <span className="rounded-full bg-emerald-100/80 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              🔥 Bravo !
            </span>
          )}
        </div>
      </HudCard>

      <div className="md:col-span-3">
        <HudCard
          title="Cartes restantes"
          icon={<Repeat2 className="h-5 w-5" aria-hidden="true" />}
          description="Garde un œil sur tes zones de confort (et de sueur)."
        >
          <ul className="grid gap-2 sm:grid-cols-2">
            {remainingByDomain.map(({ domain, remaining }) => (
              <li
                key={domain}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
              >
                <span>{domain}</span>
                <span className="font-semibold text-foreground">
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
        "flex h-full flex-col gap-2 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur",
        emphasis && "border-primary/60 shadow-primary/20",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground",
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

      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
