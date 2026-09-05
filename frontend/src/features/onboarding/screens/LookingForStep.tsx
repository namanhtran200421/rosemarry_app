import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { OptionRow } from "../../../shared/ui/OptionRow";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const OPTIONS: {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  {
    id: "long",
    title: "Long-term relationship",
    subtitle: "Looking for something serious",
    icon: "heart",
  },
  {
    id: "short",
    title: "Short-term relationship",
    subtitle: "Something meaningful, but don't last",
    icon: "star",
  },
  {
    id: "casual",
    title: "Casual dating",
    subtitle: "Keeping it casual and fun",
    icon: "coffee",
  },
  {
    id: "friends",
    title: "New friends",
    subtitle: "Looking to meet new connections",
    icon: "users",
  },
  {
    id: "unsure",
    title: "Not sure yet",
    subtitle: "Figuring it out as I go",
    icon: "more-horizontal",
  },
];

export function LookingForStep({
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
        title="What are you looking for?"
        subtitle="This helps match you with people who want the same things"
      />
      <View style={styles.list}>
        {OPTIONS.map(({ id, title, subtitle, icon }) => (
          <OptionRow
            key={id}
            title={title}
            subtitle={subtitle}
            selected={profile.lookingFor === id}
            selectedStyle="tint"
            leadingIcon={
              <Feather name={icon} size={22} color={colors.primaryAccessible} />
            }
            onPress={() => update("lookingFor", id)}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
