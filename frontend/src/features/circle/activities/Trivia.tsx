import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { brut, fonts } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import type { TriviaGame, TriviaResult } from "../../social/types/circle.types";

import {
  CloseButton,
  Gap,
  type GameProps,
  Heading,
  Leaderboard,
  OptionButton,
  ResultHero,
  ReviewCard,
  SectionTitle,
  StepLabel,
  type CircleMember,
} from "./activity-ui";

const scoreOf = (game: TriviaGame, answers: number[]) =>
  answers.reduce((total, answer, index) => total + (answer === game.questions[index].answer ? 1 : 0), 0);

export function TriviaPlay({ game, onDone }: GameProps<TriviaGame, TriviaResult>) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const question = game.questions[index];
  const answered = picked !== null;
  const isLast = index === game.questions.length - 1;

  function next(): void {
    if (isLast) {
      onDone({ answers, score: scoreOf(game, answers) });
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  return (
    <View>
      <StepLabel label={`${game.topic} trivia · ${index + 1}/${game.questions.length}`} />
      <Heading>{question.q}</Heading>
      {question.options.map((option, optionIndex) => (
        <OptionButton
          key={option}
          correct={answered && optionIndex === question.answer}
          label={option}
          onPress={
            answered
              ? undefined
              : () => {
                  setPicked(optionIndex);
                  setAnswers([...answers, optionIndex]);
                }
          }
          wrong={answered && optionIndex === picked && picked !== question.answer}
        />
      ))}
      {answered ? (
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>
          {picked === question.answer
            ? "Correct! 🎉"
            : `Not quite — it was “${question.options[question.answer]}”.`}
        </Text>
      ) : null}
      <AppButton
        disabled={!answered}
        label={isLast ? "See results" : "Next question"}
        onPress={next}
        size="md"
      />
    </View>
  );
}

interface TriviaResultViewProps {
  game: TriviaGame;
  members: CircleMember[];
  result?: TriviaResult;
  myPhoto?: string;
  onClose: () => void;
}

export function TriviaResultView({ game, members, result, myPhoto, onClose }: TriviaResultViewProps) {
  const answers = result?.answers ?? [];
  const score = result?.score ?? scoreOf(game, answers);
  const total = game.questions.length;
  const perfect = score === total;

  return (
    <View>
      <ResultHero
        emoji={perfect ? "🏆" : "🧠"}
        headline={`You scored ${score}/${total}`}
        sub={perfect ? "A perfect round — nobody beats that." : `${game.topic} trivia · ${total} questions`}
      />
      <SectionTitle title="Circle ranking" />
      <Leaderboard members={members} myPhoto={myPhoto} myScore={score} seed={`${game.topic}trivia`} total={total} />
      <Gap />
      <SectionTitle title="Questions and answers" />
      {game.questions.map((question, index) => (
        <ReviewCard
          key={question.q}
          correct={question.options[question.answer]}
          gotIt={answers[index] === question.answer}
          index={index + 1}
          question={question.q}
          yours={answers[index] !== undefined ? question.options[answers[index]] : null}
        />
      ))}
      <CloseButton onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  feedback: {
    marginTop: 2,
    marginBottom: 16,
    color: brut.ink,
    fontFamily: fonts.semibold,
    fontSize: 13.5,
  },
});
