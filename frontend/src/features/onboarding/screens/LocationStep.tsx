import { StyleSheet, View } from "react-native";

import { spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppTextInput } from "../../../shared/ui/AppTextInput";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import type { StepScreenProps } from "../types/onboarding.types";

export function LocationStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
  totalSteps,
  busy,
  error,
}: StepScreenProps) {
  const location = profile.location;
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  const valid =
    location.latitude.trim() !== "" &&
    location.longitude.trim() !== "" &&
    Number.isFinite(latitude) &&
    Math.abs(latitude) <= 90 &&
    Number.isFinite(longitude) &&
    Math.abs(longitude) <= 180;
  const set = (key: keyof typeof location, value: string) =>
    update("location", { ...location, [key]: value });

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      footer={
        <>
          {error ? <ErrorMessage message={error} /> : null}
          <AppButton
            label="Continue"
            disabled={!valid}
            busy={busy}
            onPress={goNext}
          />
        </>
      }
    >
      <StepTitle
        title="Where are you?"
        subtitle="Enter your location to help us find people nearby."
      />
      <View style={styles.fields}>
        <AppTextInput
          label="Latitude"
          value={location.latitude}
          onChangeText={(value) => set("latitude", value)}
          keyboardType="default"
          placeholder="-37.8136"
        />
        <AppTextInput
          label="Longitude"
          value={location.longitude}
          onChangeText={(value) => set("longitude", value)}
          keyboardType="default"
          placeholder="144.9631"
        />
        <AppTextInput
          label="City (optional)"
          value={location.city}
          onChangeText={(value) => set("city", value)}
        />
        <AppTextInput
          label="State (optional)"
          value={location.state}
          onChangeText={(value) => set("state", value)}
        />
        <AppTextInput
          label="Postcode (optional)"
          value={location.postcode}
          onChangeText={(value) => set("postcode", value)}
        />
        <AppTextInput
          label="Country (optional)"
          value={location.country}
          onChangeText={(value) => set("country", value)}
        />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({ fields: { gap: spacing.md } });
