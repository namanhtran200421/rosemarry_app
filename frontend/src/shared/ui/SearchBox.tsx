import { StyleSheet, TextInput, View } from "react-native";

import { brut, colors, drop, fonts, radii } from "../theme/tokens";

import { Icon } from "./Icon";

interface SearchBoxProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}

/** Outlined pill search field with a leading glyph. */
export function SearchBox({ value, onChangeText, placeholder }: SearchBoxProps) {
  return (
    <View style={styles.box}>
      <Icon name="Search" size={18} />
      <TextInput
        accessibilityLabel={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        selectionColor={colors.primary}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    boxShadow: drop(3),
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
});
