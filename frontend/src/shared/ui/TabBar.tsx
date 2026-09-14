import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { brut, drop, fonts, radii } from "../theme/tokens";

export interface TabBarItem<Key extends string> {
  key: Key;
  label: string;
  image: ImageSourcePropType;
}

interface TabBarProps<Key extends string> {
  items: readonly TabBarItem<Key>[];
  active: Key;
  onChange: (key: Key) => void;
}

/**
 * Outlined nav block floating over the page. Each tab carries a full-colour
 * brand illustration; the active tab is a filled yellow block and inactive
 * illustrations fade back.
 */
export function TabBar<Key extends string>({
  items,
  active,
  onChange,
}: TabBarProps<Key>) {
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="tabbar"
      style={[styles.bar, { marginBottom: Math.max(18, insets.bottom) }]}
    >
      {items.map((item) => {
        const isActive = item.key === active;

        return (
          <Pressable
            key={item.key}
            accessibilityLabel={item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(item.key)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <View style={styles.iconBox}>
              <Image
                accessibilityElementsHidden
                importantForAccessibility="no"
                resizeMode="contain"
                source={item.image}
                style={[
                  styles.image,
                  !isActive && styles.imageInactive,
                ]}
              />
            </View>
            <Text style={[styles.label, !isActive && styles.labelInactive]}>
              {item.label.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 4,
    marginHorizontal: 12,
    marginTop: 8,
    padding: 5,
    borderRadius: 20,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    boxShadow: drop(4),
  },
  tab: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 8,
    paddingBottom: 7,
    borderRadius: radii.card,
    borderWidth: brut.borderThin,
    borderColor: "transparent",
  },
  tabActive: {
    backgroundColor: brut.yellow,
    borderColor: brut.ink,
  },
  iconBox: {
    width: 44,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageInactive: {
    opacity: 0.55,
    filter: [{ grayscale: 1 }],
  },
  label: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 10.5,
    lineHeight: 12,
    letterSpacing: 0.4,
  },
  labelInactive: {
    opacity: 0.7,
  },
});
