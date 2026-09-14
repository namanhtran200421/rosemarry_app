import type {
  ActivityResult,
  CircleActivity,
} from "../../social/types/circle.types";

import type { CircleMember } from "./activity-ui";
import { Flirty } from "./Flirty";
import { GuessWhoPlay, GuessWhoResultView } from "./GuessWho";
import { MatchingPlay, MatchingResultView } from "./Matching";
import { PickForPlay, PickForResultView } from "./PickFor";
import { ThisOrThatPlay, ThisOrThatResultView } from "./ThisOrThat";
import { TriviaPlay, TriviaResultView } from "./Trivia";

interface ActivityGameProps {
  activity: CircleActivity;
  members: CircleMember[];
  myPhoto?: string;
  onComplete: (result: ActivityResult) => void;
  onClose: () => void;
}

/**
 * Routes an activity to its game, or — once finished — to its result screen,
 * built from the stored result.
 */
export function ActivityGame({ activity, members, myPhoto, onComplete, onClose }: ActivityGameProps) {
  const shared = { members, onDone: onComplete };

  switch (activity.type) {
    case "trivia":
      return activity.done ? (
        <TriviaResultView game={activity.game} members={members} myPhoto={myPhoto} onClose={onClose} result={activity.result} />
      ) : (
        <TriviaPlay game={activity.game} {...shared} />
      );
    case "thisorthat":
      return activity.done ? (
        <ThisOrThatResultView game={activity.game} members={members} onClose={onClose} result={activity.result} />
      ) : (
        <ThisOrThatPlay game={activity.game} {...shared} />
      );
    case "guesswho":
      return activity.done ? (
        <GuessWhoResultView game={activity.game} members={members} myPhoto={myPhoto} onClose={onClose} result={activity.result} />
      ) : (
        <GuessWhoPlay game={activity.game} {...shared} />
      );
    case "matching":
      return activity.done ? (
        <MatchingResultView game={activity.game} members={members} onClose={onClose} result={activity.result} />
      ) : (
        <MatchingPlay game={activity.game} {...shared} />
      );
    case "pickfor":
      return activity.done ? (
        <PickForResultView members={members} onClose={onClose} result={activity.result} />
      ) : (
        <PickForPlay game={activity.game} {...shared} />
      );
    case "flirty":
      return (
        <Flirty
          game={activity.game}
          members={members}
          onClose={onClose}
          onDone={onComplete}
          saved={activity.myAnswer}
        />
      );
  }
}
