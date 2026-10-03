import { Feather } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { colors, layout, palette, spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";
import { styles } from "./PhotosStep.styles";

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
  onPickPhoto,
}: StepScreenProps) {
  const { width } = useWindowDimensions();
  const tileWidth = Math.floor(
    (Math.min(width, 440) - layout.screenPadX * 2 - spacing.md * 2) / 3,
  );
  const count = catalogs
    ? profile.mediaIds.length
    : profile.photos.filter(Boolean).length;
  const visibleMedia = catalogs
    ? [...catalogs.media].sort((a, b) => {
        const aIndex = profile.mediaIds.indexOf(a.mediaId);
        const bIndex = profile.mediaIds.indexOf(b.mediaId);
        return (
          (aIndex < 0 ? Infinity : aIndex) - (bIndex < 0 ? Infinity : bIndex)
        );
      })
    : [];

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
        subtitle="Add at least 2 photos to help people get to know you."
      />
      {catalogs ? (
        <View style={styles.uploadCard}>
          <View style={styles.uploadIntro}>
            <View style={styles.uploadIcon}>
              <Feather name="image" size={24} color={colors.text} />
            </View>
            <View style={styles.uploadCopy}>
              <Text style={styles.uploadTitle}>Choose from your library</Text>
              <Text style={styles.uploadDescription}>
                Add up to 6 photos. Your first selected photo leads your
                profile.
              </Text>
            </View>
          </View>
          {onPickPhoto ? (
            <AppButton
              label={count === 0 ? "Choose photo" : "Add another photo"}
              intent="secondary"
              size="md"
              onPress={onPickPhoto}
              disabled={count >= 6}
              busy={busy}
              leadingIcon={
                <Feather name="plus" size={18} color={colors.text} />
              }
            />
          ) : null}
          <Text style={styles.uploadLimit}>
            JPG, PNG, WebP or HEIC · Up to 8 MB each
          </Text>
        </View>
      ) : null}
      <View style={styles.photoHeading}>
        <Text style={styles.photoHeadingText}>Your photos</Text>
        <Text style={styles.photoCount}>{count}/6 selected</Text>
      </View>
      {catalogs && catalogs.media.length === 0 ? (
        <Text style={styles.emptyText}>
          Your chosen photos will appear here.
        </Text>
      ) : null}
      <View style={styles.grid}>
        {catalogs
          ? visibleMedia.map((media, index) => {
              const selected = profile.mediaIds.includes(media.mediaId);
              const isMain = profile.mediaIds[0] === media.mediaId;
              return (
                <Pressable
                  key={media.mediaId}
                  accessibilityRole="button"
                  accessibilityLabel={`${selected ? "Remove" : "Select"} photo ${index + 1}${isMain ? ", main photo" : ""}`}
                  accessibilityState={{ selected }}
                  onPress={() => toggleMedia(media.mediaId)}
                  style={[
                    styles.slot,
                    { width: tileWidth },
                    selected && styles.selectedMedia,
                  ]}
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
                  {isMain ? (
                    <View style={styles.mainBadge}>
                      <Text style={styles.mainBadgeText}>Main</Text>
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
                  { width: tileWidth },
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
      <Text style={styles.photoHint}>
        {count < 2
          ? `${2 - count} more ${count === 1 ? "photo" : "photos"} to continue`
          : "Tap a photo to include or remove it."}
      </Text>
    </OnboardingScreen>
  );
}
