import type { Circle } from "../types/circle.types";

import { toMessages } from "./circle-night-owls";

const FLIRTY_Q = "What kind of first date would actually impress you?";

/** Second weekly circle, unlocked on the Advanced plan. */
export const TRAILBLAZERS: Circle = {
  id: "c2",
  name: "The Trailblazers",
  theme: "Hiking, cooking & weekend adventures",
  matchedOn: ["Travel", "Cooking", "Run"],
  refreshDays: 1,
  todayIndex: 5,
  hoursToNext: 0,
  unread: 1,
  settings: { notifications: true, muted: false },
  // prettier-ignore
  members: [
    { id: "olivia", name: "Olivia", age: 23, photo: "olivia-1" },
    { id: "marcus", name: "Marcus", age: 24, photo: "guy-2" },
    { id: "chloe", name: "Chloe", age: 27, photo: "chloe-1" },
    { id: "noah", name: "Noah", age: 34, photo: "noah-1" },
    { id: "jessica", name: "Jessica", age: 23, photo: "jess-1" },
  ],
  // prettier-ignore
  activities: [
    { id: "b1", day: 0, icon: "Sparkles", title: "Cooking trivia", type: "trivia", prompt: "Trivia on the circle’s shared love — cooking. How many can you get?", done: false, count: 4,
      game: { topic: "Cooking", questions: [
        { q: "What does “mise en place” mean?", options: ["Everything in its place", "Cook on high heat", "A French dessert", "Set the table"], answer: 0 },
        { q: "Which herb is the key to pesto?", options: ["Basil", "Mint", "Parsley", "Dill"], answer: 0 },
        { q: "At sea level, water boils at…", options: ["90°C", "100°C", "110°C", "120°C"], answer: 1 },
      ] } },
    { id: "b2", day: 1, icon: "Sliders", title: "This or that", type: "thisorthat", prompt: "Vote between two options until one winner is left.", done: false, count: 4,
      game: { options: ["Sushi", "Pizza", "Tacos", "Ramen"] } },
    { id: "b3", day: 2, icon: "Users", title: "Guess who?", type: "guesswho", prompt: "Three clues, one member. Can you guess who?", done: false, count: 4,
      game: { rounds: [
        { memberId: "marcus", clues: ["I could hike every single weekend", "My pasta is legendary around here", "Always the early riser"] },
        { memberId: "chloe", clues: ["I plan every group trip", "I live for a sunrise summit", "Coffee snob and proud"] },
        { memberId: "olivia", clues: ["I’ve run a half-marathon", "I collect trail maps", "Camping over hotels, always"] },
      ] } },
    { id: "b4", day: 3, icon: "Heart", title: "Matching answers", type: "matching", prompt: "Answer a few scenarios, then see who you line up with.", done: false, count: 3,
      game: { questions: [
        { q: "You’ve got a free Saturday. Ideal plan?", options: ["Stay in & cook", "Eat out", "Big hike", "Friends over"] },
        { q: "Trip style?", options: ["Camping", "Road trip", "City food tour", "Beach"] },
        { q: "Morning fuel?", options: ["Espresso", "Green smoothie", "Big breakfast", "Just water"] },
      ], memberAnswers: { olivia: [2, 0, 1], marcus: [0, 1, 0], chloe: [2, 1, 0], noah: [2, 3, 0], jessica: [1, 2, 3] } } },
    { id: "b5", day: 4, icon: "Sparkles", title: "Pick for someone", type: "pickfor", prompt: "Choose something for another member — they can rate it later.", done: false, count: 3,
      game: { tasks: [
        { forMemberId: "marcus", prompt: "Choose {name}’s perfect trail snack", options: ["Trail mix", "Energy bar", "Fresh fruit", "Beef jerky"] },
        { forMemberId: "chloe", prompt: "Pick a destination {name} would love", options: ["Patagonia", "Kyoto", "Amalfi Coast", "Banff"] },
        { forMemberId: "olivia", prompt: "Choose a dish {name} would enjoy", options: ["Ramen", "Poke bowl", "Wood-fired pizza", "Thai curry"] },
      ] } },
    { id: "b6", day: 5, icon: "Wine", title: "Flirty prompt", type: "flirty", prompt: "A romantic prompt — answer any time, reply to others.", done: false, count: 3,
      game: { prompt: FLIRTY_Q, answers: [
        { id: "bf1", memberId: "marcus", text: "A sunrise hike, then breakfast tacos." },
        { id: "bf2", memberId: "chloe", text: "Cooking something together, no reservations." },
        { id: "bf3", memberId: "olivia", text: "A spontaneous drive with a great playlist." },
      ] } },
  ],
  // prettier-ignore
  messages: toMessages([
    ["system", "Your circle formed on Tuesday — say hi! 🎉"],
    ["chloe", "Trailblazers! Who’s ready for a big week 🥾"],
    ["marcus", "Born ready. Also already hungry."],
    ["system", "Chloe completed “Cooking trivia”"],
    ["chloe", "3/3 on cooking trivia 👩‍🍳 the pesto one was too easy"],
    ["system", "Marcus completed “Cooking trivia”"],
    ["marcus", "Got the boiling point one wrong somehow 😅 2/3"],
    ["system", "Olivia completed “This or that”"],
    ["olivia", "Voted — the circle picked “Ramen” 🍜"],
    ["jessica", "Ramen over pizza?? bold but I respect it"],
    ["system", "Marcus completed “Guess who?”"],
    ["marcus", "The “legendary pasta” clue was obviously me 🍝 3/3"],
    ["chloe", "lmao subtle Marcus"],
    ["system", "Noah completed “Matching answers”"],
    ["noah", "Chloe and I matched 3/3 on trip style — camping crew 🏕️"],
    ["system", "Marcus completed “Flirty prompt”"],
    ["marcus", `${FLIRTY_Q}\n“A sunrise hike, then breakfast tacos.”`],
    ["system", "Chloe completed “Flirty prompt”"],
    ["chloe", `${FLIRTY_Q}\n“Cooking something together, no reservations.”`],
    ["jessica", "both of these are dangerously good answers 👀"],
    ["chloe", "Last day! Get the rest done before we reset 💫"],
  ]),
};
