import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  colors,
  fonts,
  radii,
  spacing,
  typography,
} from "../../../shared/theme/tokens";

interface PromptCardProps {
  prompt: string;
  answer?: string;
  disabled: boolean;
  onToggle: () => void;
  onAnswerChange: (value: string) => void;
}

/** Selectable profile prompt with its answer field and disabled-limit state. */
export function PromptCard({
  prompt,
  answer,
  disabled,
  onToggle,
  onAnswerChange,
}: PromptCardProps) {
  const isSelected = answer !== undefined;

  return (
    <View style={[styles.card, disabled && styles.cardDisabled]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled }}
        disabled={disabled}
        onPress={onToggle}
        style={[styles.header, isSelected && styles.headerSelected]}
      >
        <Text style={styles.prompt}>{prompt}</Text>
        <View style={[styles.check, isSelected && styles.checkSelected]}>
          {isSelected ? (
            <Feather name="check" size={14} color={colors.onPrimary} />
          ) : null}
        </View>
      </Pressable>

      {isSelected ? (
        <TextInput
          accessibilityLabel={`Answer for ${prompt}`}
          multiline
          numberOfLines={2}
          onChangeText={onAnswerChange}
          placeholder="Your answer…"
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.primary}
          style={styles.answer}
          value={answer}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    overflow: "hidden",
  },
  cardDisabled: {
    opacity: 0.45,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm + 2,
    padding: 14,
    backgroundColor: colors.surface,
  },
  headerSelected: {
    backgroundColor: colors.surfaceTint,
  },
  prompt: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: typography.sub.fontSize,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  checkSelected: {
    borderWidth: 0,
    backgroundColor: colors.primary,
  },
  answer: {
    minHeight: 64,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: typography.sub.fontSize,
    textAlignVertical: "top",
  },
});
