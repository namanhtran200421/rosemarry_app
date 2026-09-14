import type { IconName } from "../../../shared/ui/Icon";
import type {
  Filters,
  Plan,
  PurchaseType,
} from "../types/social.types";

export const PLANS: Plan[] = [
  {
    id: "free",
    label: "Free",
    name: "Free",
    headline: "Start swiping and see where it goes.",
    cta: "Current plan",
    superlikes: 1,
    firstMessages: 3,
    dailyLimit: 10,
    perks: [
      "Weekly Circles",
      "Circle chat & activities",
      "Matching & messaging",
      "Basic filters",
      "10 Discover profiles daily",
      "3 rewinds a week",
      "1 Super Like a week",
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    name: "Advanced",
    headline: "Get more visibility and start more conversations.",
    cta: "Choose Advanced",
    superlikes: 10,
    firstMessages: 5,
    dailyLimit: 20,
    pricing: { 1: 20, 3: 15, 6: 12 },
    perks: [
      "Everything in Free",
      "See who likes you",
      "Circle history",
      "Join a second Circle",
      "20 Discover profiles daily",
      "Advanced filters",
      "Unlimited rewinds",
      "3 First Messages a week",
      "3 Super Likes a week",
    ],
  },
];

export function findPlan(id: string): Plan {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[0];
}

export const SUBSCRIPTION_TERMS = [
  { months: 1, label: "1 month" },
  { months: 3, label: "3 months" },
  { months: 6, label: "6 months" },
] as const;

export interface PurchasePack {
  id: string;
  qty: number;
  label: string;
  price: number;
  save?: string;
}

export const PURCHASE_OPTIONS: Record<
  PurchaseType,
  { label: string; icon: IconName; description: string; packs: PurchasePack[] }
> = {
  superlike: {
    label: "Superlikes",
    icon: "Star",
    description:
      "Stand out — Superlikes get 3× more attention and let someone know you really like them.",
    packs: [
      { id: "sl-1", qty: 1, label: "1 Superlike", price: 0.99 },
      { id: "sl-5", qty: 5, label: "5 Superlikes", price: 3.99, save: "Save 19%" },
      { id: "sl-10", qty: 10, label: "10 Superlikes", price: 6.99, save: "Save 29%" },
    ],
  },
  firstmessage: {
    label: "First Messages",
    icon: "Send",
    description:
      "Skip the wait — send a message before you match and start the conversation on your terms.",
    packs: [
      { id: "fm-3", qty: 3, label: "3 First Messages", price: 1.49 },
      { id: "fm-10", qty: 10, label: "10 First Messages", price: 3.99, save: "Save 20%" },
      { id: "fm-25", qty: 25, label: "25 First Messages", price: 7.99, save: "Save 36%" },
    ],
  },
};

export const DEFAULT_FILTERS: Filters = {
  distance: 50,
  showMe: [],
  age: [18, 45],
  interests: [],
  languages: [],
  height: [155, 195],
  lookingFor: [],
  lifestyle: {},
  personality: [],
  zodiac: [],
  children: [],
};

/** Matches expire 48 hours after matching unless someone sends a message. */
export const MATCH_TTL_MS = 48 * 3600 * 1000;
