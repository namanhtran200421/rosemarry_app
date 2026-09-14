import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { brut, fonts } from "../theme/tokens";

import { BackButton } from "./BackButton";

interface PageScreenProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
  /** Control placed at the right end of the header bar. */
  right?: ReactNode;
  /** Pinned footer that stays reachable while the body scrolls. */
  footer?: ReactNode;
  /** Set false for bodies that manage their own scrolling (threads). */
  scroll?: boolean;
  /** Replaces the default title block, e.g. a chat participant. */
  headerContent?: ReactNode;
}

/** Full-screen page: an outlined white header bar over a paper body. */
export function PageScreen({
  title,
  onBack,
  children,
  right,
  footer,
  scroll = true,
  headerContent,
}: PageScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton compact onPress={onBack} />
        {headerContent ?? (
          <Text accessibilityRole="header" numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        )}
        {right}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.flex}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.flex}>{children}</View>
        )}
        {footer ? (
          <SafeAreaView edges={["bottom"]} style={styles.footer}>
            {footer}
          </SafeAreaView>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: brut.paper,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: brut.white,
    borderBottomWidth: brut.border,
    borderBottomColor: brut.ink,
  },
  title: {
    flex: 1,
    minWidth: 0,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  footer: {
    paddingTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: brut.paper,
    borderTopWidth: brut.border,
    borderTopColor: brut.ink,
  },
});
