import type { Profile } from "../types/social.types";

import { type DeckEntry, life } from "./deck-featured";

type Brief = [
  id: string,
  name: string,
  age: number,
  km: number,
  gender: string,
  heightCm: number,
  photo: string,
  location: string,
  bio: string,
  height: string,
  kids: string,
  interests: string[],
  lookingFor: string,
  languages: string[],
  lifestyle: Profile["lifestyle"],
  bonus: Profile["bonus"],
];

const WOMAN = "Woman";
const MAN = "Man";
const NB = "Non-binary";
const CHI = "Chicago, IL United States";
const SOCIAL = life("Socially", "None", "None", "Often");
const SOMETIMES = life("Socially", "None", "None", "Sometimes");

/** Single-photo demo profiles that fill out the rest of the deck. */
// prettier-ignore
const BRIEFS: Brief[] = [
  ["emelie", "Emelie Novak", 24, 3, "Female", 166, "emelie-1", CHI, "Bookshop regular, terrible at chess but I keep trying. Ask me about my sourdough starter.", "5' 5\"", "Open to kids", ["Reading", "Cooking", "Coffee", "Art", "Music"], "Long-term relationship", ["English", "Czech"], SOMETIMES, { personality: "INFJ", zodiac: "Cancer", education: "Loyola University", work: "Editor at Field Press" }],
  ["abigail", "Abigail Stone", 26, 6, "Female", 170, "abigail-1", "Oak Park, IL United States", "Runner, plant hoarder, and an unreasonably competitive trivia player.", "5' 7\"", "Want kids", ["Run", "Travel", "Cooking", "Music", "Dancing"], "Long-term relationship", ["English"], life("Socially", "None", "Socially", "Often"), { personality: "ESTJ", zodiac: "Taurus", education: "Michigan State", work: "Physiotherapist" }],
  ["olivia2", "Olivia Grant", 23, 2, "Female", 161, "olivia-1", CHI, "Camping over hotels, always. I collect trail maps and bad puns.", "5' 3\"", "Not sure yet", ["Travel", "Run", "Photography", "Coffee"], "Casual dating", ["English", "French"], SOCIAL, { personality: "ISTP", zodiac: "Sagittarius", education: "UIC", work: "Park ranger" }],
  ["chloe2", "Chloe Adeyemi", 27, 7, "Female", 174, "chloe-1", "Evanston, IL United States", "I plan every group trip. Coffee snob and proud. Sunrise summits are my love language.", "5' 9\"", "Open to kids", ["Travel", "Coffee", "Cooking", "Photography", "Art"], "Long-term relationship", ["English", "Yoruba"], SOMETIMES, { personality: "ENFJ", zodiac: "Libra", education: "Northwestern University", work: "Product manager" }],
  ["marcus", "Marcus Reyes", 24, 4, "Male", 180, "guy-2", CHI, "My pasta is legendary in at least one group chat. Always the early riser.", "5' 11\"", "Want kids", ["Cooking", "Run", "Travel", "Music"], "Long-term relationship", ["English", "Spanish"], SOCIAL, { personality: "ESFJ", zodiac: "Aries", education: "DePaul University", work: "Sous chef at Hearth" }],
  ["theo", "Theo Nakamura", 28, 5, "Male", 176, "guy-1", CHI, "Guitar in one hand, cold brew in the other. I write songs nobody has heard.", "5' 9\"", "Open to kids", ["Music", "Coffee", "Art", "Photography"], "Long-term relationship", ["English", "Japanese"], life("Socially", "None", "Socially", "Sometimes"), { personality: "INFP", zodiac: "Pisces", education: "Berklee", work: "Session musician" }],
  ["daniel", "Daniel Okonkwo", 30, 9, "Male", 186, "guy-3", CHI, "Weekend hiker, weekday spreadsheet wrangler. I will absolutely make you try my hot sauce.", "6' 1\"", "Want kids", ["Travel", "Cooking", "Run", "Music"], "Long-term relationship", ["English"], SOCIAL, { personality: "ENTP", zodiac: "Gemini", education: "Purdue University", work: "Data analyst" }],
  ["aaron", "Aaron Blake", 26, 3, "Male", 181, "guy-4", CHI, "Gym at 6am so I can eat pastries at 9am. Balance.", "5' 11\"", "Not sure yet", ["Run", "Cooking", "Music", "Travel"], "Casual dating", ["English"], SOCIAL, { personality: "ESTP", zodiac: "Leo", education: "Indiana University", work: "Personal trainer" }],
  ["nina", "Nina Petrova", 25, 4, "Female", 167, "soph-2", CHI, "Vinyl collector with three languages and zero sense of direction.", "5' 6\"", "Open to kids", ["Music", "Dancing", "Art", "Travel", "Coffee"], "Long-term relationship", ["English", "Russian", "German"], SOMETIMES, { personality: "ENFP", zodiac: "Aquarius", education: "Roosevelt University", work: "Music producer" }],
  ["priya", "Priya Raman", 28, 6, "Female", 160, "jess-3", "Skokie, IL United States", "Yoga at sunrise, ramen at midnight. I take my film camera everywhere.", "5' 3\"", "Want kids", ["Yoga", "Photography", "Cooking", "Travel"], "Long-term relationship", ["English", "Tamil"], life("None", "None", "None", "Often"), { personality: "ISFP", zodiac: "Virgo", education: "Northwestern University", work: "Architect" }],
  ["harper", "Harper Quinn", 29, 8, NB, 171, "riley-2", CHI, "Illustrator, gallery lurker, and defender of the 2pm nap.", "5' 7\"", "Open to kids", ["Art", "Photography", "Music", "Coffee", "Reading"], "Casual dating", ["English"], life("Socially", "None", "Socially", "Sometimes"), { personality: "INTP", zodiac: "Scorpio", education: "SAIC", work: "Illustrator" }],
  ["jonah", "Jonah Feld", 32, 10, "Male", 179, "noah-2", CHI, "I have been to 20+ countries and still cannot pack light.", "5' 10\"", "Open to kids", ["Travel", "Coffee", "Photography", "Cooking"], "Long-term relationship", ["English", "Hebrew"], SOMETIMES, { personality: "ENFJ", zodiac: "Capricorn", education: "Boston University", work: "Travel writer" }],
  ["zara", "Zara Haddad", 26, 5, "Female", 165, "soph-3", CHI, "First on the dance floor, last to leave the dinner table.", "5' 5\"", "Want kids", ["Dancing", "Cooking", "Music", "Travel", "Art"], "Long-term relationship", ["English", "Arabic", "French"], life("None", "None", "None", "Often"), { personality: "ESFP", zodiac: "Sagittarius", education: "UIC", work: "Dentist" }],
  ["ellis", "Ellis Moreau", 27, 7, NB, 175, "riley-3", "Evanston, IL United States", "Making a documentary nobody asked for. Ask me about lighthouses.", "5' 9\"", "Not sure yet", ["Photography", "Art", "Travel", "Reading"], "Casual dating", ["English", "French"], life("Socially", "None", "Socially", "Sometimes"), { personality: "INFJ", zodiac: "Aquarius", education: "Columbia College", work: "Documentary filmmaker" }],
  ["cameron", "Cameron Ives", 31, 9, "Male", 184, "liam-2", CHI, "Rock climbing, board games, and an ongoing feud with my neighbour’s cat.", "6' 0\"", "Want kids", ["Run", "Travel", "Music", "Cooking"], "Long-term relationship", ["English"], SOCIAL, { personality: "ISTJ", zodiac: "Taurus", education: "Illinois Tech", work: "Structural engineer" }],
  ["talia", "Talia Brooks", 24, 2, "Female", 158, "maya-2", CHI, "Golden hour enthusiast with a cat named Miso and a very long travel list.", "5' 2\"", "Open to kids", ["Photography", "Yoga", "Coffee", "Travel", "Art"], "Long-term relationship", ["English"], SOMETIMES, { personality: "ISFJ", zodiac: "Cancer", education: "DePaul University", work: "Photographer" }],
];

export const MORE_PROFILES: DeckEntry[] = BRIEFS.map(
  ([id, name, age, km, gender, heightCm, photo, location, bio, height, kids, interests, lookingFor, languages, lifestyle, bonus]) => ({
    id,
    name,
    age,
    distance: `${km} km`,
    gender,
    heightCm,
    photos: [photo],
    location,
    bio,
    aboutMe: [
      [height, "height"],
      [gender === "Male" ? MAN : gender === "Female" ? WOMAN : NB, "gender"],
      [kids, "kids"],
    ],
    interests,
    lookingFor,
    languages,
    lifestyle,
    bonus,
  }),
);
