import { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {
  brut,
  colors,
  drop,
  fonts,
  radii,
} from "../../../shared/theme/tokens";
import { Card } from "../../../shared/ui/Card";
import { Icon } from "../../../shared/ui/Icon";
import { MessageComposer } from "../../../shared/ui/MessageComposer";
import { PageScreen } from "../../../shared/ui/PageScreen";
import { Photo } from "../../../shared/ui/Photo";
import { photoUri } from "../../social/data/photos";
import { useSocial } from "../../social/state/SocialProvider";
import type { Match } from "../../social/types/social.types";
import { fillProfile, icebreakerFor } from "../../social/utils/profile-utils";
import { IceBreakerCard } from "../components/IceBreakerCard";

interface ChatThreadScreenProps {
  matchId: string;
  onBack: () => void;
  onViewProfile: (match: Match) => void;
}

/** One-to-one conversation with a match. */
export function ChatThreadScreen({ matchId, onBack, onViewProfile }: ChatThreadScreenProps) {
  const { matches, conversations, user, sendMessage, answerIceBreaker } = useSocial();
  const scrollRef = useRef<ScrollView>(null);
  const match = matches.find((item) => item.id === matchId);

  if (!match) {
    return (
      <PageScreen title="Chat" onBack={onBack}>
        <Text style={styles.missing}>This match is no longer available.</Text>
      </PageScreen>
    );
  }

  const messages = conversations[match.id] ?? [];
  const icebreaker = icebreakerFor(match.id, fillProfile(match).interests, user.interests);

  return (
    <PageScreen
      title={match.name}
      onBack={onBack}
      scroll={false}
      headerContent={
        <Pressable
          accessibilityLabel={`View ${match.name}'s profile`}
          accessibilityRole="button"
          onPress={() => onViewProfile(match)}
          style={styles.participant}
        >
          <View style={styles.avatar}>
            <Photo uri={photoUri(match.photo)} seed={match.photo} name={match.name} />
          </View>
          <Text numberOfLines={1} style={styles.participantName}>
            {match.name}
          </Text>
        </Pressable>
      }
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <IceBreakerCard
            interest={icebreaker.interest}
            matchName={match.name}
            onAnswer={(answer) => answerIceBreaker(match.id, icebreaker.prompt, answer)}
            prompt={icebreaker.prompt}
          />
        ) : (
          messages.map((message, index) =>
            message.from === "system" ? (
              <Card key={index} color={brut.yellow} offset={3} style={styles.system}>
                <View style={styles.systemLabel}>
                  <Icon name="Sparkles" size={12} />
                  <Text style={styles.systemTag}>ICE BREAKER</Text>
                </View>
                <Text style={styles.systemText}>{message.text}</Text>
              </Card>
            ) : (
              <View
                key={index}
                style={[
                  styles.bubble,
                  message.from === "me" ? styles.mine : styles.theirs,
                ]}
              >
                <Text style={styles.bubbleText}>{message.text}</Text>
              </View>
            ),
          )
        )}
      </ScrollView>
      <MessageComposer
        onSend={(text) => sendMessage(match.id, text)}
        placeholder="Message…"
      />
    </PageScreen>
  );
}

const styles = StyleSheet.create({
  missing: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  participant: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    overflow: "hidden",
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
  },
  participantName: {
    flex: 1,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 17.5,
  },
  body: {
    flexGrow: 1,
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  system: {
    alignSelf: "center",
    maxWidth: "88%",
    alignItems: "center",
    marginVertical: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  systemLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  systemTag: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 0.84,
  },
  systemText: {
    marginTop: 5,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 14.5,
    lineHeight: 20,
    textAlign: "center",
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.card,
    borderWidth: brut.border,
    borderColor: brut.ink,
    boxShadow: drop(3),
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: brut.white,
  },
  bubbleText: {
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 20,
  },
});
