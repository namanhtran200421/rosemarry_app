import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { brut, colors, fonts, radii } from "../../../shared/theme/tokens";
import { Card } from "../../../shared/ui/Card";
import { Photo } from "../../../shared/ui/Photo";
import { TabHeading } from "../../../shared/ui/TabHeading";
import { Tag } from "../../../shared/ui/Tag";
import { photoUri } from "../../social/data/photos";
import { useSocial } from "../../social/state/SocialProvider";
import { profileCompletion } from "../../social/utils/profile-utils";

/** Read-only member tab until profile editing is connected to the backend. */
export function MyProfileScreen() {
  const { user } = useSocial();
  const completion = profileCompletion(user);
  const firstPhoto = user.photos[0];

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TabHeading title="Me" />
        <Card color={brut.pink} style={styles.identity}>
          <View style={styles.avatar}>
            <Photo
              name={user.name || "You"}
              seed={firstPhoto ?? user.name}
              uri={photoUri(firstPhoto)}
            />
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.name}>{user.name || "Your profile"}</Text>
            <Text style={styles.meta}>
              {[user.age, user.location].filter(Boolean).join(" · ") ||
                "Profile ready"}
            </Text>
            <Tag
              color={completion === 100 ? brut.green : brut.yellow}
              label={`${completion}% complete`}
              style={styles.completion}
            />
          </View>
        </Card>

        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Your interests
        </Text>
        <Card offset={2} style={styles.details}>
          {user.interests.length > 0 ? (
            <View style={styles.tags}>
              {user.interests.map((interest) => (
                <View key={interest} style={styles.interest}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>
              Your onboarding interests will appear here.
            </Text>
          )}
        </Card>

        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Looking for
        </Text>
        <Card color={brut.yellow} offset={2} style={styles.details}>
          <Text style={styles.value}>{user.lookingFor || "Not added yet"}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: brut.paper },
  scroll: { paddingBottom: 24 },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginHorizontal: 16,
    padding: 16,
  },
  avatar: {
    width: 86,
    height: 86,
    overflow: "hidden",
    borderRadius: radii.pill,
    borderWidth: brut.border,
    borderColor: brut.ink,
  },
  identityCopy: { flex: 1, minWidth: 0 },
  name: { color: brut.ink, fontFamily: fonts.bold, fontSize: 22 },
  meta: {
    marginTop: 3,
    color: brut.ink,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  completion: { marginTop: 10 },
  sectionTitle: {
    marginTop: 22,
    marginHorizontal: 18,
    marginBottom: 10,
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  details: { marginHorizontal: 16, padding: 16 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  interest: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: brut.ink,
    backgroundColor: colors.primary,
  },
  interestText: { color: brut.ink, fontFamily: fonts.bold, fontSize: 12 },
  empty: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  value: { color: brut.ink, fontFamily: fonts.bold, fontSize: 15 },
});
