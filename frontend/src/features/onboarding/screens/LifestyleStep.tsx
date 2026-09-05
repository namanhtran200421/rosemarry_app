import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { Chip } from "../../../shared/ui/Chip";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const ANSWERS = ["Often", "Sometimes", "Rarely", "No"];

const HABITS: {
  key: string;
  question: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { key: "Drinking", question: "How often do you drink?", icon: "droplet" },
  { key: "Smoking", question: "Do you smoke?", icon: "cloud" },
  { key: "Cannabis", question: "Do you use cannabis?", icon: "feather" },
  { key: "Workout", question: "How often do you exercise?", icon: "activity" },
];

export function LifestyleStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
}: StepScreenProps) {
  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      footer={<AppButton label="Continue" onPress={goNext} />}
    >
      <StepTitle
        title="Tell us about your lifestyle habits"
        subtitle="This helps match you with people who share your habits"
      />
      {HABITS.map(({ key, question, icon }, index) => (
        <View
          key={key}
          style={[
            styles.group,
            index < HABITS.length - 1 && styles.groupDivided,
          ]}
        >
          <View style={styles.questionRow}>
            <Feather name={icon} size={20} color={colors.textFaint} />
            <Text style={styles.question}>{question}</Text>
          </View>
          <View style={styles.answers}>
            {ANSWERS.map((answer) => (
              <Chip
                key={answer}
                label={answer}
                size="sm"
                selected={profile.lifestyle[key] === answer}
                onPress={() =>
                  update("lifestyle", { ...profile.lifestyle, [key]: answer })
                }
              />
            ))}
          </View>
        </View>
      ))}
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  group: {
    paddingBottom: 18,
    marginBottom: spacing.xs,
  },
  groupDivided: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  question: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: typography.callout.fontSize,
  },
  answers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm + 2,
  },
});
