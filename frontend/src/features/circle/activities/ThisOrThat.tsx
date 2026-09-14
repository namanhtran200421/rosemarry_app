import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, colors, drop, fonts, radii } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Card } from "../../../shared/ui/Card";
import type {
  ThisOrThatGame,
  ThisOrThatResult,
} from "../../social/types/circle.types";
import { hashString } from "../../social/utils/profile-utils";

import {
  CloseButton,
  type CircleMember,
  Gap,
  type GameProps,
  Heading,
  MemberChip,
  ResultHero,
  SectionTitle,
  StepLabel,
  ValuePill,
} from "./activity-ui";

/** Single-elimination bracket: pick one of each pair until a winner is left. */
export function ThisOrThatPlay({ game, onDone }: GameProps<ThisOrThatGame, ThisOrThatResult>) {
  const [pool, setPool] = useState(game.options);
  const [pairStart, setPairStart] = useState(0);
  const [winners, setWinners] = useState<string[]>([]);
  const [beaten, setBeaten] = useState<ThisOrThatResult["beaten"]>([]);
  const [champ, setChamp] = useState<string | null>(null);
  const [a, b] = [pool[pairStart], pool[pairStart + 1]];
  const roundName = pool.length > 4 ? "Round 1" : pool.length > 2 ? "Semi-final" : "Final";

  function choose(winner: string): void {
    const nextBeaten = [...beaten, { loser: winner === a ? b : a, winner }];
    const nextWinners = [...winners, winner];
    setBeaten(nextBeaten);
    if (pairStart + 2 < pool.length) {
      setWinners(nextWinners);
      setPairStart(pairStart + 2);
      return;
    }
    const carried = pool.length % 2 === 1 ? [pool[pool.length - 1]] : [];
    const advancing = [...nextWinners, ...carried];
    if (advancing.length === 1) {
      setChamp(advancing[0]);
      return;
    }
    setPool(advancing);
    setWinners([]);
    setPairStart(0);
  }

  if (champ) {
    return (
      <View>
        <StepLabel label="Winner" />
        <Card color={brut.yellow} offset={5} radius={16} style={styles.champ}>
          <Text style={styles.emoji}>🏆</Text>
          <Text style={styles.champName}>{champ}</Text>
          <Text style={styles.champNote}>Your pick</Text>
        </Card>
        <AppButton label="See results" onPress={() => onDone({ champ, beaten })} size="md" />
      </View>
    );
  }

  return (
    <View>
      <StepLabel label={`This or that · ${roundName}`} />
      <Heading>Tap the one you’d pick</Heading>
      <View style={styles.pair}>
        {[a, b].map((option, index) => (
          <View key={option} style={styles.pairSlot}>
            <Pressable accessibilityRole="button" onPress={() => choose(option)} style={styles.bigChoice}>
              <Text style={styles.bigChoiceText}>{option}</Text>
            </Pressable>
            {index === 0 ? (
              <View style={styles.vs}>
                <Text style={styles.vsText}>VS</Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

interface ResultProps {
  game: ThisOrThatGame;
  members: CircleMember[];
  result?: ThisOrThatResult;
  onClose: () => void;
}

export function ThisOrThatResultView({ game, members, result, onClose }: ResultProps) {
  const champ = result?.champ ?? game.options[0];
  const others = game.options.filter((option) => option !== champ);
  // A stable majority lands on the champion so the tally agrees with the headline.
  const choices = members.map((member) => ({
    member,
    choice:
      others.length === 0 || hashString(member.id + champ) % 100 < 60
        ? champ
        : others[hashString(`${member.id}alt`) % others.length],
  }));
  const tally = game.options
    .map((option) => ({
      option,
      votes: choices.filter((entry) => entry.choice === option).length + (option === champ ? 1 : 0),
    }))
    .sort((x, y) => y.votes - x.votes);
  const totalVotes = choices.length + 1;

  return (
    <View>
      <ResultHero emoji="🏆" headline={`${champ} wins`} sub="Your bracket champion — every other option lost a head-to-head." />
      <SectionTitle title="How the circle voted" />
      {tally.map(({ option, votes }) => (
        <Card
          key={option}
          color={option === champ ? brut.yellow : brut.white}
          offset={option === champ ? 4 : 2}
          radius={12}
          style={styles.tallyRow}
        >
          <View style={styles.tallyHeader}>
            <Text style={styles.tallyLabel}>{option}</Text>
            <ValuePill strong={option === champ} text={`${votes} vote${votes === 1 ? "" : "s"}`} />
          </View>
          <View style={styles.bar}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.round((votes / totalVotes) * 100)}%`,
                  backgroundColor: option === champ ? brut.green : brut.purple,
                },
              ]}
            />
          </View>
        </Card>
      ))}
      <Gap />
      <SectionTitle title="Everyone’s final choice" />
      {choices.map(({ member, choice }) => (
        <Card key={member.id} offset={2} radius={12} style={styles.choiceRow}>
          <MemberChip member={member} />
          <Text style={styles.choiceText}>{choice}</Text>
        </Card>
      ))}
      <CloseButton onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  champ: { alignItems: "center", marginBottom: 16, paddingHorizontal: 16, paddingVertical: 28 },
  emoji: { marginBottom: 6, fontSize: 34, lineHeight: 40 },
  champName: { color: brut.ink, fontFamily: fonts.bold, fontSize: 25, textAlign: "center" },
  champNote: { marginTop: 4, color: brut.ink, fontFamily: fonts.bold, fontSize: 13.5 },
  pair: { flexDirection: "row", alignItems: "stretch", gap: 12 },
  pairSlot: { flex: 1, flexDirection: "row", alignItems: "center" },
  bigChoice: {
    flex: 1,
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: radii.md,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    boxShadow: drop(4),
  },
  bigChoiceText: { color: brut.ink, fontFamily: fonts.bold, fontSize: 18, textAlign: "center" },
  vs: {
    position: "absolute",
    right: -23,
    zIndex: 2,
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.pink,
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: { color: brut.ink, fontFamily: fonts.bold, fontSize: 12 },
  tallyRow: { gap: 8, marginBottom: 11, paddingHorizontal: 14, paddingVertical: 11 },
  tallyHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  tallyLabel: { flex: 1, color: brut.ink, fontFamily: fonts.bold, fontSize: 15 },
  bar: {
    height: 10,
    padding: 1.5,
    overflow: "hidden",
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.white,
  },
  barFill: { height: "100%", borderRadius: radii.pill },
  choiceRow: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 11, paddingHorizontal: 13, paddingVertical: 10 },
  choiceText: { marginLeft: "auto", color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: 13 },
});
