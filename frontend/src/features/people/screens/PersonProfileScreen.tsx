import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../../shared/theme/tokens";
import type { PersonSummary } from "../../social/types/social.types";
import { fillProfile } from "../../social/utils/profile-utils";
import { ProfilePreview } from "../components/ProfilePreview";

interface PersonProfileScreenProps {
  person: PersonSummary;
  myInterests: string[];
  onBack: () => void;
}

/**
 * Read-only profile of someone you already have a connection with — a chat
 * match or a like you sent — so it carries no swipe actions.
 */
export function PersonProfileScreen({
  person,
  myInterests,
  onBack,
}: PersonProfileScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfilePreview
          heroHeight={460}
          hideLocation
          myInterests={myInterests}
          onBack={onBack}
          profile={fillProfile(person)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundWarm,
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: 10,
  },
});
