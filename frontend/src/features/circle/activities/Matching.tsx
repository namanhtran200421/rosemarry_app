import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { brut, fonts } from "../../../shared/theme/tokens";
import { Card } from "../../../shared/ui/Card";
import { Tag } from "../../../shared/ui/Tag";
import type {
  MatchingGame,
  MatchingResult,
} from "../../social/types/circle.types";

import {
  CloseButton,
  type CircleMember,
  Gap,
  type GameProps,
  Heading,
  OptionButton,
  RankRow,
  ResultHero,
  SectionTitle,
  StepLabel,
} from "./activity-ui";

export function MatchingPlay({ game, onDone }: GameProps<MatchingGame, MatchingResult>) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const question = game.questions[index];

  function answer(option: number): void {
    const next = [...answers, option];
    if (index === game.questions.length - 1) {
      onDone({ answers: next });
      return;
    }
    setAnswers(next);
    setIndex(index + 1);
  }

  return (
    <View>
      <StepLabel label={`Matching answers · ${index + 1}/${game.questions.length}`} />
      <Heading>{question.q}</Heading>
      {question.options.map((option, optionIndex) => (
        <OptionButton key={option} label={option} onPress={() => answer(optionIndex)} />
      ))}
    </View>
  );
}

interface ResultProps {
  game: MatchingGame;
  members: CircleMember[];
  result?: MatchingResult;
  onClose: () => void;
}

export function MatchingResultView({ game, members, result, onClose }: ResultProps) {
  const mine = result?.answers ?? [];
  const total = game.questions.length;
  const ranking = members
    .map((member) => {
      const theirs = game.memberAnswers[member.id] ?? [];
      return {
        member,
        shared: mine.filter((answer, index) => theirs[index] === answer).length,
      };
    })
    .sort((a, b) => b.shared - a.shared);
  const top = ranking[0];

  return (
    <View>
      <ResultHero
        emoji="💫"
        headline={top ? `${top.member.name} is your closest match` : "Your compatibility ranking"}
        sub={
          top
            ? `You lined up on ${top.shared} of ${total} scenarios. Only you can see this.`
            : "Only you can see this ranking."
        }
      />
      <SectionTitle title="Your compatibility ranking" note="Private — nobody else sees your answers." />
      {ranking.map(({ member, shared }, index) => (
        <RankRow key={member.id} member={member} rank={index + 1} value={`${shared}/${total}`} />
      ))}
      <Gap />
      <SectionTitle title="What you answered" />
      {game.questions.map((question, index) => (
        <Card key={question.q} offset={3} radius={12} style={styles.answer}>
          <Tag color={brut.pink} label={`Scenario ${index + 1}`} />
          <Text style={styles.question}>{question.q}</Text>
          <Text style={styles.choice}>
            {mine[index] !== undefined ? question.options[mine[index]] : "—"}
          </Text>
        </Card>
      ))}
      <CloseButton onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  answer: { gap: 7, marginBottom: 12, paddingHorizontal: 15, paddingVertical: 13 },
  question: { color: brut.ink, fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 },
  choice: { color: brut.ink, fontFamily: fonts.semibold, fontSize: 13.5 },
});
