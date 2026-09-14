import { StyleSheet, Text, View } from "react-native";

import {
  brut,
  colors,
  drop,
  fonts,
  radii,
} from "../../../shared/theme/tokens";
import { Icon, type IconName } from "../../../shared/ui/Icon";
import { LIFESTYLE_CATEGORIES } from "../../social/data/catalogs";
import type { AboutKind, Profile } from "../../social/types/social.types";

import { DetailCard, DetailRow } from "./DetailCard";
import { ProfileSafetyActions } from "./ProfileSafetyActions";

const ABOUT_ICON: Record<AboutKind, IconName> = {
  height: "Ruler",
  gender: "User",
  kids: "Baby",
  goal: "Target",
};

const BONUS_ROWS: [key: keyof Profile["bonus"], label: string, icon: IconName][] =
  [
    ["personality", "Personality type", "Brain"],
    ["zodiac", "Zodiac", "Moon"],
    ["children", "Children", "Baby"],
    ["education", "Education", "GradCap"],
    ["work", "Work", "Briefcase"],
  ];

interface ProfileDetailProps {
  profile: Profile;
  /** The viewer's interests; shared ones are highlighted. */
  myInterests: string[];
  hideActions?: boolean;
  /** Runs after a block or report is confirmed. */
  onAfterSafetyAction?: () => void;
}

/** Scrollable full-profile body, grouped into outlined cards. */
export function ProfileDetail({
  profile,
  myInterests,
  hideActions = false,
  onAfterSafetyAction,
}: ProfileDetailProps) {
  const mine = myInterests.map((value) => value.toLowerCase());
  const isShared = (value: string) => mine.includes(value.toLowerCase());
  const aboutRows = [
    profile.location && { icon: "MapPin", label: "Location", value: profile.location },
    profile.lookingFor && { icon: "HeartOutline", label: "Looking for", value: profile.lookingFor },
    profile.languages.length > 0 && { icon: "Globe", label: "Languages", value: profile.languages.join(", ") },
  ].filter(Boolean) as { icon: IconName; label: string; value: string }[];
  const lifestyle = LIFESTYLE_CATEGORIES.filter(([key]) => profile.lifestyle[key]);
  const bonus = BONUS_ROWS.filter(([key]) => profile.bonus[key]);

  return (
    <View style={styles.stack}>
      {aboutRows.length > 0 ? (
        <DetailCard icon="Heart" title="About" block={brut.pink}>
          {aboutRows.map((row, index) => (
            <DetailRow key={row.label} {...row} first={index === 0} />
          ))}
        </DetailCard>
      ) : null}

      {profile.bio ? (
        <DetailCard icon="MessageCircle" title="Bio" block={brut.purple} tight>
          <Text style={styles.body}>{profile.bio}</Text>
        </DetailCard>
      ) : null}

      {profile.interests.length > 0 ? (
        <DetailCard icon="Heart" title="Interests" block={brut.pink}>
          <View style={styles.wrap}>
            {profile.interests.map((interest) => (
              <View
                key={interest}
                style={[
                  styles.pill,
                  isShared(interest) && styles.pillShared,
                ]}
              >
                <Text style={styles.pillLabel}>{interest}</Text>
              </View>
            ))}
          </View>
          {profile.interests.some(isShared) ? (
            <View style={styles.note}>
              <Icon name="Sparkles" size={15} />
              <Text style={styles.noteText}>
                Highlighted interests are ones you share.
              </Text>
            </View>
          ) : null}
        </DetailCard>
      ) : null}

      {profile.prompts.length > 0 ? (
        <DetailCard icon="MessageCircle" title="Prompts" block={brut.purple}>
          {profile.prompts.map((prompt, index) => (
            <View key={prompt.q} style={[styles.prompt, index > 0 && styles.promptRuled]}>
              <Text style={styles.promptQ}>{prompt.q}</Text>
              <Text style={styles.promptA}>{prompt.a}</Text>
            </View>
          ))}
        </DetailCard>
      ) : null}

      {profile.aboutMe.length > 0 || lifestyle.length > 0 ? (
        <DetailCard icon="User" title="Basics & Lifestyle" block={brut.green}>
          {profile.aboutMe.length > 0 ? (
            <View style={[styles.wrap, lifestyle.length > 0 && styles.wrapSpaced]}>
              {profile.aboutMe.map(([label, kind]) => (
                <View key={`${kind}-${label}`} style={styles.fact}>
                  <Icon name={ABOUT_ICON[kind]} size={16} />
                  <Text style={styles.factLabel}>{label}</Text>
                </View>
              ))}
            </View>
          ) : null}
          {lifestyle.map(([key, icon], index) => (
            <DetailRow
              key={key}
              icon={icon}
              label={key}
              value={profile.lifestyle[key] ?? ""}
              first={index === 0 && profile.aboutMe.length === 0}
            />
          ))}
        </DetailCard>
      ) : null}

      {bonus.length > 0 ? (
        <DetailCard icon="GradCap" title="More about them" block={brut.yellow}>
          {bonus.map(([key, label, icon], index) => (
            <DetailRow
              key={key}
              icon={icon}
              label={label}
              value={profile.bonus[key] ?? ""}
              first={index === 0}
            />
          ))}
        </DetailCard>
      ) : null}

      {hideActions ? null : (
        <ProfileSafetyActions
          firstName={profile.name.split(" ")[0]}
          onDone={onAfterSafetyAction}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
    paddingTop: 16,
    paddingHorizontal: 2,
    paddingBottom: 28,
  },
  body: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  wrapSpaced: {
    marginBottom: 6,
  },
  pill: {
    height: 40,
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.white,
  },
  pillShared: {
    backgroundColor: colors.primary,
    boxShadow: drop(3),
  },
  pillLabel: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 13.5,
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 14,
  },
  noteText: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12.5,
  },
  prompt: {
    paddingBottom: 14,
  },
  promptRuled: {
    paddingTop: 14,
    borderTopWidth: brut.borderThin,
    borderTopColor: brut.ink,
  },
  promptQ: {
    marginBottom: 4,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  promptA: {
    color: brut.ink,
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
  },
  fact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: brut.borderThin,
    borderColor: brut.ink,
    backgroundColor: brut.white,
  },
  factLabel: {
    color: brut.ink,
    fontFamily: fonts.semibold,
    fontSize: 13.5,
  },
});
