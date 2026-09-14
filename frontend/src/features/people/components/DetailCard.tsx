import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

import { brut, colors, fonts } from "../../../shared/theme/tokens";
import { Card } from "../../../shared/ui/Card";
import { Icon, type IconName } from "../../../shared/ui/Icon";
import { IconBlock } from "../../../shared/ui/IconBlock";

interface DetailCardProps extends PropsWithChildren {
  icon: IconName;
  title: string;
  block: string;
  tight?: boolean;
}

/** Outlined profile section with a colour-block icon and title header. */
export function DetailCard({ icon, title, block, tight, children }: DetailCardProps) {
  return (
    <Card radius={16} style={styles.card}>
      <View style={[styles.header, { marginBottom: tight ? 8 : 14 }]}>
        <IconBlock name={icon} color={block} size={34} iconSize={18} radius={9} />
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
      </View>
      {children}
    </Card>
  );
}

interface DetailRowProps {
  icon?: IconName;
  label: string;
  value: string;
  first?: boolean;
}

/** "Icon · label · value" row with a rule above all but the first. */
export function DetailRow({ icon, label, value, first = false }: DetailRowProps) {
  return (
    <View style={[styles.row, !first && styles.rowRuled]}>
      {icon ? <Icon name={icon} size={19} /> : null}
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  title: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 19,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
  },
  rowRuled: {
    borderTopWidth: brut.borderThin,
    borderTopColor: brut.ink,
  },
  rowLabel: {
    minWidth: 96,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 14.5,
  },
  rowValue: {
    flex: 1,
    textAlign: "right",
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },
});
