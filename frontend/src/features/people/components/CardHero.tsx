import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, colors, drop, fonts } from "../../../shared/theme/tokens";
import { Icon } from "../../../shared/ui/Icon";
import { Photo } from "../../../shared/ui/Photo";
import { photoUri } from "../../social/data/photos";
import type { Profile } from "../../social/types/social.types";

import { HeroActions, type HeroActionProps } from "./HeroActions";

interface CardHeroProps {
  profile: Profile;
  photoIndex: number;
  onPhotoIndex: (index: number) => void;
  height: number;
  /** Space at the bottom of the hero that the photo leaves to the card fill. */
  photoInset?: number;
  onBack?: () => void;
  hideLocation?: boolean;
  /** Omit to hide the overlaid action row. */
  actions?: HeroActionProps;
}

/** Photo carousel with legibility scrims, position pills, name and actions. */
export function CardHero({
  profile,
  photoIndex,
  onPhotoIndex,
  height,
  photoInset = 0,
  onBack,
  hideLocation = false,
  actions,
}: CardHeroProps) {
  const count = profile.photos.length;
  const current = profile.photos[photoIndex] ?? profile.photos[0];
  const firstName = profile.name.split(" ")[0];

  return (
    <View style={[styles.hero, { height }]}>
      <View style={[styles.photo, { bottom: photoInset }]}>
        <Photo uri={photoUri(current)} seed={current} name={profile.name} />
        {actions ? <View pointerEvents="none" style={styles.bottomScrim} /> : null}
      </View>
      <View pointerEvents="none" style={styles.topScrim} />

      <View style={[styles.tapZones, { bottom: photoInset }]}>
        <Pressable
          accessibilityLabel="Previous photo"
          accessibilityRole="button"
          onPress={() => onPhotoIndex(Math.max(0, photoIndex - 1))}
          style={styles.tapPrev}
        />
        <Pressable
          accessibilityLabel="Next photo"
          accessibilityRole="button"
          onPress={() => onPhotoIndex(Math.min(count - 1, photoIndex + 1))}
          style={styles.tapNext}
        />
      </View>

      {count > 1 ? (
        <View pointerEvents="none" style={styles.pills}>
          {profile.photos.map((photo, index) => (
            <View
              key={`${photo}-${index}`}
              style={[
                styles.pill,
                index === photoIndex && styles.pillActive,
              ]}
            />
          ))}
        </View>
      ) : null}

      {onBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.back}
        >
          <Icon name="ArrowLeft" size={22} color={brut.white} />
        </Pressable>
      ) : null}

      <View
        pointerEvents="none"
        style={[styles.nameBlock, { bottom: photoInset + (actions ? 96 : 28) }]}
      >
        <View style={styles.hearts}>
          <Icon name="Heart" size={14} color={colors.primary} />
          <Icon name="Heart" size={11} color={colors.primary} />
        </View>
        <Text accessibilityRole="header" style={styles.name}>
          <Text style={styles.firstName}>{firstName}</Text>
          {profile.age ? `, ${profile.age}` : ""}
        </Text>
        {!hideLocation && (profile.distance || profile.location) ? (
          <View style={styles.location}>
            <Icon name="MapPin" size={15} color={brut.white} />
            <Text style={styles.locationText}>
              {profile.distance ?? profile.location}
            </Text>
          </View>
        ) : null}
      </View>

      {actions ? (
        <View style={[styles.actions, { bottom: photoInset + 24 }]}>
          <HeroActions {...actions} />
        </View>
      ) : null}
    </View>
  );
}

const TEXT_SHADOW = {
  textShadowColor: "rgba(0, 0, 0, 0.55)",
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 8,
} as const;

const styles = StyleSheet.create({
  hero: {
    borderRadius: 22,
    overflow: "hidden",
  },
  photo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 22,
    overflow: "hidden",
  },
  bottomScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "52%",
    experimental_backgroundImage:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.16) 42%, rgba(0,0,0,0.56) 100%)",
  },
  topScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130,
    experimental_backgroundImage:
      "linear-gradient(180deg, rgba(24,27,31,0.78) 0%, rgba(24,27,31,0.28) 55%, rgba(24,27,31,0) 100%)",
  },
  tapZones: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
  },
  tapPrev: {
    flex: 1,
  },
  tapNext: {
    flex: 2,
  },
  pills: {
    position: "absolute",
    top: 26,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  pill: {
    width: 13,
    height: 11,
    borderRadius: 4,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.white,
  },
  pillActive: {
    width: 30,
    backgroundColor: brut.yellow,
    boxShadow: drop(2),
  },
  back: {
    position: "absolute",
    top: 14,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(12, 20, 17, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  nameBlock: {
    position: "absolute",
    left: 20,
    right: 20,
  },
  hearts: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 3,
    marginBottom: 2,
    paddingLeft: 2,
  },
  name: {
    color: brut.white,
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 38,
    ...TEXT_SHADOW,
  },
  firstName: {
    textDecorationLine: "underline",
    textDecorationColor: colors.primary,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  locationText: {
    color: "rgba(255, 255, 255, 0.92)",
    fontFamily: fonts.medium,
    fontSize: 14,
    ...TEXT_SHADOW,
  },
  actions: {
    position: "absolute",
    left: 20,
    right: 20,
  },
});
