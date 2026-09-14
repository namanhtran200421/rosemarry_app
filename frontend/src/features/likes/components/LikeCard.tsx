import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, drop, fonts, radii } from "../../../shared/theme/tokens";
import { Icon } from "../../../shared/ui/Icon";
import { Photo } from "../../../shared/ui/Photo";
import { Tag } from "../../../shared/ui/Tag";
import { photoUri } from "../../social/data/photos";
import type { PersonSummary } from "../../social/types/social.types";

interface LikeCardProps {
  person: PersonSummary;
  onPress: () => void;
  /** Circle likes stay blurred and inert until the circle refreshes. */
  locked?: boolean;
}

/** Portrait tile in the Likes grid, with a name pill and Super badge. */
export function LikeCard({ person, onPress, locked = false }: LikeCardProps) {
  const firstName = person.name.split(" ")[0];
  const offset = person.superliked ? 5 : 4;

  return (
    <Pressable
      accessibilityLabel={locked ? "Hidden circle like" : `${firstName}, ${person.age}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          boxShadow: drop(pressed ? 1 : offset),
          transform: pressed ? [{ translateX: 3 }, { translateY: 3 }] : [],
        },
      ]}
    >
      <Photo
        blurRadius={locked ? 24 : undefined}
        name={person.name}
        seed={person.photo}
        uri={photoUri(person.photo)}
      />

      {locked ? (
        <View style={styles.lockedOverlay}>
          <View style={styles.lockBadge}>
            <Icon name="Lock" size={21} />
          </View>
          <Tag color={brut.yellow} label="Hidden" />
        </View>
      ) : null}

      {!locked && person.superliked ? (
        <Tag
          color={brut.yellow}
          icon="Star4"
          label="Super"
          pill
          style={styles.superBadge}
        />
      ) : null}

      {!locked ? (
        <View style={styles.namePill}>
          <Text numberOfLines={1} style={styles.name}>
            {firstName}, {person.age}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.8,
    overflow: "hidden",
    borderRadius: radii.card,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.paper,
  },
  lockedOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(23, 24, 31, 0.3)",
  },
  lockBadge: {
    width: 46,
    height: 46,
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    alignItems: "center",
    justifyContent: "center",
  },
  superBadge: {
    position: "absolute",
    top: 9,
    left: 9,
  },
  namePill: {
    position: "absolute",
    left: 9,
    bottom: 9,
    maxWidth: "88%",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.white,
  },
  name: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
});
