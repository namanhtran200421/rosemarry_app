import { describe, expect, it } from "vitest";

import { DEFAULT_FILTERS } from "../data/plans";
import { DEMO_USER } from "../data/people";

import {
  cmToFeet,
  DECK,
  feetToCm,
  fillProfile,
  icebreakerFor,
  matchesFilters,
  matchTimeLeft,
  profileCompletion,
} from "./profile-utils";

const HOUR = 3600 * 1000;

describe("height conversion", () => {
  it("formats centimetres as feet and inches", () => {
    expect(cmToFeet(173)).toBe(`5'8"`);
  });

  it("reads the onboarding wheel value", () => {
    expect(feetToCm("5'8")).toBe(173);
  });
});

describe("profileCompletion", () => {
  it("counts filled fields only", () => {
    const base = profileCompletion(DEMO_USER);
    const withBio = profileCompletion({ ...DEMO_USER, bio: "Hello" });

    expect(withBio).toBeGreaterThan(base);
    expect(profileCompletion(DEMO_USER)).toBeLessThan(100);
  });
});

describe("matchesFilters", () => {
  const jessica = DECK.find((profile) => profile.id === "jessica")!;

  it("passes with default filters", () => {
    expect(matchesFilters(jessica, DEFAULT_FILTERS, "free")).toBe(true);
  });

  it("rejects profiles outside the distance", () => {
    const noah = DECK.find((profile) => profile.id === "noah")!;
    expect(matchesFilters(noah, { ...DEFAULT_FILTERS, distance: 5 }, "free")).toBe(
      false,
    );
  });

  it("ignores advanced criteria on the free plan", () => {
    const filters = { ...DEFAULT_FILTERS, zodiac: ["Aries"] };

    expect(matchesFilters(jessica, filters, "free")).toBe(true);
    expect(matchesFilters(jessica, filters, "advanced")).toBe(false);
  });
});

describe("fillProfile", () => {
  it("returns the deck profile when the id is known", () => {
    expect(fillProfile({ id: "liam", name: "Liam", photo: "liam-1" }).bio).toContain(
      "rock-climbs",
    );
  });

  it("is deterministic for unknown people", () => {
    const person = { id: "l1", name: "Double H", photo: "guy-1" };
    expect(fillProfile(person)).toEqual(fillProfile(person));
  });
});

describe("icebreakerFor", () => {
  it("prefers a mutual interest", () => {
    expect(icebreakerFor("m1", ["Music", "Chess"], ["music"]).interest).toBe(
      "Music",
    );
  });

  it("falls back when nothing is shared", () => {
    expect(icebreakerFor("m1", ["Chess"], ["Music"]).interest).toBeNull();
  });
});

describe("matchTimeLeft", () => {
  it("counts down hours and flags the last six", () => {
    const now = 1_000_000_000;
    expect(matchTimeLeft(now - 3 * HOUR, now)).toMatchObject({
      label: "45h left",
      urgent: false,
    });
    expect(matchTimeLeft(now - 46.5 * HOUR, now)).toMatchObject({
      label: "1h left",
      urgent: true,
    });
    expect(matchTimeLeft(now - 49 * HOUR, now).expired).toBe(true);
  });
});
