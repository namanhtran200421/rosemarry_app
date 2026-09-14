import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  brut,
  colors,
  drop,
  fonts,
  onBlock,
  radii,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Card } from "../../../shared/ui/Card";
import { Icon } from "../../../shared/ui/Icon";
import { Photo } from "../../../shared/ui/Photo";
import { Tag } from "../../../shared/ui/Tag";
import { photoUri } from "../../social/data/photos";
import type { Circle } from "../../social/types/circle.types";
import { hashString } from "../../social/utils/profile-utils";

export type CircleMember = Circle["members"][number];

export interface GameProps<Game, Result> {
  game: Game;
  members: CircleMember[];
  onDone: (result: Result) => void;
}

export function StepLabel({ label }: { label: string }) {
  return <Tag color={brut.yellow} label={label} style={styles.step} />;
}

export function Heading({ children }: { children: ReactNode }) {
  return <Text style={styles.heading}>{children}</Text>;
}

interface OptionButtonProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  correct?: boolean;
  wrong?: boolean;
}

/** Answer block: yellow when picked, green when right, red when wrong. */
export function OptionButton({ label, onPress, selected, correct, wrong }: OptionButtonProps) {
  const fill = correct
    ? brut.green
    : wrong
      ? colors.accentRed
      : selected
        ? brut.yellow
        : brut.white;
  const raised = Boolean(selected || correct || wrong);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected), disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.option, { backgroundColor: fill, boxShadow: drop(raised ? 4 : 2) }]}
    >
      <Text style={[styles.optionLabel, { color: onBlock(fill) }]}>{label}</Text>
      {correct ? <Icon name="Check" size={18} /> : null}
    </Pressable>
  );
}

export function MemberChip({ member, right }: { member: Pick<CircleMember, "name" | "photo">; right?: ReactNode }) {
  return (
    <View style={styles.member}>
      <View style={styles.memberPhoto}>
        <Photo uri={photoUri(member.photo)} seed={member.photo} name={member.name} />
      </View>
      <Text numberOfLines={1} style={styles.memberName}>
        {member.name}
      </Text>
      {right}
    </View>
  );
}

/** Headline outcome — the one thing to read first on a result screen. */
export function ResultHero({ headline, sub, emoji }: { headline: string; sub?: string; emoji?: string }) {
  return (
    <Card color={brut.yellow} offset={5} radius={16} style={styles.hero}>
      {emoji ? <Text style={styles.heroEmoji}>{emoji}</Text> : null}
      <Text accessibilityRole="header" style={styles.heroHeadline}>
        {headline}
      </Text>
      {sub ? <Text style={styles.heroSub}>{sub}</Text> : null}
    </Card>
  );
}

export function SectionTitle({ title, note }: { title: string; note?: string }) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      {note ? <Text style={styles.sectionNote}>{note}</Text> : null}
    </View>
  );
}

export function ValuePill({ text, strong }: { text: string; strong?: boolean }) {
  return (
    <View style={[styles.value, strong && { backgroundColor: brut.green }]}>
      <Text style={styles.valueText}>{text}</Text>
    </View>
  );
}

interface RankRowProps {
  rank: number;
  member: Pick<CircleMember, "name" | "photo">;
  value: string;
  mine?: boolean;
}

export function RankRow({ rank, member, value, mine = false }: RankRowProps) {
  return (
    <Card
      color={mine ? brut.yellow : brut.white}
      offset={mine ? 4 : 2}
      radius={12}
      style={styles.rankRow}
    >
      <View style={[styles.rank, rank === 1 && { backgroundColor: brut.pink }]}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      <MemberChip member={member} />
      <ValuePill strong={rank === 1} text={value} />
    </Card>
  );
}

interface ReviewCardProps {
  index: number;
  question: string;
  correct: string;
  yours: string | null;
  gotIt: boolean;
}

