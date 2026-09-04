import { Image, StyleSheet } from "react-native";

interface BrandMarkProps {
  size?: number;
}

/** The Rosemarry bird-and-rose app mark. Decorative — never the only label. */
export function BrandMark({ size = 56 }: BrandMarkProps) {
  return (
    <Image
      accessibilityElementsHidden
      importantForAccessibility="no"
      source={require("../../../assets/logo-mark.png")}
      style={[styles.mark, { width: size, height: size * MARK_ASPECT }]}
    />
  );
}

/** Intrinsic 512x404 artwork. */
const MARK_ASPECT = 404 / 512;

const styles = StyleSheet.create({
  mark: {
    resizeMode: "contain",
  },
});
