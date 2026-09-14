import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { brut, colors, drop, fonts, radii } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { BottomSheet } from "../../../shared/ui/BottomSheet";
import { Icon } from "../../../shared/ui/Icon";

const REPORT_REASONS = [
  "Inappropriate photos",
  "Feels like a scam or spam",
  "Harassment or bullying",
  "Underage user",
  "Someone is in danger",
  "Other",
];

type SheetState = "block" | "report" | "blocked" | "reported" | null;

interface ProfileSafetyActionsProps {
  firstName: string;
  onDone?: () => void;
}

/**
 * Block and Report controls with their confirmation sheets. Reports are not
 * sent anywhere yet; the flow confirms locally.
 */
export function ProfileSafetyActions({ firstName, onDone }: ProfileSafetyActionsProps) {
  const [sheet, setSheet] = useState<SheetState>(null);
  const close = () => setSheet(null);
  const isResult = sheet === "blocked" || sheet === "reported";

  const titles: Record<Exclude<SheetState, null>, [string?, string?]> = {
    block: [
      `Block ${firstName}?`,
      `${firstName} won’t be able to see your profile or message you, and you won’t see them again. They won’t be notified.`,
    ],
    report: [`Report ${firstName}`, "Your report is anonymous. What’s going on?"],
    blocked: [],
    reported: [],
  };
  const [title, subtitle] = sheet ? titles[sheet] : [];

  return (
    <View style={styles.actions}>
      <AppButton intent="dark" label="Block" onPress={() => setSheet("block")} />
      <AppButton intent="dark" label="Report" onPress={() => setSheet("report")} />

      <BottomSheet visible={sheet !== null} onClose={close} title={title} subtitle={subtitle}>
        {sheet === "block" ? (
          <View style={styles.buttons}>
            <AppButton intent="danger" label={`Block ${firstName}`} onPress={() => setSheet("blocked")} />
            <AppButton intent="neutral" label="Cancel" onPress={close} />
          </View>
        ) : null}

        {sheet === "report"
          ? REPORT_REASONS.map((reason, index) => (
              <Pressable
                key={reason}
                accessibilityRole="button"
                onPress={() => setSheet("reported")}
                style={[styles.reason, index > 0 && styles.reasonRuled]}
              >
                <Text style={styles.reasonLabel}>{reason}</Text>
                <Icon name="ChevronRight" size={18} />
              </Pressable>
            ))
          : null}

        {isResult ? (
          <View style={styles.result}>
            <View style={styles.check}>
              <Icon name="Check" size={28} />
            </View>
            <Text accessibilityRole="header" style={styles.resultTitle}>
              {sheet === "blocked" ? `${firstName} has been blocked` : "Report sent"}
            </Text>
            <Text style={styles.resultBody}>
              {sheet === "blocked"
                ? `You won’t see ${firstName} again.`
                : "Thanks for keeping Rosemarry safe. Our team will review this report."}
            </Text>
            <AppButton
              label="Done"
              size="md"
              style={styles.done}
              onPress={() => {
                close();
                onDone?.();
              }}
            />
          </View>
        ) : null}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 4,
  },
  buttons: {
    gap: 10,
  },
  reason: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 2,
  },
  reasonRuled: {
    borderTopWidth: brut.borderThin,
    borderTopColor: brut.ink,
  },
  reasonLabel: {
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  result: {
    alignItems: "center",
    paddingTop: 6,
  },
  check: {
    width: 56,
    height: 56,
    marginBottom: 14,
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.green,
    boxShadow: drop(4),
    alignItems: "center",
    justifyContent: "center",
  },
  resultTitle: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 19,
    textAlign: "center",
  },
  resultBody: {
    marginTop: 8,
    marginBottom: 18,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  done: {
    alignSelf: "stretch",
  },
});
