import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  radii,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import type { StepScreenProps } from "../types/onboarding.types";

const POINTS: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  body: string;
}[] = [
  {
    icon: "refresh-cw",
    title: "A fresh circle every week",
    body: "Every Monday you're grouped with new people who fit your vibe.",
  },
  {
    icon: "users",
    title: "Matched on what you love",
    body: "Circles form around your shared interests and the energy you bring.",
  },
  {
    icon: "heart",
    title: "Great matches reunite",
    body: "Click with someone? High-compatibility members return in your next circle.",
  },
];

export function CirclesStep({ goNext, goBack }: StepScreenProps) {
  return (
    <OnboardingScreen
      onBack={goBack}
      footer={<AppButton label="Got it" onPress={goNext} />}
    >
      <StepTitle
        title="How Circles work"
        subtitle="A new part of Rosemarry — small weekly groups, matched to you."
      />
      {POINTS.map(({ icon, title, body }, index) => (
        <View key={title} style={[styles.row, index > 0 && styles.rowDivided]}>
          <View style={styles.badge}>
            <Feather name={icon} size={22} color={colors.primaryAccessible} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>
          </View>
        </View>
      ))}
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: spacing.lg,
  },
  rowDivided: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceTint,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: typography.h3.fontSize,
  },
  body: {
    marginTop: 3,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.sub.fontSize,
    lineHeight: 20,
  },
});
