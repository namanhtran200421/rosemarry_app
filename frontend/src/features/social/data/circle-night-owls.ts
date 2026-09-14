import type { Circle, CircleMessage } from "../types/circle.types";

export const toMessages = (rows: [from: string, text: string][]): CircleMessage[] =>
  rows.map(([from, text]) => ({ from, text }));

const FLIRTY_Q =
  "What’s something small someone could do that would instantly make you like them more?";

export const NIGHT_OWLS: Circle = {
  id: "c1",
  name: "The Night Owls",
  theme: "Music, travel & late-night talks",
  matchedOn: ["Music", "Travel", "Photography"],
  refreshDays: 1,
  todayIndex: 5,
  hoursToNext: 0,
  unread: 3,
  settings: { notifications: true, muted: false },
  // prettier-ignore
  members: [
    { id: "sophia", name: "Sophia", age: 25, photo: "soph-1" },
    { id: "liam", name: "Liam", age: 29, photo: "liam-1" },
    { id: "maya", name: "Maya", age: 27, photo: "maya-1" },
    { id: "noah", name: "Noah", age: 34, photo: "noah-1" },
    { id: "riley", name: "Riley", age: 31, photo: "riley-1" },
    { id: "jessica", name: "Jessica", age: 23, photo: "jess-1" },
    { id: "olivia", name: "Olivia", age: 23, photo: "olivia-1" },
    { id: "chloe", name: "Chloe", age: 27, photo: "chloe-1" },
    { id: "marcus", name: "Marcus", age: 24, photo: "guy-2" },
  ],
  // prettier-ignore
  activities: [
    { id: "a1", day: 0, icon: "Sparkles", title: "Music trivia", type: "trivia", prompt: "Trivia on the circle’s shared love — music. How many can you get?", done: false, count: 6,
      game: { topic: "Music", questions: [
        { q: "Which instrument has 88 keys?", options: ["Guitar", "Piano", "Violin", "Harp"], answer: 1 },
        { q: "“Bohemian Rhapsody” was released by which band?", options: ["Queen", "The Beatles", "ABBA", "Oasis"], answer: 0 },
        { q: "How many strings does a standard guitar have?", options: ["Four", "Five", "Six", "Seven"], answer: 2 },
      ] } },
    { id: "a2", day: 1, icon: "Sliders", title: "This or that", type: "thisorthat", prompt: "Vote between two options until one winner is left.", done: false, count: 6,
      game: { options: ["Beach getaway", "Mountain escape", "City break", "Road trip"] } },
    { id: "a3", day: 2, icon: "Users", title: "Guess who?", type: "guesswho", prompt: "Three clues, one member. Can you guess who?", done: false, count: 5,
      game: { rounds: [
        { memberId: "maya", clues: ["I never miss golden hour with my camera 📸", "I have a cat named Miso", "Japan is top of my travel list"] },
        { memberId: "noah", clues: ["I run every morning before work", "I pull a mean espresso", "I’ve been to 20+ countries"] },
        { memberId: "sophia", clues: ["I’m always first on the dance floor", "I collect vinyl records", "I speak three languages"] },
      ] } },
    { id: "a4", day: 3, icon: "Heart", title: "Matching answers", type: "matching", prompt: "Answer a few scenarios, then see who you line up with.", done: false, count: 5,
      game: { questions: [
        { q: "You’ve got a free Saturday. Ideal plan?", options: ["Stay home together", "Go somewhere to eat", "Somewhere outdoors", "Out with friends"] },
        { q: "Pick a first-date vibe", options: ["Coffee & a walk", "Fancy dinner", "Live music", "Cooking together"] },
        { q: "Dream trip right now?", options: ["Beach", "Big city", "Mountains", "Road trip"] },
      ], memberAnswers: { sophia: [3, 2, 1], liam: [1, 0, 3], maya: [2, 3, 2], noah: [2, 0, 2], riley: [0, 2, 3] } } },
    { id: "a5", day: 4, icon: "Sparkles", title: "Pick for someone", type: "pickfor", prompt: "Choose something for another member — they can rate it later.", done: false, count: 4,
      game: { tasks: [
        { forMemberId: "maya", prompt: "Choose {name}’s perfect first-date food", options: ["Sushi", "Tacos", "Ramen", "Wood-fired pizza"] },
        { forMemberId: "noah", prompt: "Pick a movie {name} would enjoy", options: ["Inception", "La La Land", "Interstellar", "Grand Budapest Hotel"] },
        { forMemberId: "sophia", prompt: "Choose a holiday {name} would love", options: ["Tokyo", "Lisbon", "Bali", "Reykjavík"] },
      ] } },
    { id: "a6", day: 5, icon: "Wine", title: "Flirty prompt", type: "flirty", prompt: "A romantic prompt — answer any time, reply to others.", done: false, count: 4,
      game: { prompt: FLIRTY_Q, answers: [
        { id: "af1", memberId: "liam", text: "Remember the tiny things I mention in passing." },
        { id: "af2", memberId: "maya", text: "Send me a song that reminded them of me 🎶" },
        { id: "af3", memberId: "noah", text: "Actually be on time 😌" },
      ] } },
  ],
  // prettier-ignore
  messages: toMessages([
    ["system", "Your circle formed on Tuesday — say hi! 🎉"],
    ["sophia", "Hey everyone! Night Owls, let’s goooo 🦉"],
    ["liam", "Evening crew reporting in 🌙"],
    ["system", "Sophia completed “Music trivia”"],
    ["sophia", "Scored 3/3 on the music trivia, no big deal 😎"],
    ["system", "Maya completed “Music trivia”"],
    ["maya", "2/3 for me — the guitar strings one got me lol"],
    ["noah", "Got 3/3 too 🎸 easy when it’s music"],
    ["system", "Liam completed “This or that”"],
    ["liam", "Voted! The circle crowned “Mountain escape” ⛰️"],
    ["riley", "Called it. Mountains > everything"],
    ["sophia", "Beach supremacy was robbed 😤"],
    ["system", "Maya completed “Guess who?”"],
    ["maya", "Guessed 3/3 — I know you all too well 🕵️"],
    ["noah", "The cat clue gave you away instantly Maya 🐱"],
    ["system", "Noah completed “Matching answers”"],
    ["noah", "Apparently Riley and I are 3/3 on weekend plans 👀"],
    ["riley", "Outdoors gang 🏞️"],
    ["system", "Liam completed “Flirty prompt”"],
    ["liam", `${FLIRTY_Q}\n“Remember the tiny things I mention in passing.”`],
    ["maya", "okay Liam’s answer was actually kind of sweet 🥹"],
    ["system", "Noah completed “Flirty prompt”"],
    ["noah", `${FLIRTY_Q}\n“Actually be on time 😌”`],
    ["liam", "Noah calling us all out 😂"],
    ["sophia", "Last day already! This circle’s been a good one 💫 come play the rest before it resets"],
  ]),
};
