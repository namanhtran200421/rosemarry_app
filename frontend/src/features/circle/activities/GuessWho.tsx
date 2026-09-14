import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, colors, drop, fonts, radii } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Card } from "../../../shared/ui/Card";
import type {
  GuessWhoGame,
  GuessWhoResult,
} from "../../social/types/circle.types";

import {
  CloseButton,
  type CircleMember,
  Gap,
  type GameProps,
  Leaderboard,
  MemberChip,
  ResultHero,
  ReviewCard,
  SectionTitle,
  StepLabel,
} from "./activity-ui";

const scoreOf = (game: GuessWhoGame, picks: string[]) =>
  picks.reduce((total, pick, index) => total + (pick === game.rounds[index].memberId ? 1 : 0), 0);

export function GuessWhoPlay({ game, members, onDone }: GameProps<GuessWhoGame, GuessWhoResult>) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [picks, setPicks] = useState<string[]>([]);
  const current = game.rounds[round];
  const answered = picked !== null;
  const isLast = round === game.rounds.length - 1;
  const target = members.find((member) => member.id === current.memberId) ?? members[0];

  function next(): void {
    if (isLast) {
      onDone({ picks, score: scoreOf(game, picks) });
      return;
    }
    setRound(round + 1);
    setPicked(null);
  }

  return (
    <View>
      <StepLabel label={`Guess who? · ${round + 1}/${game.rounds.length}`} />
      <Card color={brut.purple} offset={4} style={styles.clues}>
        <Text style={styles.cluesTitle}>Who am I?</Text>
        {current.clues.map((clue) => (
          <View key={clue} style={styles.clue}>
            <View style={styles.bullet} />
            <Text style={styles.clueText}>{clue}</Text>
          </View>
        ))}
      </Card>
      {members.map((member) => {
        const isTarget = answered && member.id === current.memberId;
        const isWrongPick = answered && member.id === picked && !isTarget;
        return (
          <Pressable
            key={member.id}
            accessibilityRole="button"
            disabled={answered}
            onPress={() => {
              setPicked(member.id);
              setPicks([...picks, member.id]);
            }}
            style={[
              styles.candidate,
              {
                backgroundColor: isTarget ? brut.green : isWrongPick ? colors.accentRed : brut.white,
                boxShadow: drop(isTarget || isWrongPick ? 4 : 2),
              },
            ]}
          >
            <MemberChip
              member={member}
              right={isTarget ? <Text style={styles.itsThem}>It’s them!</Text> : null}
            />
          </Pressable>
        );
      })}
      {answered ? (
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>
          {picked === current.memberId
            ? `Correct — it was ${target.name}! 🎉`
            : `It was ${target.name}.`}
        </Text>
      ) : null}
      <AppButton disabled={!answered} label={isLast ? "See results" : "Next clue"} onPress={next} size="md" />
    </View>
  );
}

interface ResultProps {
  game: GuessWhoGame;
  members: CircleMember[];
  result?: GuessWhoResult;
  myPhoto?: string;
  onClose: () => void;
}

export function GuessWhoResultView({ game, members, result, myPhoto, onClose }: ResultProps) {
  const picks = result?.picks ?? [];
  const score = result?.score ?? scoreOf(game, picks);
  const total = game.rounds.length;
  const nameOf = (id: string) => members.find((member) => member.id === id)?.name ?? "Someone";

  return (
    <View>
      <ResultHero
        emoji={score === total ? "🏆" : "🕵️"}
        headline={`You got ${score}/${total}`}
        sub={score === total ? "You know this circle better than anyone." : "Three clues, one member — here’s who they were."}
      />
      <SectionTitle title="Circle ranking" />
      <Leaderboard members={members} myPhoto={myPhoto} myScore={score} seed="guesswho" total={total} />
      <Gap />
      <SectionTitle title="Who each clue was about" />
      {game.rounds.map((round, index) => (
        <ReviewCard
          key={round.memberId}
          correct={nameOf(round.memberId)}
          gotIt={picks[index] === round.memberId}
          index={index + 1}
          question={round.clues[0]}
          yours={picks[index] ? nameOf(picks[index]) : null}
        />
      ))}
      <CloseButton onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  clues: { marginBottom: 18, padding: 15 },
  cluesTitle: { marginBottom: 10, color: brut.white, fontFamily: fonts.bold, fontSize: 15 },
  clue: { flexDirection: "row", gap: 9, marginBottom: 7 },
  bullet: {
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.yellow,
  },
  clueText: { flex: 1, color: brut.white, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  candidate: {
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radii.sm,
    borderWidth: brut.border,
    borderColor: brut.ink,
  },
  itsThem: { marginLeft: "auto", color: brut.ink, fontFamily: fonts.bold, fontSize: 12.5 },
  feedback: { marginTop: 2, marginBottom: 16, color: brut.ink, fontFamily: fonts.semibold, fontSize: 13.5 },
});
