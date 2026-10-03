import type { BasicProfileInput } from "../api/onboarding-api";
import type { OnboardingProfile } from "../types/onboarding.types";

const DATING_GOALS: Record<
  string,
  NonNullable<BasicProfileInput["datingGoal"]>
> = {
  long: "LONG_TERM_RELATIONSHIP",
  short: "SHORT_TERM_RELATIONSHIP",
  casual: "CASUAL_DATING",
  friends: "NEW_FRIENDS",
  unsure: "NOT_SURE_YET",
};

export function ageFromDateOfBirth(
  value: string,
  now = new Date(),
): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return null;
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1;
  const currentDay = now.getUTCDate();
  return (
    currentYear -
    year -
    (currentMonth < month || (currentMonth === month && currentDay < day)
      ? 1
      : 0)
  );
}

export function toBasicProfile(profile: OnboardingProfile): BasicProfileInput {
  const height = /^(\d+)'(\d+)$/.exec(profile.height);
  return {
    displayName: profile.name.trim(),
    dateOfBirth: profile.dateOfBirth,
    genderId: profile.genderId,
    bio: profile.bio.trim() || null,
    datingGoal: DATING_GOALS[profile.lookingFor] ?? null,
    heightCm: height
      ? Math.round(Number(height[1]) * 30.48 + Number(height[2]) * 2.54)
      : null,
  };
}
