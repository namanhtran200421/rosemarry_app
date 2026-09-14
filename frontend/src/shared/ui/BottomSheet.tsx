import { type PropsWithChildren, useEffect, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { brut, colors, fonts } from "../theme/tokens";

import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

const SHEET_RADIUS = 20;

interface BottomSheetProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  /** Tallest share of the screen the sheet may take before scrolling. */
  maxHeightRatio?: number;
}

/**
 * Paper sheet rising from the bottom edge over a dim scrim. Tapping the scrim
 * or the close control dismisses it; the body scrolls when content is long.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  maxHeightRatio = 0.82,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [rise] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      rise.setValue(0);
      Animated.timing(rise, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [rise, visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.root}
      >
        <Pressable
          accessibilityLabel="Close"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.scrim}
        />
        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: `${Math.round(maxHeightRatio * 100)}%`,
              transform: [
                {
                  translateY: rise.interpolate({
                    inputRange: [0, 1],
                    outputRange: [480, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              {title ? (
                <Text accessibilityRole="header" style={styles.title}>
                  {title}
                </Text>
              ) : null}
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            <IconButton
              accessibilityLabel="Close"
              onPress={onClose}
              rounded="circle"
              size={32}
              offset={0}
            >
              <Icon name="X" size={18} />
            </IconButton>
          </View>
          <ScrollView
            bounces={false}
            contentContainerStyle={[
              styles.body,
              { paddingBottom: 26 + insets.bottom },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrim: {
    position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
    backgroundColor: colors.overlayScrim,
  },
  sheet: {
    backgroundColor: brut.paper,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    borderWidth: brut.border,
    borderBottomWidth: 0,
    borderColor: brut.ink,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 19,
    lineHeight: 24,
  },
  subtitle: {
    marginTop: 4,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  body: {
    paddingTop: 8,
    paddingHorizontal: 20,
  },
});
