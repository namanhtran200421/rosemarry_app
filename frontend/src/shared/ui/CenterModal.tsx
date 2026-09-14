import type { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { colors } from "../theme/tokens";

import { Card } from "./Card";

interface CenterModalProps extends PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  maxWidth?: number;
  dismissible?: boolean;
}

/** Centered outlined dialog over a dim scrim. */
export function CenterModal({
  visible,
  onClose,
  maxWidth = 320,
  dismissible = true,
  children,
}: CenterModalProps) {
  function requestClose(): void {
    if (dismissible) {
      onClose();
    }
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={requestClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.root}>
        <Pressable
          accessible={false}
          accessibilityElementsHidden
          disabled={!dismissible}
          importantForAccessibility="no-hide-descendants"
          onPress={requestClose}
          style={styles.scrim}
        />
        <View accessibilityViewIsModal style={[styles.dialog, { maxWidth }]}>
          <Card offset={6} radius={18} style={styles.card}>
            {children}
          </Card>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
  },
  scrim: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlayScrim,
  },
  dialog: {
    width: "100%",
  },
  card: {
    paddingTop: 26,
    paddingHorizontal: 24,
    paddingBottom: 22,
    alignItems: "center",
  },
});
