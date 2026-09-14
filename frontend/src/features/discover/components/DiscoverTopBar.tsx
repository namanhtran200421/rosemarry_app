import { StyleSheet, Text, View } from "react-native";

import {
  brut,
  colors,
  fonts,
  palette,
  radii,
  typography,
} from "../../../shared/theme/tokens";
import { Icon } from "../../../shared/ui/Icon";
import { IconButton } from "../../../shared/ui/IconButton";

interface DiscoverTopBarProps {
  seen: number;
  limit: number;
  onOpenFilters: () => void;
}

/** "Discovery" title, today's remaining-profiles counter and filters. */
export function DiscoverTopBar({ seen, limit, onOpenFilters }: DiscoverTopBarProps) {
  const left = Math.max(0, limit - seen);
  const isLow = left <= 3;

  return (
    <View style={styles.bar}>
      <Text accessibilityRole="header" style={styles.title}>
        Discovery
      </Text>
      {limit > 0 ? (
        <View
          accessible
          accessibilityLabel={`${left} of ${limit} profiles left today`}
          style={[styles.counter, isLow && styles.counterLow]}
        >
          <Icon
            name="Sparkles"
            size={13}
            color={isLow ? colors.dangerStrong : colors.primaryAccessible}
          />
          <Text style={[styles.counterText, isLow && styles.counterTextLow]}>
            {left}/{limit}
          </Text>
        </View>
      ) : null}
      <View style={styles.spacer} />
      <IconButton
        accessibilityLabel="Filters"
        onPress={onOpenFilters}
        variant="ghost"
        size={42}
      >
        <Icon name="Menu" size={27} color={colors.primaryAccessible} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 12,
    backgroundColor: colors.backgroundWarm,
  },
  title: {
    color: brut.ink,
    fontFamily: fonts.bold,
    ...typography.hero,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 26,
    marginLeft: 10,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryTint,
  },
  counterLow: {
    backgroundColor: palette.red100,
  },
  counterText: {
    color: colors.primaryAccessible,
    fontFamily: fonts.bold,
    fontSize: 12.5,
  },
  counterTextLow: {
    color: colors.dangerStrong,
  },
  spacer: {
    flex: 1,
  },
});
