"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Hand,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flashcard, type SwipeDirection } from "./flashcard";
import { QuizHud } from "./quiz-hud";
import { AnswerFeed } from "./answer-feed";
import {
  buildQuizDeck,
  countByDomain,
  type KnowledgeDomain,
  type QuizCard,
} from "./question-bank";
import type { AnswerSnapshot } from "./quiz-types";

type DragState = {
  isDragging: boolean;
  startX: number;
  x: number;
  preview: SwipeDirection | null;
};

const initialDragState: DragState = {
  isDragging: false,
  startX: 0,
  x: 0,
  preview: null,
};

export function QuizArena() {
  const [deck, setDeck] = React.useState<QuizCard[]>(() => buildQuizDeck());
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);
  const [history, setHistory] = React.useState<AnswerSnapshot[]>([]);
  const [drag, setDrag] = React.useState<DragState>(initialDragState);
  const [cardStatus, setCardStatus] = React.useState<
    "pending" | "correct" | "incorrect"
  >("pending");
  const [interactionsLocked, setInteractionsLocked] = React.useState(false);

  const totalCardsRef = React.useRef(deck.length);
  const lastAnimationTimeout = React.useRef<number | null>(null);

  const activeCard = deck[0];
  const secondaryCards = deck.slice(1, 3);
  const isComplete = deck.length === 0;
  const answeredCards = totalCardsRef.current - deck.length;

  const remainingByDomain = React.useMemo(() => {
    const counts = countByDomain(deck);
    return (Object.entries(counts) as Array<[KnowledgeDomain, number]>).map(
      ([domain, remaining]) => ({
        domain,
        remaining,
      }),
    );
  }, [deck]);

  const clearAnimationTimeout = React.useCallback(() => {
    if (lastAnimationTimeout.current !== null) {
      window.clearTimeout(lastAnimationTimeout.current);
      lastAnimationTimeout.current = null;
    }
  }, []);

  const scheduleAfterAnimation = React.useCallback(
    (callback: () => void) => {
      clearAnimationTimeout();
      lastAnimationTimeout.current = window.setTimeout(() => {
        callback();
        clearAnimationTimeout();
      }, 240);
    },
    [clearAnimationTimeout],
  );

  const triggerAnswer = React.useCallback(
    (card: QuizCard, direction: SwipeDirection) => {
      if (interactionsLocked) {
        return;
      }

      const guessIsTrue = direction === "right";
      const wasCorrect = guessIsTrue === card.answerIsTrue;

      setInteractionsLocked(true);
      setCardStatus(wasCorrect ? "correct" : "incorrect");
      setDrag({
        isDragging: false,
        startX: 0,
        x: direction === "right" ? 520 : -520,
        preview: direction,
      });

      setScore((prev) => (wasCorrect ? prev + 2 : prev > 0 ? prev - 1 : 0));
      setStreak((prev) => {
        const next = wasCorrect ? prev + 1 : 0;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });

      setHistory((prev) => {
        const snapshot: AnswerSnapshot = {
          card,
          guessIsTrue,
          wasCorrect,
          direction,
          timestamp: Date.now(),
        };
        return [snapshot, ...prev].slice(0, 5);
      });

      scheduleAfterAnimation(() => {
        setDeck((prev) => prev.slice(1));
        setCardStatus("pending");
        setDrag(initialDragState);
        setInteractionsLocked(false);
      });
    },
    [interactionsLocked, scheduleAfterAnimation],
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!activeCard || interactionsLocked) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      setDrag({
        isDragging: true,
        startX: event.clientX,
        x: 0,
        preview: null,
      });
    },
    [activeCard, interactionsLocked],
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!activeCard || interactionsLocked) {
        return;
      }
      setDrag((current) => {
        if (!current.isDragging) {
          return current;
        }
        const delta = event.clientX - current.startX;
        const preview =
          Math.abs(delta) > 60 ? (delta > 0 ? "right" : "left") : null;
        return {
          ...current,
          x: delta,
          preview,
        };
      });
    },
    [activeCard, interactionsLocked],
  );

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!activeCard || interactionsLocked) {
        return;
      }

      const threshold = 120;
      const delta = drag.x;

      event.currentTarget.releasePointerCapture(event.pointerId);

      if (Math.abs(delta) >= threshold) {
        triggerAnswer(activeCard, delta > 0 ? "right" : "left");
      } else {
        setDrag({
          isDragging: false,
          startX: 0,
          x: 0,
          preview: null,
        });
      }
    },
    [activeCard, drag.x, interactionsLocked, triggerAnswer],
  );

  const handleAnswerWithButton = React.useCallback(
    (direction: SwipeDirection) => {
      if (activeCard) {
        triggerAnswer(activeCard, direction);
      }
    },
    [activeCard, triggerAnswer],
  );

  const handleReset = React.useCallback(() => {
    clearAnimationTimeout();
    const freshDeck = buildQuizDeck();
    totalCardsRef.current = freshDeck.length;

    setDeck(freshDeck);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setHistory([]);
    setDrag(initialDragState);
    setCardStatus("pending");
    setInteractionsLocked(false);
  }, [clearAnimationTimeout]);

  React.useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!activeCard || interactionsLocked) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        triggerAnswer(activeCard, "left");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        triggerAnswer(activeCard, "right");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeCard, interactionsLocked, triggerAnswer]);

  React.useEffect(
    () => () => {
      clearAnimationTimeout();
    },
    [clearAnimationTimeout],
  );

  React.useEffect(() => {
    totalCardsRef.current = Math.max(
      totalCardsRef.current,
      deck.length + answeredCards,
    );
  }, [deck.length, answeredCards]);

  return (
    <div className="flex flex-col gap-8">
      <QuizHud
        score={score}
        totalCards={totalCardsRef.current}
        answeredCards={answeredCards}
        streak={streak}
        bestStreak={bestStreak}
        remainingByDomain={remainingByDomain}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-border/70 bg-card/60 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Fais glisser pour jouer
                </h2>
                <p className="text-sm text-muted-foreground">
                  Swipe vers la droite pour dire que l’affirmation est vraie,
                  vers la gauche pour dire qu’elle est fausse. Les touches
                  fléchées fonctionnent aussi.
                </p>
              </div>

              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Hand className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
          </div>

          <div className="relative flex min-h-[20rem] items-center justify-center">
            {isComplete ? (
              <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-primary/50 bg-primary/10 p-8 text-center text-primary">
                <PartyPopper className="h-12 w-12" aria-hidden="true" />
                <p className="text-lg font-semibold">
                  Deck terminé ! Tu peux relancer un tour pour continuer à
                  briller.
                </p>
                <Button onClick={handleReset} size="lg" variant="default">
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Relancer une série
                </Button>
              </div>
            ) : (
              <div className="relative flex w-full max-w-xl justify-center">
                {secondaryCards.map((card, index) => {
                  const depth = index + 1;
                  const offset = depth * 12;
                  const scale = 1 - depth * 0.05;
                  return (
                    <div
                      key={card.id}
                      className="absolute inset-0 flex justify-center"
                      style={{
                        transform: `translateY(${offset}px) scale(${scale})`,
                        opacity: 0.6 - index * 0.15,
                      }}
                      aria-hidden="true"
                    >
                      <Flashcard card={card} isActive={false} reveal={false} />
                    </div>
                  );
                })}

                {activeCard && (
                  <div
                    className={cn(
                      "relative flex w-full justify-center",
                      interactionsLocked && "cursor-wait",
                      drag.isDragging ? "cursor-grabbing" : "cursor-grab",
                    )}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    role="button"
                    tabIndex={0}
                    aria-label="Carte de quiz interactive"
                  >
                    <Flashcard
                      card={activeCard}
                      isActive
                      reveal={false}
                      style={{
                        transform: `translateX(${drag.x}px) rotate(${drag.x / 20}deg)`,
                        transition: drag.isDragging
                          ? "none"
                          : "transform 0.25s ease-out",
                      }}
                      swipePreview={drag.preview}
                      status={cardStatus}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {!isComplete && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleAnswerWithButton("left")}
                disabled={!activeCard || interactionsLocked}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Faux (←)
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={() => handleAnswerWithButton("right")}
                disabled={!activeCard || interactionsLocked}
                className="gap-2"
              >
                Vrai (→)
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleReset}
                disabled={interactionsLocked}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Mélanger
              </Button>
            </div>
          )}
        </div>

        <aside className="flex h-full flex-col gap-4 rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <header className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Tes dernières réponses
            </h3>
            <span className="text-xs text-muted-foreground">
              {history.length} / 5
            </span>
          </header>
          <AnswerFeed history={history} />
        </aside>
      </section>
    </div>
  );
}
