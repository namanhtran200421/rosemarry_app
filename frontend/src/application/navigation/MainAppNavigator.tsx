import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ChatScreen } from "../../features/chat/screens/ChatScreen";
import { ChatThreadScreen } from "../../features/chat/screens/ChatThreadScreen";
import { CircleScreen } from "../../features/circle/screens/CircleScreen";
import { ActivityGame } from "../../features/circle/activities/ActivityGame";
import { DiscoverScreen } from "../../features/discover/screens/DiscoverScreen";
import { LikesScreen } from "../../features/likes/screens/LikesScreen";
import { MatchPopup } from "../../features/people/components/MatchPopup";
import { MyProfileScreen } from "../../features/people/screens/MyProfileScreen";
import { PersonProfileScreen } from "../../features/people/screens/PersonProfileScreen";
import { ProfileViewerScreen } from "../../features/people/screens/ProfileViewerScreen";
import {
  SocialProvider,
  useSocial,
} from "../../features/social/state/SocialProvider";
import type {
  CurrentUser,
  PersonSummary,
  PurchaseType,
} from "../../features/social/types/social.types";
import { brut, colors, fonts } from "../../shared/theme/tokens";
import { AppButton } from "../../shared/ui/AppButton";
import { BottomSheet } from "../../shared/ui/BottomSheet";
import { PageScreen } from "../../shared/ui/PageScreen";
import { TabBar, type TabBarItem } from "../../shared/ui/TabBar";

type MainTab = "discover" | "likes" | "circle" | "chat" | "me";
type DetailRoute =
  | { kind: "activity"; activityId: string }
  | { kind: "thread"; matchId: string }
  | { kind: "profile"; person: PersonSummary }
  | { kind: "viewer"; person: PersonSummary };
type Notice = "filters" | "upgrade" | PurchaseType;

const TABS: readonly TabBarItem<MainTab>[] = [
  {
    key: "discover",
    label: "Discover",
    image: require("../../../assets/nav/nav-discover.png"),
  },
  {
    key: "likes",
    label: "Likes",
    image: require("../../../assets/nav/nav-likes.png"),
  },
  {
    key: "circle",
    label: "Circle",
    image: require("../../../assets/nav/nav-circle.png"),
  },
  {
    key: "chat",
    label: "Chat",
    image: require("../../../assets/nav/nav-chat.png"),
  },
  { key: "me", label: "Me", image: require("../../../assets/nav/nav-me.png") },
];

interface MainAppNavigatorProps {
  initialUser: CurrentUser;
  isNewMember: boolean;
}

/** Connects the existing raw feature screens into the authenticated app shell. */
export function MainAppNavigator({
  initialUser,
  isNewMember,
}: MainAppNavigatorProps) {
  return (
    <SocialProvider initialUser={initialUser} isNewMember={isNewMember}>
      <MainAppContent />
    </SocialProvider>
  );
}

function MainAppContent() {
  const social = useSocial();
  const [activeTab, setActiveTab] = useState<MainTab>("circle");
  const [detail, setDetail] = useState<DetailRoute | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  if (detail?.kind === "activity") {
    const activity = social.circle.activities.find(
      (candidate) => candidate.id === detail.activityId,
    );

    return activity ? (
      <PageScreen title={activity.title} onBack={() => setDetail(null)}>
        <ActivityGame
          activity={activity}
          members={social.circle.members}
          myPhoto={social.user.photos[0]}
          onClose={() => setDetail(null)}
          onComplete={(result) =>
            social.finishActivity(social.circle.id, activity.id, result)
          }
        />
      </PageScreen>
    ) : null;
  }

  if (detail?.kind === "thread") {
    return (
      <ChatThreadScreen
        matchId={detail.matchId}
        onBack={() => setDetail(null)}
        onViewProfile={(person) => setDetail({ kind: "profile", person })}
      />
    );
  }

  if (detail?.kind === "profile") {
    return (
      <PersonProfileScreen
        person={detail.person}
        myInterests={social.user.interests}
        onBack={() => setDetail(null)}
      />
    );
  }

  if (detail?.kind === "viewer") {
    return (
      <ProfileViewerScreen
        person={detail.person}
        myInterests={social.user.interests}
        onBack={() => setDetail(null)}
        onSwipe={(direction) => {
          if (direction === "left") {
            social.passLike(detail.person.id);
          } else {
            social.matchWith(detail.person);
          }
          setDetail(null);
        }}
      />
    );
  }

  let screen;
  switch (activeTab) {
    case "discover":
      screen = (
        <DiscoverScreen
          onNeedPurchase={setNotice}
          onOpenFilters={() => setNotice("filters")}
          onUpgrade={() => setNotice("upgrade")}
        />
      );
      break;
    case "likes":
      screen = (
        <LikesScreen
          onOpen={(person, kind) =>
            setDetail({ kind: kind === "likes" ? "viewer" : "profile", person })
          }
        />
      );
      break;
    case "chat":
      screen = (
        <ChatScreen
          onOpenThread={(matchId) => setDetail({ kind: "thread", matchId })}
          onViewProfile={(person) => setDetail({ kind: "profile", person })}
        />
      );
      break;
    case "me":
      screen = <MyProfileScreen />;
      break;
    default:
      screen = (
        <CircleScreen
          onOpenActivity={(activityId) =>
            setDetail({ kind: "activity", activityId })
          }
        />
      );
  }

  const noticeTitle =
    notice === "filters"
      ? "Filters"
      : notice === "upgrade"
        ? "Advanced demo"
        : "Demo credits";

  return (
    <View style={styles.root}>
      <View style={styles.screen}>{screen}</View>
      <TabBar
        active={activeTab}
        items={TABS}
        onChange={(tab) => setActiveTab(tab)}
      />

      <BottomSheet
        title={noticeTitle}
        subtitle="This frontend is using local demo state for now."
        visible={notice !== null}
        onClose={() => setNotice(null)}
      >
        <Text style={styles.noticeText}>
          {notice === "filters"
            ? "Your onboarding preferences are active. Full filter editing will connect when its backend endpoint is ready."
            : notice === "upgrade"
              ? "Switch the local demo to the Advanced plan to preview paid states."
              : "Add one local demo credit to keep testing this interaction."}
        </Text>
        {notice !== "filters" && notice !== null ? (
          <AppButton
            label={
              notice === "upgrade" ? "Use Advanced demo" : "Add demo credit"
            }
            onPress={() => {
              if (notice === "upgrade") {
                social.applyPlan("advanced");
              } else {
                social.addPurchase(notice, 1);
              }
              setNotice(null);
            }}
          />
        ) : null}
      </BottomSheet>

      <MatchPopup
        match={social.matchPopup}
        myName={social.user.name || "You"}
        myPhoto={social.user.photos[0]}
        onKeepSwiping={social.dismissMatchPopup}
        onMessage={(match) => {
          social.dismissMatchPopup();
          setDetail({ kind: "thread", matchId: match.id });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: brut.paper },
  screen: { flex: 1 },
  noticeText: {
    marginBottom: 18,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
});