/** Question → correct answer → your answer, for review after a quiz. */
export function ReviewCard({ index, question, correct, yours, gotIt }: ReviewCardProps) {
  return (
    <Card offset={3} radius={12} style={styles.review}>
      <Tag color={gotIt ? brut.green : brut.pink} label={`Question ${index}`} />
      <Text style={styles.reviewQ}>{question}</Text>
      <View style={styles.reviewLine}>
        <View style={[styles.dot, { backgroundColor: brut.green }]}>
          <Icon name="Check" size={11} />
        </View>
        <Text style={styles.reviewAnswer}>{correct}</Text>
      </View>
      {yours !== null ? (
        <View style={styles.reviewLine}>
          <View style={[styles.dot, { backgroundColor: gotIt ? brut.white : colors.accentRed }]}>
            <Icon name={gotIt ? "Check" : "X"} size={11} color={gotIt ? brut.ink : brut.white} />
          </View>
          <Text style={styles.reviewAnswer}>You: {yours}</Text>
        </View>
      ) : null}
    </Card>
  );
}

/** Whole-circle leaderboard for a scored game, with the member slotted in. */
export function Leaderboard({
  members,
  myScore,
  total,
  seed,
  myPhoto,
}: {
  members: CircleMember[];
  myScore: number;
  total: number;
  seed: string;
  myPhoto?: string;
}) {
  const rows = [
    ...members.map((member) => ({
      member,
      score: hashString(member.id + seed) % (total + 1),
      mine: false,
    })),
    { member: { name: "You", photo: myPhoto ?? "" }, score: myScore, mine: true },
  ].sort((a, b) => b.score - a.score || (a.mine ? 1 : -1));

  return (
    <>
      {rows.map((row, index) => (
        <RankRow
          key={row.mine ? "me" : (row.member as CircleMember).id}
          member={row.member}
          mine={row.mine}
          rank={index + 1}
          value={`${row.score}/${total}`}
        />
      ))}
    </>
  );
}

export function CloseButton({ onPress }: { onPress: () => void }) {
  return <AppButton intent="neutral" label="Close" onPress={onPress} style={styles.close} />;
}

export function Gap() {
  return <View style={styles.gap} />;
}

const styles = StyleSheet.create({
  step: { marginBottom: 12 },
  heading: { marginBottom: 16, color: brut.ink, fontFamily: fonts.bold, fontSize: 18, lineHeight: 23 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: radii.sm,
    borderWidth: brut.border,
    borderColor: brut.ink,
  },
  optionLabel: { flex: 1, fontFamily: fonts.bold, fontSize: 14.5 },
  member: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1, minWidth: 0 },
  memberPhoto: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    overflow: "hidden",
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.paper,
  },
  memberName: { flexShrink: 1, color: brut.ink, fontFamily: fonts.bold, fontSize: 14 },
  hero: { alignItems: "center", marginBottom: 24, paddingHorizontal: 18, paddingVertical: 22 },
  heroEmoji: { marginBottom: 10, fontSize: 34, lineHeight: 40 },
  heroHeadline: { color: brut.ink, fontFamily: fonts.bold, fontSize: 26, lineHeight: 30, textAlign: "center" },
  heroSub: { marginTop: 7, color: brut.ink, fontFamily: fonts.semibold, fontSize: 13.5, lineHeight: 19, textAlign: "center" },
  section: { marginBottom: 13 },
  sectionTitle: { color: brut.ink, fontFamily: fonts.bold, fontSize: 19 },
  sectionNote: { marginTop: 3, color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: 12.5 },
  value: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.tag,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.white,
  },
  valueText: { color: brut.ink, fontFamily: fonts.bold, fontSize: 12.5 },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 11, paddingHorizontal: 13, paddingVertical: 10 },
  rank: {
    width: 26,
    height: 26,
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: { color: brut.ink, fontFamily: fonts.bold, fontSize: 12 },
  review: { gap: 8, marginBottom: 12, paddingHorizontal: 15, paddingVertical: 13 },
  reviewQ: { color: brut.ink, fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 },
  reviewLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: {
    width: 19,
    height: 19,
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAnswer: { flex: 1, color: brut.ink, fontFamily: fonts.semibold, fontSize: 13.5 },
  close: { marginTop: 4 },
  gap: { height: 12 },
});
