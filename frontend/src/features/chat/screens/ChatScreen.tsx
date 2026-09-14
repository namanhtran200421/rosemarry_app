import { useEffect, useState } from "react";
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
import { EmptyState } from "../../../shared/ui/EmptyState";
import { Photo } from "../../../shared/ui/Photo";
import { SearchBox } from "../../../shared/ui/SearchBox";
import { TabHeading } from "../../../shared/ui/TabHeading";
import { Tag } from "../../../shared/ui/Tag";
import { photoUri } from "../../social/data/photos";
import { useSocial } from "../../social/state/SocialProvider";
import type { Match } from "../../social/types/social.types";
import { matchTimeLeft } from "../../social/utils/profile-utils";
import { MatchTile } from "../components/MatchTile";

interface ChatScreenProps {
  onOpenThread: (matchId: string) => void;
  onViewProfile: (match: Match) => void;
}

/**
 * New matches waiting for a first message, then conversations. A match only
 * moves to Messages once someone has written.
 */
export function ChatScreen({ onOpenThread, onViewProfile }: ChatScreenProps) {
  const { matches, conversations } = useSocial();
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const hasMessages = (match: Match) => (conversations[match.id] ?? []).length > 0;
  const newMatches = matches.filter(
    (match) => !hasMessages(match) && !matchTimeLeft(match.matchedAt, now).expired,
  );
  const threads = matches.filter(
    (match) =>
      hasMessages(match) && match.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TabHeading title="Chat" />
        <View style={styles.search}>
          <SearchBox onChangeText={setQuery} placeholder="Search" value={query} />
        </View>

        {newMatches.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text accessibilityRole="header" style={styles.sectionTitle}>
                Matches
              </Text>
              <Tag color={brut.yellow} label="Message within 48h" />
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={styles.matchRow}
              showsHorizontalScrollIndicator={false}
            >
              {newMatches.map((match) => (
                <MatchTile
                  key={match.id}
                  match={match}
                  onPress={() => onOpenThread(match.id)}
                  timeLeft={matchTimeLeft(match.matchedAt, now)}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.messages}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Messages
          </Text>
          {threads.length === 0 ? (
            <EmptyState
              color={brut.purple}
              icon="Send"
              title="No conversations yet"
              body="Break the ice with one of your matches."
            />
          ) : (
            threads.map((match) => {
              const thread = conversations[match.id];
              const last = thread[thread.length - 1];
              return (
                <Pressable
                  key={match.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${match.name}: ${last.text}`}
                  onPress={() => onOpenThread(match.id)}
                  style={styles.thread}
                >
                  <Pressable
                    accessibilityLabel={`View ${match.name}'s profile`}
                    accessibilityRole="button"
                    onPress={() => onViewProfile(match)}
                    style={styles.avatar}
                  >
                    <Photo uri={photoUri(match.photo)} seed={match.photo} name={match.name} />
                  </Pressable>
                  <View style={styles.threadText}>
                    <Text style={styles.threadName}>{match.name}</Text>
                    <Text numberOfLines={1} style={styles.threadLast}>
                      {last.text}
                    </Text>
                  </View>
                  <Text style={styles.threadTime}>now</Text>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: brut.paper,
  },
  scroll: {
    flexGrow: 1,
  },
  search: {
    paddingTop: 2,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 19,
    marginBottom: 2,
  },
  matchRow: {
    gap: 14,
    paddingBottom: 10,
    paddingRight: 6,
  },
  messages: {
    flexGrow: 1,
    gap: 12,
    marginTop: 14,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: layout.tabBarClearance,
    borderTopWidth: brut.border,
    borderTopColor: brut.ink,
    backgroundColor: brut.white,
  },
  thread: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: radii.card,
    borderWidth: brut.border,
    borderColor: brut.ink,
    backgroundColor: brut.paper,
    boxShadow: drop(3),
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    overflow: "hidden",
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
  },
  threadText: {
    flex: 1,
    minWidth: 0,
  },
  threadName: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 15.5,
  },
  threadLast: {
    marginTop: 1,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  threadTime: {
    color: colors.textSecondary,
    fontFamily: fonts.semibold,
    fontSize: 11.5,
  },
});
