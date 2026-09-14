import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  brut,
  colors,
  drop,
  fonts,
} from "../../../shared/theme/tokens";
import { Icon } from "../../../shared/ui/Icon";
import { Photo } from "../../../shared/ui/Photo";
import { photoUri } from "../../social/data/photos";
import type { Match } from "../../social/types/social.types";

interface MatchTileProps {
  match: Match;
  timeLeft: { label: string; urgent: boolean };
  onPress: () => void;
}

/** New-match portrait with its remaining time before the match expires. */
export function MatchTile({ match, timeLeft, onPress }: MatchTileProps) {
  return (
    <Pressable
      accessibilityLabel={`${match.name}, ${timeLeft.label} to message`}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.tile}
    >
      <View style={styles.photo}>
        <Photo uri={photoUri(match.photo)} seed={match.photo} name={match.name} />
        <View style={[styles.timer, timeLeft.urgent && styles.timerUrgent]}>
          <Icon
            name="Clock"
            size={10}
            color={timeLeft.urgent ? brut.white : brut.ink}
          />
          <Text style={[styles.timerText, timeLeft.urgent && styles.timerTextUrgent]}>
            {timeLeft.label}
          </Text>
        </View>
      </View>
      <Text numberOfLines={1} style={styles.name}>
        {match.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 74,
  },
  photo: {
    width: 74,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: brut.border,
    borderColor: brut.ink,
    boxShadow: drop(3),
    backgroundColor: brut.paper,
  },
  timer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 3,
    borderTopWidth: brut.borderThin,
    borderTopColor: brut.ink,
    backgroundColor: brut.yellow,
  },
  timerUrgent: {
    backgroundColor: colors.accentRed,
  },
  timerText: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 10,
  },
  timerTextUrgent: {
    color: brut.white,
  },
  name: {
    marginTop: 7,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 12.5,
    textAlign: "center",
  },
});
