import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  brut,
  colors,
  drop,
  fonts,
  layout,
  radii,
} from "../../../shared/theme/tokens";
import { BottomSheet } from "../../../shared/ui/BottomSheet";
import { Card } from "../../../shared/ui/Card";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { IconBlock } from "../../../shared/ui/IconBlock";
import { TabHeading } from "../../../shared/ui/TabHeading";
import { useSocial } from "../../social/state/SocialProvider";
import type { PersonSummary } from "../../social/types/social.types";
import { LikeCard } from "../components/LikeCard";

type LikesTab = "likes" | "circle" | "sent";

const TABS: [LikesTab, string][] = [
  ["likes", "Likes"],
  ["circle", "Circle"],
  ["sent", "Sent"],
];

const EMPTY_COPY: Record<LikesTab, [string, string]> = {
  likes: ["No likes yet", "When someone likes you, they appear here."],
  circle: [
    "No Circle likes yet",
    "Likes from your weekly Circle stay hidden until the Circle refreshes — they’ll appear here then.",
  ],
  sent: ["No likes sent yet", "People you like will show up here."],
};

interface LikesScreenProps {
  /** Opens someone who liked you (swipeable) or someone you liked. */
  onOpen: (person: PersonSummary, kind: "likes" | "sent") => void;
}

/** Who liked you, circle likes waiting to be revealed, and likes you sent. */
export function LikesScreen({ onOpen }: LikesScreenProps) {
  const { likesYou, likesSent, circle } = useSocial();
  const [tab, setTab] = useState<LikesTab>("likes");
  const [showInfo, setShowInfo] = useState(false);
  const list =
    tab === "sent"
      ? likesSent
      : likesYou.filter((person) =>
          tab === "circle" ? person.source === "circle" : person.source !== "circle",
        );
  const revealDays = Math.max(0, circle.refreshDays);
  const rows = Array.from({ length: Math.ceil(list.length / 2) }, (_, row) =>
    list.slice(row * 2, row * 2 + 2),
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <TabHeading title="Likes">
          {tab === "circle" ? (
            <Pressable
              accessibilityLabel="About Circle likes"
              accessibilityRole="button"
              hitSlop={10}
              onPress={() => setShowInfo(true)}
              style={styles.info}
            >
              <Text style={styles.infoText}>!</Text>
            </Pressable>
          ) : null}
        </TabHeading>
        <View accessibilityRole="tablist" style={styles.tabs}>
          {TABS.map(([id, label]) => (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === id }}
              onPress={() => setTab(id)}
              style={[styles.tab, tab === id && styles.tabActive]}
            >
              <Text style={styles.tabLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {list.length === 0 ? (
          <EmptyState icon="Heart" title={EMPTY_COPY[tab][0]} body={EMPTY_COPY[tab][1]} />
        ) : (
          <>
            {tab === "circle" ? (
              <Card color={brut.yellow} style={styles.revealCard}>
                <IconBlock name="Lock" color={brut.white} size={40} iconSize={18} />
                <View style={styles.revealText}>
                  <Text style={styles.revealTitle}>
                    {revealDays <= 0
                      ? "Revealing now…"
                      : `Revealed in ${revealDays} ${revealDays === 1 ? "day" : "days"}`}
                  </Text>
                  <Text style={styles.revealBody}>
                    Circle likes unlock when your Circle refreshes.
                  </Text>
                </View>
              </Card>
            ) : null}
            {rows.map((row) => (
              <View key={row[0].id} style={styles.gridRow}>
                {row.map((person) => (
                  <LikeCard
                    key={person.id}
                    locked={tab === "circle"}
                    onPress={() => onOpen(person, tab === "sent" ? "sent" : "likes")}
                    person={person}
                  />
                ))}
                {row.length === 1 ? <View style={styles.gridSpacer} /> : null}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <BottomSheet
        onClose={() => setShowInfo(false)}
        subtitle="Until your Circle refreshes."
        title="Circle likes are hidden"
        visible={showInfo}
      >
        <Card offset={3} radius={12} style={styles.infoCard}>
          <IconBlock name="Users" color={brut.purple} size={40} />
          <Text style={styles.infoBody}>
            People from your weekly Circle who liked you stay hidden here until
            the Circle refreshes. When the new Circle forms, their likes are
            revealed so you can match.
          </Text>
        </Card>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: brut.paper,
  },
  header: {
    borderBottomWidth: brut.border,
    borderBottomColor: brut.ink,
  },
  info: {
    width: 26,
    height: 26,
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
  },
  tabActive: {
    backgroundColor: colors.primary,
    boxShadow: drop(3),
  },
  tabLabel: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 13.5,
  },
  body: {
    flexGrow: 1,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: layout.tabBarClearance,
  },
  revealCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  revealText: {
    flex: 1,
  },
  revealTitle: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 14.5,
  },
  revealBody: {
    marginTop: 2,
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: 12.5,
    lineHeight: 17,
  },
  gridRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  gridSpacer: {
    flex: 1,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
    padding: 15,
  },
  infoBody: {
    flex: 1,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
