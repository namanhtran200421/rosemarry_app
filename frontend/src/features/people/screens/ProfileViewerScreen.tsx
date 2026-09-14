import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../../shared/theme/tokens";
import type { PersonSummary } from "../../social/types/social.types";
import { fillProfile } from "../../social/utils/profile-utils";
import {
  type SwipeDirection,
  SwipeableCard,
} from "../components/SwipeableCard";

interface ProfileViewerScreenProps {
  person: PersonSummary;
  myInterests: string[];
  onBack: () => void;
  onSwipe: (direction: SwipeDirection) => void;
}

/**
 * Full swipeable card for someone who liked you or shares your circle:
 * swipe right to match, left to pass, with a back button to leave.
 */
export function ProfileViewerScreen({
  person,
  myInterests,
  onBack,
  onSwipe,
}: ProfileViewerScreenProps) {
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.stage}>
        <SwipeableCard
          myInterests={myInterests}
          onBack={onBack}
          onResolve={onSwipe}
          profile={fillProfile(person)}
          short
        />
      </View>
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
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
