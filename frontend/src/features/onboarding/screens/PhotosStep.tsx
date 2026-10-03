import { Feather } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import {
  colors,
  fonts,
  palette,
  radii,
  spacing,
  typography,
} from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const SLOT_TINTS = [
  palette.pink300,
  palette.orange300,
  palette.pink100,
  palette.orange400,
  palette.pink500,
  palette.orange100,
];

export function PhotosStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
  totalSteps = TOTAL_STEPS,
  catalogs,
  busy,
  error,
  onRefreshMedia,
}: StepScreenProps) {
  const count = catalogs
    ? profile.mediaIds.length
    : profile.photos.filter(Boolean).length;

  function toggle(index: number): void {
    const next = profile.photos.slice();
    next[index] = !next[index];
    update("photos", next);
  }

  function toggleMedia(mediaId: number): void {
    update(
      "mediaIds",
      profile.mediaIds.includes(mediaId)
        ? profile.mediaIds.filter((id) => id !== mediaId)
        : profile.mediaIds.length < 6
          ? [...profile.mediaIds, mediaId]
          : profile.mediaIds,
    );
  }

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
            disabled={count < 2}
            onPress={goNext}
            busy={busy}
          />
        </>
      }
    >
      <StepTitle
        title="Add your photos"
        subtitle={
          catalogs
            ? "Choose 2 to 6 of your uploaded photos."
            : "Add at least 2 photos to help others get to know you. You can change these anytime."
        }
      />
      {catalogs && catalogs.media.length === 0 ? (
        <View>
          <Text style={styles.count}>
            No uploaded photos are available for this account yet.
          </Text>
          {onRefreshMedia ? (
            <AppButton
              label="Refresh photos"
              intent="secondary"
              size="sm"
              onPress={onRefreshMedia}
              busy={busy}
            />
          ) : null}
        </View>
      ) : null}
      <View style={styles.grid}>
        {catalogs
          ? catalogs.media.map((media, index) => {
              const selected = profile.mediaIds.includes(media.mediaId);
              return (
                <Pressable
                  key={media.mediaId}
                  accessibilityRole="button"
                  accessibilityLabel={`Select photo ${index + 1}`}
                  accessibilityState={{ selected }}
                  onPress={() => toggleMedia(media.mediaId)}
                  style={[styles.slot, selected && styles.selectedMedia]}
                >
                  <Image
                    source={{ uri: media.mediaUrl }}
                    style={styles.mediaImage}
                  />
                  {selected ? (
                    <View style={styles.remove}>
                      <Feather name="check" size={13} color={colors.surface} />
                    </View>
                  ) : null}
                </Pressable>
              );
            })
          : profile.photos.map((isFilled, index) => (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityLabel={
                  isFilled
                    ? `Remove photo ${index + 1}`
                    : `Add photo ${index + 1}`
                }
                onPress={() => toggle(index)}
                style={[
                  styles.slot,
                  isFilled
                    ? { backgroundColor: SLOT_TINTS[index] }
                    : styles.slotEmpty,
                ]}
              >
                {isFilled ? (
                  <View style={styles.remove}>
                    <Feather name="x" size={13} color={colors.surface} />
                  </View>
                ) : (
                  <View style={styles.add}>
                    <Feather name="camera" size={22} color={colors.textFaint} />
                    <Feather name="plus" size={16} color={colors.textFaint} />
                  </View>
                )}
              </Pressable>
            ))}
      </View>
      <Text style={styles.count}>
        {count}/{catalogs ? 6 : profile.photos.length} selected
      </Text>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  selectedMedia: { borderWidth: 3, borderColor: colors.primary },
  mediaImage: { width: "100%", height: "100%" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  slot: {
    width: "30%",
    aspectRatio: 0.78,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  slotEmpty: {
    backgroundColor: colors.surfaceSunken,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  add: {
    alignItems: "center",
    gap: spacing.xs,
  },
  remove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    backgroundColor: colors.overlayScrim,
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    marginTop: spacing.md,
    textAlign: "right",
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: typography.caption.fontSize,
  },
});
