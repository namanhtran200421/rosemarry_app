import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { brut, colors, fonts, radii } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Card } from "../../../shared/ui/Card";
import { IconBlock } from "../../../shared/ui/IconBlock";
import { Photo } from "../../../shared/ui/Photo";
import { photoUri } from "../../social/data/photos";
import type { PickForGame, PickForResult } from "../../social/types/circle.types";
import { hashString } from "../../social/utils/profile-utils";

import {
  CloseButton,
  type CircleMember,
  Gap,
  type GameProps,
  MemberChip,
  OptionButton,
  ResultHero,
  SectionTitle,
  StepLabel,
} from "./activity-ui";

/** Guesses other members "picked for you", synthesised so rating has content. */
const INCOMING = [
  "Your perfect live show would be an intimate rooftop concert.",
  "Your ideal first date is coffee followed by a gallery walk.",
  "You’d love a long weekend exploring Tokyo.",
  "Your comfort-food pick is definitely wood-fired pizza.",
  "You’d pick a sunrise hike over a lie-in, every time.",
  "Your go-to Sunday is a slow brunch and a long walk.",
];

export function PickForPlay({ game, members, onDone }: GameProps<PickForGame, PickForResult>) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [picks, setPicks] = useState<PickForResult["picks"]>([]);
  const task = game.tasks[taskIndex];
  const forMember = members.find((member) => member.id === task.forMemberId) ?? members[0];
  const prompt = task.prompt.replace("{name}", forMember.name);
  const isLast = taskIndex === game.tasks.length - 1;

  function next(): void {
    if (picked === null) return;
    const all = [...picks, { forMemberId: forMember.id, q: prompt, choice: task.options[picked] }];
    if (isLast) {
      onDone({ picks: all });
      return;
    }
    setPicks(all);
    setTaskIndex(taskIndex + 1);
    setPicked(null);
  }

  return (
    <View>
      <StepLabel label={`Pick for someone · ${taskIndex + 1}/${game.tasks.length}`} />
      <View style={styles.forRow}>
        <View style={styles.forPhoto}>
          <Photo uri={photoUri(forMember.photo)} seed={forMember.photo} name={forMember.name} />
        </View>
        <Text style={styles.forPrompt}>{prompt}</Text>
      </View>
      {task.options.map((option, index) => (
        <OptionButton key={option} label={option} onPress={() => setPicked(index)} selected={picked === index} />
      ))}
      {picked !== null ? (
        <Text style={styles.note}>
          {forMember.name} can rate this “Nailed it” or “Not even close”.
        </Text>
      ) : null}
      <AppButton disabled={picked === null} label={isLast ? "Send picks" : "Next"} onPress={next} size="md" />
    </View>
  );
}

interface ResultProps {
  members: CircleMember[];
  result?: PickForResult;
  onClose: () => void;
}

export function PickForResultView({ members, result, onClose }: ResultProps) {
  const picks = result?.picks ?? [];
  const offset = hashString(`${members[0]?.id ?? ""}pickfor`);
  const incoming = members.slice(0, 4).map((member, index) => ({
    member,
    text: INCOMING[(offset + index) % INCOMING.length],
  }));
  const [rated, setRated] = useState<Record<string, "yes" | "no">>({});
  const ratedCount = Object.keys(rated).length;
  const allRated = ratedCount === incoming.length;

  return (
    <View>
      <ResultHero
        emoji="🎁"
        headline="Your picks were sent"
        sub={`${picks.length} member${picks.length === 1 ? "" : "s"} can now rate what you chose for them.`}
      />
      <Card color={allRated ? brut.green : brut.yellow} offset={4} radius={12} style={styles.progress}>
        <IconBlock name={allRated ? "Check" : "Users"} color={brut.white} size={34} iconSize={17} radius={9} />
        <View style={styles.progressText}>
          <Text style={styles.progressTitle}>{`${ratedCount}/${incoming.length} rated`}</Text>
          <Text style={styles.progressBody}>
            {allRated ? "All done — thanks for rating." : "Rate each guess to finish this activity."}
          </Text>
        </View>
      </Card>
      <SectionTitle title="What others picked for you" />
      {incoming.map(({ member, text }) => (
        <Card key={member.id} offset={3} style={styles.incoming}>
          <MemberChip member={member} />
          <Text style={styles.incomingText}>{text}</Text>
          <View style={styles.rateRow}>
            {(["yes", "no"] as const).map((value) => {
              const on = rated[member.id] === value;
              return (
                <AppButton
                  key={value}
                  intent={on ? (value === "yes" ? "secondary" : "danger") : "neutral"}
                  label={value === "yes" ? "Nailed it" : "Not even close"}
                  onPress={() => setRated((current) => ({ ...current, [member.id]: value }))}
                  size="sm"
                  style={styles.rate}
                />
              );
            })}
          </View>
        </Card>
      ))}
      <Gap />
      <SectionTitle title="Your choices" />
      {picks.map((pick) => {
        const member = members.find((item) => item.id === pick.forMemberId);
        return member ? (
          <Card key={pick.q} offset={2} radius={12} style={styles.choice}>
            <MemberChip member={member} />
            <Text style={styles.choiceText}>{pick.choice}</Text>
          </Card>
        ) : null;
      })}
      <CloseButton onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  forRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  forPhoto: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    overflow: "hidden",
    borderWidth: brut.border,
    borderColor: brut.ink,
  },
  forPrompt: { flex: 1, color: brut.ink, fontFamily: fonts.bold, fontSize: 16.5, lineHeight: 21 },
  note: { marginTop: 2, marginBottom: 16, color: brut.ink, fontFamily: fonts.semibold, fontSize: 13.5 },
  progress: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24, paddingHorizontal: 14, paddingVertical: 12 },
  progressText: { flex: 1 },
  progressTitle: { color: brut.ink, fontFamily: fonts.bold, fontSize: 14.5 },
  progressBody: { marginTop: 1, color: brut.ink, fontFamily: fonts.semibold, fontSize: 12.5 },
  incoming: { marginBottom: 12, paddingHorizontal: 15, paddingVertical: 13 },
  incomingText: { marginVertical: 10, color: brut.ink, fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 21 },
  rateRow: { flexDirection: "row", gap: 10 },
  rate: { flex: 1, paddingHorizontal: 8 },
  choice: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 11, paddingHorizontal: 13, paddingVertical: 10 },
  choiceText: { marginLeft: "auto", color: colors.textSecondary, fontFamily: fonts.semibold, fontSize: 13 },
});
