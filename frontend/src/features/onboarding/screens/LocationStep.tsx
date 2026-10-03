import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { colors, spacing } from "../../../shared/theme/tokens";
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
  const valid =
    location.city.trim().length > 0 &&
    location.city.trim().length <= 100 &&
    location.country.trim().length > 0 &&
    location.country.trim().length <= 100;
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
        title="Where do you live?"
        subtitle="Share your general area so people can see where you're based. City and country are required."
      />
      <View style={styles.fields}>
        <AppTextInput
          label="City *"
          value={location.city}
          onChangeText={(value) => set("city", value)}
          placeholder="Melbourne"
          autoCapitalize="words"
          textContentType="addressCity"
          maxLength={100}
          leadingIcon={
            <Feather name="map-pin" size={18} color={colors.textSecondary} />
          }
          returnKeyType="next"
        />
        <AppTextInput
          label="Country *"
          value={location.country}
          onChangeText={(value) => set("country", value)}
          placeholder="Australia"
          autoCapitalize="words"
          textContentType="countryName"
          maxLength={100}
          returnKeyType="next"
        />
        <AppTextInput
          label="State or region (optional)"
          value={location.state}
          onChangeText={(value) => set("state", value)}
          placeholder="Victoria"
          autoCapitalize="words"
          textContentType="addressState"
          maxLength={100}
          returnKeyType="next"
        />
        <AppTextInput
          label="Postal code (optional)"
          value={location.postcode}
          onChangeText={(value) => set("postcode", value)}
          placeholder="3000"
          autoCapitalize="characters"
          textContentType="postalCode"
          maxLength={20}
          returnKeyType="done"
        />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({ fields: { gap: spacing.sm } });
