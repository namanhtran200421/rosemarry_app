import { StyleSheet, View } from "react-native";

import { spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { OptionRow } from "../../../shared/ui/OptionRow";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import type { StepScreenProps } from "../types/onboarding.types";

const MORE_GENDERS = [
  "Non-binary",
  "Genderqueer",
  "Genderfluid",
  "Agender",
  "Bigender",
  "Two-spirit",
  "Transgender",
  "Intersex",
  "Prefer not to say",
];

export function GenderMoreStep({
  profile,
  update,
  goTo,
  goBack,
}: StepScreenProps) {
  return (
    <OnboardingScreen
      onBack={goBack}
      footer={
        <AppButton
          label="Continue"
          disabled={!MORE_GENDERS.includes(profile.gender)}
          onPress={() => goTo("height")}
        />
      }
    >
      <StepTitle
        title="Choose another gender"
        subtitle="Pick the option that best describes you."
      />
      <View style={styles.list}>
        {MORE_GENDERS.map((gender) => (
          <OptionRow
            key={gender}
            title={gender}
            selected={profile.gender === gender}
            selectedStyle="fill"
            showIndicator={false}
            onPress={() => update("gender", gender)}
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
