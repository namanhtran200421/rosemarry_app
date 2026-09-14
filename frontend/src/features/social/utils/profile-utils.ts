import {
  ICEBREAKER_FALLBACK,
  ICEBREAKERS,
  PROMPT_POOL,
} from "../data/catalogs";
import { FEATURED_PROFILES } from "../data/deck-featured";
import { MORE_PROFILES } from "../data/deck-more";
import { MATCH_TTL_MS } from "../data/plans";
import type {
  CurrentUser,
  Filters,
  PersonSummary,
  PlanId,
  Profile,
  ProfilePrompt,
} from "../types/social.types";

/** Stable 32-bit string hash for deterministic demo picks. */
export function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

/** Formats centimetres as feet and inches, e.g. 173 → 5'8". */
export function cmToFeet(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
}

/** Converts the onboarding wheel's "5'8" value to centimetres. */
export function feetToCm(value: string): number {
  const match = /(\d)'(\d+)/.exec(value);
  return match
    ? Math.round(Number(match[1]) * 30.48 + Number(match[2]) * 2.54)
    : 170;
}

/** Share of editable profile fields that are filled in, 0–100. */
export function profileCompletion(user: CurrentUser): number {
  const fields = [
    user.name,
    user.gender,
    user.heightCm,
    user.location,
    user.bio,
    user.interests.length,
    user.lookingFor,
    user.languages.length,
    Object.keys(user.lifestyle).length,
    user.bonus.personality,
    user.bonus.zodiac,
    user.bonus.children,
    user.bonus.education,
    user.bonus.work,
    user.photos.length,
  ];
  return Math.round((100 * fields.filter(Boolean).length) / fields.length);
}

/** Deterministic pair of prompts for any profile id. */
export function pickPrompts(id: string): ProfilePrompt[] {
  const hash = hashString(id || "x");
  const first = PROMPT_POOL[hash % PROMPT_POOL.length];
  const second = PROMPT_POOL[(hash + 3) % PROMPT_POOL.length];
  return first === second ? [first] : [first, second];
}

export const DECK: Profile[] = [...FEATURED_PROFILES, ...MORE_PROFILES].map(
  (entry) => ({ ...entry, prompts: pickPrompts(entry.id) }),
);

const FILL_POOL = {
  distance: ["1 km", "2 km", "4 km", "6 km", "9 km"],
  location: [
    "Chicago, IL United States",
    "Evanston, IL United States",
    "Oak Park, IL United States",
  ],
  bio: [
    "Coffee in one hand, camera in the other. Always up for a spontaneous road trip.",
    "Foodie, dog lover, and weekend hiker. Looking for someone to share new adventures with.",
    "Designer by day, live-music chaser by night. Tell me your favourite band.",
    "I believe the best stories start with a good conversation. Say hi!",
  ],
  interests: [
    ["Music", "Travel", "Coffee", "Photography", "Run", "Art"],
    ["Yoga", "Cooking", "Dancing", "Movies", "Reading", "Music"],
    ["Travel", "Pets", "Coffee", "Cycling", "Art", "Modeling"],
  ],
  looking: ["Long-term relationship", "Short-term relationship", "New friends"],
  languages: [
    ["English", "Spanish"],
    ["English", "Mandarin"],
    ["English", "French"],
  ],
  height: ["5' 4\"", "5' 6\"", "5' 8\"", "6' 0\""],
};

/**
 * Expands a like, match or circle member into a full profile: the deck entry
 * when one exists, otherwise deterministic demo details.
 */
export function fillProfile(person: PersonSummary): Profile {
  const known = DECK.find((profile) => profile.id === person.id);
  if (known) {
    return known;
  }

  const hash = hashString(person.id);
  const pick = <T>(values: T[]): T => values[hash % values.length];
  const lookingFor = pick(FILL_POOL.looking);

  return {
    id: person.id,
    name: person.name,
    age: person.age,
    photos: [person.photo],
    distance: pick(FILL_POOL.distance),
    location: pick(FILL_POOL.location),
    bio: pick(FILL_POOL.bio),
    aboutMe: [
      [pick(FILL_POOL.height), "height"],
      [lookingFor, "goal"],
    ],
    interests: pick(FILL_POOL.interests),
    lookingFor,
    languages: pick(FILL_POOL.languages),
    lifestyle: { Drinking: "Socially", Smoking: "None", Workout: "Often" },
    bonus: { personality: "ENFP", zodiac: "Leo", work: "UX Designer" },
    prompts: pickPrompts(person.id),
  };
}

/** Does a profile pass the filters? Advanced criteria apply to paid plans. */
export function matchesFilters(
  profile: Profile,
  filters: Filters,
  plan: PlanId,
): boolean {
  const km = Number.parseInt(String(profile.distance).replace(/\D/g, ""), 10);
  const includesAny = (wanted: string[], values: string[] = []) =>
    wanted.length === 0 || wanted.some((value) => values.includes(value));
  const allows = (wanted: string[], value: string | undefined) =>
    wanted.length === 0 || (value !== undefined && wanted.includes(value));

  if (km > filters.distance) return false;
  if (!allows(filters.showMe, profile.gender)) return false;
  if (
    profile.age !== undefined &&
    (profile.age < filters.age[0] || profile.age > filters.age[1])
  ) {
    return false;
  }
  if (!includesAny(filters.interests, profile.interests)) return false;
  if (!includesAny(filters.languages, profile.languages)) return false;

  if (plan === "free") {
    return true;
  }

  if (
    profile.heightCm !== undefined &&
    (profile.heightCm < filters.height[0] || profile.heightCm > filters.height[1])
  ) {
    return false;
  }
  if (!allows(filters.lookingFor, profile.lookingFor)) return false;
  for (const [category, wanted] of Object.entries(filters.lifestyle)) {
    const value = profile.lifestyle[category as keyof Profile["lifestyle"]];
    if (wanted && !allows(wanted, value)) return false;
  }
  return (
    allows(filters.personality, profile.bonus.personality) &&
    allows(filters.zodiac, profile.bonus.zodiac) &&
    allows(filters.children, profile.bonus.children)
  );
}

/** Shared ice-breaker question, preferring an interest both people love. */
export function icebreakerFor(
  matchId: string,
  theirInterests: string[],
  myInterests: string[],
): { interest: string | null; prompt: string } {
  const mine = myInterests.map((value) => value.toLowerCase());
  const mutual = theirInterests.filter(
    (value) => mine.includes(value.toLowerCase()) && ICEBREAKERS[value],
  );

  if (mutual.length === 0) {
    return { interest: null, prompt: ICEBREAKER_FALLBACK };
  }

  const interest = mutual[hashString(matchId) % mutual.length];
  return { interest, prompt: ICEBREAKERS[interest] };
}

/** Remaining time before an unmessaged match expires. */
export function matchTimeLeft(
  matchedAt: number,
  now: number,
): { expired: boolean; label: string; urgent: boolean } {
  const remaining = matchedAt + MATCH_TTL_MS - now;
  if (remaining <= 0) {
    return { expired: true, label: "Expired", urgent: true };
  }
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  return {
    expired: false,
    label: hours >= 1 ? `${hours}h left` : `${minutes}m left`,
    urgent: remaining < 6 * 3600000,
  };
}
