import type { QuizCard } from "./question-bank";
import type { SwipeDirection } from "./flashcard";

export type AnswerSnapshot = {
  card: QuizCard;
  guessIsTrue: boolean;
  wasCorrect: boolean;
  direction: SwipeDirection;
  timestamp: number;
};
