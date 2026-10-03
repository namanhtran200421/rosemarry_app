import { describe, expect, it } from "vitest";

import { EMPTY_PROFILE } from "../types/onboarding.types";
import { ageFromDateOfBirth, toBasicProfile } from "./basic-profile";

describe("basic profile mapping", () => {
  it("uses an exact birth date and converts selected profile fields", () => {
    expect(
      toBasicProfile({
        ...EMPTY_PROFILE,
        name: " Alex ",
        dateOfBirth: "2000-03-02",
        height: "5'8",
        lookingFor: "long",
        gender: "Woman",
      }),
    ).toEqual({
      displayName: "Alex",
      dateOfBirth: "2000-03-02",
      genderId: null,
      bio: null,
      datingGoal: "LONG_TERM_RELATIONSHIP",
      heightCm: 173,
    });
  });

  it("checks birthdays and invalid calendar dates", () => {
    const now = new Date("2026-10-03T00:00:00Z");
    expect(ageFromDateOfBirth("2008-10-03", now)).toBe(18);
    expect(ageFromDateOfBirth("2008-10-04", now)).toBe(17);
    expect(ageFromDateOfBirth("2008-02-30", now)).toBeNull();
  });
});
