import { useState } from "react";
import {
  Image,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import { fonts } from "../theme/tokens";

interface PhotoProps {
  uri?: string;
  /** Stable key for the placeholder colour when no image is available. */
  seed?: string;
  /** Used for the placeholder initial and the image's accessible label. */
  name?: string;
  blurRadius?: number;
  style?: StyleProp<ViewStyle>;
  /** Decorative photos (avatars beside a visible name) stay hidden. */
  decorative?: boolean;
}

function seedHue(seed: string): number {
  let hue = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hue = (hue * 31 + seed.charCodeAt(index)) % 360;
  }
  return hue;
}

/**
 * Fills its container with a cover-cropped photo, or a deterministic colour
 * block with an initial when there is no image or it fails to load.
 */
export function Photo({
  uri,
  seed = "",
  name = "",
  blurRadius,
  style,
  decorative = true,
}: PhotoProps) {
  const [failed, setFailed] = useState(false);
  const hue = seedHue(seed || name);
  const showImage = Boolean(uri) && !failed;

  return (
    <View
      style={[
        styles.frame,
        {
          backgroundColor: `hsl(${hue}, 42%, 40%)`,
          experimental_backgroundImage: `linear-gradient(150deg, hsl(${hue}, 42%, 46%), hsl(${(hue + 40) % 360}, 38%, 28%))`,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          accessibilityLabel={decorative ? undefined : `Photo of ${name}`}
          accessibilityElementsHidden={decorative}
          blurRadius={blurRadius}
          importantForAccessibility={decorative ? "no" : "yes"}
          onError={() => setFailed(true)}
          resizeMode="cover"
          source={{ uri }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.initial}
        >
          {(name || seed || "?").trim().charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: "rgba(255, 255, 255, 0.4)",
    fontFamily: fonts.bold,
    fontSize: 48,
  },
});
