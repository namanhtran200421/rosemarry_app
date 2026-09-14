import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { brut, colors, palette } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { Icon } from "../../../shared/ui/Icon";
import { Photo } from "../../../shared/ui/Photo";
import {
  type SwipeDirection,
  SwipeableCard,
} from "../../people/components/SwipeableCard";
import { findPlan } from "../../social/data/plans";
import { photoUri } from "../../social/data/photos";
import { useSocial } from "../../social/state/SocialProvider";
import type { PurchaseType } from "../../social/types/social.types";
import { DECK, matchesFilters } from "../../social/utils/profile-utils";
import { DiscoverTopBar } from "../components/DiscoverTopBar";

interface DiscoverScreenProps {
  onOpenFilters: () => void;
  onUpgrade: () => void;
  onNeedPurchase: (type: PurchaseType) => void;
}

/** Swipeable deck of profiles filtered by the member's preferences. */
export function DiscoverScreen(props: DiscoverScreenProps) {
  const { filters, user } = useSocial();
  // Changing filters or plan rebuilds the deck from today's position.
  const deckKey = `${user.plan}:${JSON.stringify(filters)}`;
  return <DiscoverDeck key={deckKey} {...props} />;
}

function DiscoverDeck({ onOpenFilters, onUpgrade, onNeedPurchase }: DiscoverScreenProps) {
  const social = useSocial();
  const { user, filters, seenToday, setSeenToday } = social;
  const deck = useMemo(
    () => DECK.filter((profile) => matchesFilters(profile, filters, user.plan)),
    [filters, user.plan],
  );
  const [index, setIndex] = useState(seenToday);
  const [history, setHistory] = useState<number[]>([]);
  const dailyLimit = findPlan(user.plan).dailyLimit;
  const profile = deck[index];
  const next = deck[index + 1];
  const limitReached = dailyLimit > 0 && index >= dailyLimit;

  function resolve(direction: SwipeDirection): void {
    if (direction === "right") {
      social.recordLike(profile, false, "discover");
    } else if (direction === "up") {
      social.spendSuperlike(profile);
    }
    setHistory((current) => [...current, index]);
    setIndex((current) => current + 1);
    setSeenToday((seen) => seen + 1);
  }

  function rewind(): void {
    const last = history[history.length - 1];
    if (last === undefined) {
      return;
    }
    setHistory((current) => current.slice(0, -1));
    setIndex(last);
    setSeenToday((seen) => Math.max(0, seen - 1));
  }

  let body;
  if (limitReached) {
    body = (
      <EmptyState
        icon="Sparkles"
        color={brut.yellow}
        title="That's today's profiles"
        body={
          user.plan === "advanced"
            ? `You've seen all ${dailyLimit} of today's profiles. New ones arrive tomorrow.`
            : `You've seen all ${dailyLimit} of today's profiles. Upgrade to Advanced for 20 a day.`
        }
      >
        <View style={styles.actions}>
          {user.plan !== "advanced" ? (
            <AppButton label="Upgrade to Advanced" onPress={onUpgrade} />
          ) : null}
          {history.length > 0 ? (
            <AppButton intent="neutral" label="Rewind last profile" onPress={rewind} size="md" />
          ) : null}
        </View>
      </EmptyState>
    );
  } else if (!profile) {
    body = (
      <EmptyState
        icon="Cards"
        color={brut.white}
        title="You're all caught up"
        body="No more profiles match your filters right now."
      >
        <View style={styles.actions}>
          <AppButton
            intent="neutral"
            label="Adjust filters"
            leadingIcon={<Icon name="Menu" size={18} />}
            onPress={onOpenFilters}
            size="md"
          />
          {history.length > 0 ? (
            <AppButton label="Rewind last pass" onPress={rewind} size="md" />
          ) : null}
        </View>
      </EmptyState>
    );
  } else {
    body = (
      <View style={styles.stage}>
        {next ? (
          <View pointerEvents="none" style={styles.nextCard}>
            <Photo uri={photoUri(next.photos[0])} seed={next.photos[0]} name={next.name} />
          </View>
        ) : null}
        <SwipeableCard
          key={profile.id}
          canRewind={history.length > 0}
          messaged={social.firstMessaged.includes(profile.id)}
          myInterests={user.interests}
          onRequestMessage={() => {
            if (user.firstMessages > 0) return true;
            onNeedPurchase("firstmessage");
            return false;
          }}
          onRequestSuperlike={() => {
            if (user.superlikes > 0) return true;
            onNeedPurchase("superlike");
            return false;
          }}
          onResolve={resolve}
          onRewind={rewind}
          onSendMessage={(text) => {
            social.spendFirstMessage();
            social.sendFirstImpression(profile, text);
          }}
          profile={profile}
          showActions
        />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <DiscoverTopBar limit={dailyLimit} onOpenFilters={onOpenFilters} seen={index} />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundWarm,
  },
  stage: {
    flex: 1,
    marginTop: 2,
    marginHorizontal: 10,
  },
  nextCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
    overflow: "hidden",
    opacity: 0.6,
    transform: [{ scale: 0.96 }],
    backgroundColor: palette.gray200,
  },
  actions: {
    alignSelf: "stretch",
    gap: 10,
    marginTop: 4,
  },
});
