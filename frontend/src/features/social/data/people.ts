import type {
  CurrentUser,
  Match,
  PersonSummary,
} from "../types/social.types";

const HOUR = 3600 * 1000;

export const LIKES_YOU: PersonSummary[] = [
  { id: "l1", name: "Double H", age: 22, photo: "guy-1", source: "circle" },
  { id: "l2", name: "Marcus", age: 24, photo: "guy-2", source: "discover" },
  { id: "l3", name: "Daniel", age: 26, photo: "guy-3", source: "circle" },
  { id: "l4", name: "Kevin", age: 23, photo: "guy-4", source: "discover" },
];

/** Seeded relative to launch so the 48-hour countdowns show a spread. */
export function seedMatches(now: number): Match[] {
  return [
    { id: "m1", name: "Emelie", age: 24, photo: "emelie-1", matchedAt: now - 46.5 * HOUR },
    { id: "m2", name: "Abigail", age: 26, photo: "abigail-1", matchedAt: now - 41 * HOUR },
    { id: "m3", name: "Olivia", age: 23, photo: "olivia-1", matchedAt: now - 27 * HOUR },
    { id: "m4", name: "Chloe", age: 27, photo: "chloe-1", matchedAt: now - 3 * HOUR },
  ];
}

/** Starting point for a returning member whose profile is not loaded yet. */
export const DEMO_USER: CurrentUser = {
  name: "",
  age: undefined,
  gender: "",
  heightCm: 170,
  location: "Chicago, IL United States",
  bio: "",
  interests: [],
  lookingFor: "",
  languages: [],
  lifestyle: { Drinking: "No", Smoking: "No", Cannabis: "No", Workout: "No" },
  bonus: {},
  prompts: [],
  photos: [],
  plan: "free",
  superlikes: 1,
  firstMessages: 3,
};

export const CIRCLE_REPLIES = [
  "Haha love that 😄",
  "So true",
  "Same here!",
  "Okay that's a great point",
  "Adding that to my list",
  "Count me in 🙌",
];
