import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { brut, colors, fonts } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Card } from "../../../shared/ui/Card";
import { InlineInput } from "../../../shared/ui/InlineInput";
import { Tag } from "../../../shared/ui/Tag";

interface IceBreakerCardProps {
  matchName: string;
  interest: string | null;
  prompt: string;
  onAnswer: (answer: string) => void;
}

/** Shared opening question shown in an empty thread. */
export function IceBreakerCard({
  matchName,
  interest,
  prompt,
  onAnswer,
}: IceBreakerCardProps) {
  const [answer, setAnswer] = useState("");
  const trimmed = answer.trim();

  return (
    <View style={styles.wrap}>
      <Card offset={5} radius={16} style={styles.card}>
        <Tag color={brut.yellow} icon="Sparkles" label="Ice breaker" />
        <Text style={styles.reason}>
          {interest
            ? `Suggested because you both love ${interest}`
            : `A little something to get you and ${matchName} talking`}
        </Text>
        <Text style={styles.prompt}>{prompt}</Text>
        <InlineInput
          accessibilityLabel="Your answer"
          fill={brut.paper}
          multiline
          onChangeText={setAnswer}
          placeholder="Your answer…"
          style={styles.input}
          value={answer}
        />
        <AppButton
          disabled={!trimmed}
          label="Send answer"
          onPress={() => {
            onAnswer(trimmed);
            setAnswer("");
          }}
          size="md"
        />
      </Card>
      <Text style={styles.or}>or just say hello below</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: "auto",
  },
  card: {
    padding: 20,
  },
  reason: {
    marginTop: 14,
    marginBottom: 7,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12.5,
  },
  prompt: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 21,
    lineHeight: 27,
  },
  input: {
    marginTop: 16,
    marginBottom: 14,
  },
  or: {
    marginTop: 18,
    color: colors.textSecondary,
    fontFamily: fonts.semibold,
    fontSize: 13,
    textAlign: "center",
  },
});
