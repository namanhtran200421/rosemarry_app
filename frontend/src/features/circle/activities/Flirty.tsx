import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { brut, fonts } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Card } from "../../../shared/ui/Card";
import { Icon } from "../../../shared/ui/Icon";
import { InlineInput } from "../../../shared/ui/InlineInput";
import { Tag } from "../../../shared/ui/Tag";
import type { FlirtyGame } from "../../social/types/circle.types";

import {
  CloseButton,
  type CircleMember,
  Heading,
  MemberChip,
  ResultHero,
  SectionTitle,
  StepLabel,
} from "./activity-ui";

interface FlirtyProps {
  game: FlirtyGame;
  members: CircleMember[];
  /** The member's saved answer; its presence switches to the read view. */
  saved?: string;
  onDone: (answer: string) => void;
  onClose: () => void;
}

/** Flirty prompts have no score — the answer thread is the result. */
export function Flirty({ game, members, saved, onDone, onClose }: FlirtyProps) {
  const [text, setText] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const isRead = Boolean(saved);

  return (
    <View>
      {isRead ? (
        <>
          <ResultHero emoji="💌" headline="Circle answers" sub={game.prompt} />
          <Card color={brut.yellow} offset={4} radius={12} style={styles.mine}>
            <Tag label="Your answer" />
            <Text style={styles.mineText}>{saved}</Text>
          </Card>
        </>
      ) : (
        <>
          <StepLabel label="Flirty prompt" />
          <Heading>{game.prompt}</Heading>
          <Tag color={brut.green} label="Your answer" style={styles.answerTag} />
          <InlineInput
            accessibilityLabel="Your answer"
            multiline
            onChangeText={setText}
            placeholder="Your answer…"
            style={styles.input}
            value={text}
          />
          <AppButton
            disabled={!text.trim()}
            label="Share with circle"
            onPress={() => onDone(text.trim())}
            size="md"
          />
          <View style={styles.spacer} />
        </>
      )}

      {game.answers.length > 0 ? (
        isRead ? (
          <SectionTitle
            title="What the circle said"
            note={`${game.answers.length} answers — tap the heart to let them know.`}
          />
        ) : (
          <Tag label="Circle answers" style={styles.answerTag} />
        )
      ) : null}

      {game.answers.map((answer) => {
        const member = members.find((item) => item.id === answer.memberId);
        const on = Boolean(liked[answer.id]);
        return (
          <Card key={answer.id} offset={2} style={styles.answer}>
            {member ? <MemberChip member={member} /> : null}
            <Text style={styles.answerText}>{answer.text}</Text>
            <AppButton
              intent={on ? "secondary" : "neutral"}
              label={on ? "Liked" : "Like"}
              leadingIcon={<Icon name={on ? "Heart" : "HeartOutline"} size={14} />}
              onPress={() => setLiked((current) => ({ ...current, [answer.id]: !on }))}
              size="sm"
              style={styles.like}
            />
          </Card>
        );
      })}

      {isRead ? <CloseButton onPress={onClose} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mine: { gap: 7, marginBottom: 22, paddingHorizontal: 15, paddingVertical: 13 },
  mineText: { color: brut.ink, fontFamily: fonts.semibold, fontSize: 14.5, lineHeight: 21 },
  answerTag: { marginTop: 6, marginBottom: 10 },
  input: { marginBottom: 14 },
  spacer: { height: 18 },
  answer: { marginBottom: 12, padding: 14 },
  answerText: { marginVertical: 10, color: brut.ink, fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 21 },
  like: { alignSelf: "flex-start" },
});
