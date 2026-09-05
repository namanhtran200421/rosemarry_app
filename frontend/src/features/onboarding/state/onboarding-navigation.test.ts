import { describe, expect, it } from "vitest";

import {
  INITIAL_ONBOARDING_HISTORY,
  reduceOnboardingNavigation,
} from "./onboarding-navigation";

describe("reduceOnboardingNavigation", () => {
  it("advances through the numbered flow", () => {
    expect(
      reduceOnboardingNavigation(INITIAL_ONBOARDING_HISTORY, {
        type: "advance",
      }),
    ).toEqual(["name", "age"]);
  });

  it("records and leaves an explicit branch", () => {
    const branched = reduceOnboardingNavigation(["name", "age", "gender"], {
      type: "go-to",
      step: "genderMore",
    });

    expect(reduceOnboardingNavigation(branched, { type: "back" })).toEqual([
      "name",
      "age",
      "gender",
    ]);
  });

  it("does not navigate behind the first screen", () => {
    expect(
      reduceOnboardingNavigation(INITIAL_ONBOARDING_HISTORY, { type: "back" }),
    ).toBe(INITIAL_ONBOARDING_HISTORY);
  });

  it("stops advancing after the done screen", () => {
    const history = ["name", "done"] as const;

    expect(
      reduceOnboardingNavigation([...history], { type: "advance" }),
    ).toEqual(history);
  });
});
