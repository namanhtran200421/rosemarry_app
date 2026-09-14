import type { IconName } from "../../../shared/ui/Icon";

import type { PersonSummary } from "./social.types";

export interface TriviaGame {
  topic: string;
  questions: { q: string; options: string[]; answer: number }[];
}

export interface ThisOrThatGame {
  options: string[];
}

export interface GuessWhoGame {
  rounds: { memberId: string; clues: string[] }[];
}

export interface MatchingGame {
  questions: { q: string; options: string[] }[];
  memberAnswers: Record<string, number[]>;
}

export interface PickForGame {
  tasks: { forMemberId: string; prompt: string; options: string[] }[];
}

export interface FlirtyGame {
  prompt: string;
  answers: { id: string; memberId: string; text: string }[];
}

export interface TriviaResult {
  answers: number[];
  score: number;
}

export interface ThisOrThatResult {
  champ: string;
  beaten: { loser: string; winner: string }[];
}

export interface GuessWhoResult {
  picks: string[];
  score: number;
}

export interface MatchingResult {
  answers: number[];
}

export interface PickForResult {
  picks: { forMemberId: string; q: string; choice: string }[];
}

interface ActivityBase {
  id: string;
  /** 0 = Tuesday … 5 = Sunday. */
  day: number;
  icon: IconName;
  title: string;
  prompt: string;
  done: boolean;
  count: number;
}

export type CircleActivity =
  | (ActivityBase & { type: "trivia"; game: TriviaGame; result?: TriviaResult })
  | (ActivityBase & {
      type: "thisorthat";
      game: ThisOrThatGame;
      result?: ThisOrThatResult;
    })
  | (ActivityBase & {
      type: "guesswho";
      game: GuessWhoGame;
      result?: GuessWhoResult;
    })
  | (ActivityBase & {
      type: "matching";
      game: MatchingGame;
      result?: MatchingResult;
    })
  | (ActivityBase & {
      type: "pickfor";
      game: PickForGame;
      result?: PickForResult;
    })
  | (ActivityBase & { type: "flirty"; game: FlirtyGame; myAnswer?: string });

export type ActivityResult =
  | TriviaResult
  | ThisOrThatResult
  | GuessWhoResult
  | MatchingResult
  | PickForResult
  | string;

export interface CircleMessage {
  from: string;
  text: string;
  /** Photo key or remote image URI. */
  image?: string;
}

export interface Circle {
  id: string;
  name: string;
  theme: string;
  matchedOn: string[];
  refreshDays: number;
  todayIndex: number;
  hoursToNext: number;
  unread: number;
  settings: { notifications: boolean; muted: boolean };
  members: Required<Pick<PersonSummary, "id" | "name" | "age" | "photo">>[];
  activities: CircleActivity[];
  messages: CircleMessage[];
}
