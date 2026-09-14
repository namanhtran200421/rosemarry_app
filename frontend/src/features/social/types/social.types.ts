/**
 * Shapes for the main app's people, circles and plans. Everything here is
 * served from local demo data until the backend exposes these resources.
 */

export type PlanId = "free" | "advanced";
export type LikeSource = "discover" | "circle";
export type LifestyleCategory = "Drinking" | "Smoking" | "Cannabis" | "Workout";
export type AboutKind = "height" | "gender" | "kids" | "goal";

export interface ProfileBonus {
  personality?: string;
  zodiac?: string;
  children?: string;
  education?: string;
  work?: string;
}

export interface ProfilePrompt {
  q: string;
  a: string;
}

/** A full profile, as shown on a Discover card or a profile page. */
export interface Profile {
  id: string;
  name: string;
  age?: number;
  distance?: string;
  gender?: string;
  heightCm?: number;
  photos: string[];
  location?: string;
  bio?: string;
  aboutMe: [label: string, kind: AboutKind][];
  interests: string[];
  lookingFor?: string;
  languages: string[];
  lifestyle: Partial<Record<LifestyleCategory, string>>;
  bonus: ProfileBonus;
  prompts: ProfilePrompt[];
}

/** The small card data carried by likes, matches and circle members. */
export interface PersonSummary {
  id: string;
  name: string;
  age?: number;
  /** Photo key resolved through the demo photo table. */
  photo: string;
  source?: LikeSource;
  superliked?: boolean;
}

export interface Match extends PersonSummary {
  matchedAt: number;
}

export interface ChatMessage {
  from: "me" | "them" | "system";
  text: string;
}

export interface CurrentUser {
  name: string;
  age?: number;
  gender: string;
  heightCm: number;
  location: string;
  bio: string;
  interests: string[];
  lookingFor: string;
  languages: string[];
  lifestyle: Record<LifestyleCategory, string>;
  bonus: ProfileBonus;
  prompts: ProfilePrompt[];
  photos: string[];
  plan: PlanId;
  superlikes: number;
  firstMessages: number;
}

export interface Plan {
  id: PlanId;
  name: string;
  label: string;
  headline: string;
  cta: string;
  superlikes: number;
  firstMessages: number;
  dailyLimit: number;
  /** Price per month by subscription length in months. */
  pricing?: Record<1 | 3 | 6, number>;
  perks: string[];
}

export type PurchaseType = "superlike" | "firstmessage";

export interface Filters {
  distance: number;
  showMe: string[];
  age: [number, number];
  interests: string[];
  languages: string[];
  height: [number, number];
  lookingFor: string[];
  lifestyle: Partial<Record<LifestyleCategory, string[]>>;
  personality: string[];
  zodiac: string[];
  children: string[];
}
