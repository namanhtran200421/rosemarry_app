import type { IconName } from "../../../shared/ui/Icon";
import type {
  LifestyleCategory,
  ProfilePrompt,
} from "../types/social.types";

/** Interest catalogue with the glyph shown on its chip. */
export const INTERESTS: [name: string, icon: IconName][] = [
  ["Photography", "Camera"],
  ["Shopping", "ShoppingBag"],
  ["Karaoke", "Mic"],
  ["Yoga", "Flower"],
  ["Cooking", "Coffee"],
  ["Tennis", "Racket"],
  ["Run", "Activity"],
  ["Swimming", "Waves"],
  ["Art", "Palette"],
  ["Travel", "Plane"],
  ["Extreme", "Gem"],
  ["Music", "Music"],
  ["Drink", "Wine"],
  ["Video games", "Gamepad"],
  ["Dancing", "Sparkles"],
  ["Modeling", "Star"],
  ["Pets", "Dog"],
  ["Reading", "Book"],
  ["Movies", "Film"],
  ["Cycling", "Bike"],
  ["Coffee", "Coffee"],
];

export function interestIcon(name: string): IconName {
  return INTERESTS.find(([label]) => label === name)?.[1] ?? "Sparkles";
}

// prettier-ignore
export const LOOKING_FOR: [title: string, subtitle: string, icon: IconName][] =
  [
    ["Long-term relationship", "Looking for something serious", "Heart"],
    ["Short-term relationship", "Something meaningful, but don't last", "Sparkles"],
    ["Casual dating", "Keeping it casual and fun", "Coffee"],
    ["New friends", "Looking to meet new connections", "User"],
    ["Not sure yet", "Figuring it out as I go", "Dots"],
  ];

export const LANGUAGES = [
  "English",
  "Vietnamese",
  "Mandarin",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Korean",
  "Portuguese",
  "Italian",
  "Hindi",
  "Arabic",
  "Russian",
  "Thai",
  "Dutch",
];

export const LIFESTYLE_OPTIONS = ["Often", "Sometimes", "Rarely", "No"];

export const LIFESTYLE_CATEGORIES: [LifestyleCategory, IconName][] = [
  ["Drinking", "GlassWater"],
  ["Smoking", "Cigarette"],
  ["Cannabis", "Leaf"],
  ["Workout", "Dumbbell"],
];

// prettier-ignore
export const MBTI = [
  "INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP",
];

// prettier-ignore
export const ZODIAC = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const CHILDREN = [
  "I want children",
  "I don't want children",
  "I have children",
  "Open to children",
  "Not sure yet",
];

export const GENDERS = ["Male", "Female", "Non-binary"];

export const MORE_GENDERS = [
  "Genderqueer",
  "Genderfluid",
  "Agender",
  "Bigender",
  "Two-spirit",
  "Transgender",
  "Intersex",
  "Prefer not to say",
];

export const EDUCATION = [
  "Adelaide University",
  "Northwestern University",
  "University of Chicago",
  "DePaul University",
  "University of Illinois",
  "Harvard University",
  "Stanford University",
  "MIT",
  "New York University",
  "University of California",
  "Columbia University",
  "Yale University",
];

export const HEIGHTS_CM = Array.from({ length: 71 }, (_, index) => 140 + index);

// prettier-ignore
export const PROMPT_POOL: ProfilePrompt[] = [
  { q: "A perfect first date is…", a: "Something spontaneous — a food market, a gallery, then wherever the night goes." },
  { q: "I get way too excited about…", a: "Live music, good coffee, and a well-planned trip." },
  { q: "The way to win me over is…", a: "Genuine curiosity and a terrible pun or two." },
  { q: "My simple pleasures are…", a: "Sunday mornings, vinyl records, and a slow breakfast." },
  { q: "I go crazy for…", a: "Spontaneous road trips and someone who can out-plan me." },
  { q: "My most controversial opinion is…", a: "Pineapple absolutely belongs on pizza." },
  { q: "You should go out with me if…", a: "You love trying new restaurants and hate small talk." },
  { q: "Two truths and a lie…", a: "I've run a marathon, I speak three languages, I hate dogs." },
];

export const ICEBREAKERS: Record<string, string> = {
  Music: "If you could only listen to one artist for a year, who would it be?",
  Dancing: "What song instantly makes you want to dance?",
  Modeling: "What's a look you've always wanted to try but haven't yet?",
  Photography: "What's the last photo you took that you're proud of?",
  Travel: "Where's the next place on your travel list?",
  Traveling: "Where's the next place on your travel list?",
  Yoga: "Sunrise flow or sunset flow — and why?",
  Cooking: "What's the one dish you'd cook to impress someone?",
  Coffee: "What does your usual coffee order say about you?",
  Art: "What was the last thing that left you creatively inspired?",
  Run: "Morning run or evening run — what clears your head?",
  Reading: "What book are you recommending to everyone right now?",
  Movies: "What's the comfort movie you've seen too many times?",
  Cycling: "What's the best route you've ever ridden?",
  Wine: "Red, white, or something surprising — what are we ordering?",
  Pets: "Introduce me to your pet — or the pet you dream of having.",
  Swimming: "Ocean, lake, or pool — where do you feel most at home?",
  Karaoke: "What's your go-to karaoke song, no shame?",
  Shopping: "What's the last thing you bought that you love?",
};

export const ICEBREAKER_FALLBACK =
  "If we planned a spontaneous day together tomorrow, what would we do?";

export const ICEBREAKER_REPLIES = [
  "Ooh good question — okay, honest answer:",
  "Love this one. For me it has to be",
  "Haha I've thought about this way too much:",
  "Okay you go first but mine is",
  "Easy — no contest,",
];
