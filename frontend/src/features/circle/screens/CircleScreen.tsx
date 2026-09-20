import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  brut,
  colors,
  drop,
  fonts,
  radii,
  spacing,
} from "../../../shared/theme/tokens";
import { Card } from "../../../shared/ui/Card";
import { Icon } from "../../../shared/ui/Icon";
import { IconBlock } from "../../../shared/ui/IconBlock";
import { MessageComposer } from "../../../shared/ui/MessageComposer";
import { Photo } from "../../../shared/ui/Photo";
import { SegmentedControl } from "../../../shared/ui/SegmentedControl";
import { TabHeading } from "../../../shared/ui/TabHeading";
import { Tag } from "../../../shared/ui/Tag";
import { photoUri } from "../../social/data/photos";
import { useSocial } from "../../social/state/SocialProvider";

interface CircleScreenProps {
  onOpenActivity: (activityId: string) => void;
}

const SECTIONS = [
  { value: "activities", label: "Activities" },
  { value: "chat", label: "Chat" },
];

/** Weekly Circle hub backed by the existing in-memory demo state. */
export function CircleScreen({ onOpenActivity }: CircleScreenProps) {
  const { circle, markRead, sendCircleMessage } = useSocial();
  const [section, setSection] = useState("activities");

  useEffect(() => {
    markRead(circle.id);
  }, [circle.id, markRead]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <TabHeading title="Circle" />
      <View style={styles.controls}>
        <SegmentedControl
          accessibilityLabel="Circle section"
          options={SECTIONS}
          value={section}
          onChange={setSection}
          size="sm"
        />
      </View>

      {section === "activities" ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Card color={brut.yellow} style={styles.hero}>
            <Tag label={`Refreshes in ${circle.refreshDays}d`} />
            <Text style={styles.circleName}>{circle.name}</Text>
            <Text style={styles.theme}>{circle.theme}</Text>
            <View style={styles.members}>
              {circle.members.slice(0, 6).map((member) => (
                <View key={member.id} style={styles.avatar}>
                  <Photo
                    name={member.name}
                    seed={member.photo}
                    uri={photoUri(member.photo)}
                  />
                </View>
              ))}
              <Text style={styles.memberCount}>
                {circle.members.length} members
              </Text>
            </View>
          </Card>

          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Circle activities
          </Text>
          <View style={styles.activityList}>
            {circle.activities.map((activity, index) => (
              <Pressable
                key={activity.id}
                accessibilityRole="button"
                accessibilityLabel={`${activity.title}. ${activity.done ? "Completed" : "Open activity"}`}
                onPress={() => onOpenActivity(activity.id)}
                style={({ pressed }) => [
                  styles.activity,
                  pressed && styles.pressed,
                ]}
              >
                <IconBlock
                  color={brut.blocks[index % brut.blocks.length]}
                  name={activity.icon}
                  size={44}
                />
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text numberOfLines={2} style={styles.activityBody}>
                    {activity.prompt}
                  </Text>
                </View>
                <Icon
                  color={activity.done ? brut.green : brut.ink}
                  name={activity.done ? "Check" : "ChevronRight"}
                  size={20}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.chat}>
          <ScrollView contentContainerStyle={styles.messages}>
            {circle.messages.map((message, index) => {
              const member = circle.members.find(
                (candidate) => candidate.id === message.from,
              );
              const mine = message.from === "me";
              const system = message.from === "system";

              return (
                <View
                  key={`${message.from}-${index}`}
                  style={[
                    styles.message,
                    mine && styles.messageMine,
                    system && styles.messageSystem,
                  ]}
                >
                  <Text style={styles.messageFrom}>
                    {mine ? "You" : system ? "Rosemarry" : member?.name}
                  </Text>
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
              );
            })}
          </ScrollView>
          <MessageComposer
            placeholder="Message your circle…"
            onSend={(text) => sendCircleMessage(circle.id, text)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: brut.paper },
  controls: { paddingHorizontal: 20, paddingBottom: spacing.md },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  hero: { padding: 18 },
  circleName: {
    marginTop: 14,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 25,
  },
  theme: {
    marginTop: 4,
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  members: { flexDirection: "row", alignItems: "center", marginTop: 18 },
  avatar: {
    width: 36,
    height: 36,
    marginRight: -7,
    overflow: "hidden",
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: brut.white,
  },
  memberCount: {
    marginLeft: 16,
    color: brut.ink,
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 19,
  },
  activityList: { gap: 12 },
  activity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radii.card,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
    boxShadow: drop(3),
  },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  activityCopy: { flex: 1, minWidth: 0 },
  activityTitle: { color: brut.ink, fontFamily: fonts.bold, fontSize: 15 },
  activityBody: {
    marginTop: 2,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  chat: { flex: 1 },
  messages: { gap: 10, paddingHorizontal: 16, paddingVertical: 12 },
  message: {
    alignSelf: "flex-start",
    maxWidth: "84%",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: radii.card,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.white,
  },
  messageMine: { alignSelf: "flex-end", backgroundColor: colors.primary },
  messageSystem: { alignSelf: "center", backgroundColor: brut.yellow },
  messageFrom: {
    marginBottom: 3,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 11,
  },
  messageText: {
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 19,
  },
});
