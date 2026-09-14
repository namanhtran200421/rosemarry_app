import { describe, expect, it } from "vitest";

import type { ApplicationSession } from "../api/auth-api";
import { markOnboardingCompleted } from "./auth-session-state";

const SESSION: ApplicationSession = {
  userId: 27,
  role: "USER",
  onboardingCompleted: false,
};

describe("markOnboardingCompleted", () => {
  it("keeps the signed-in user and marks onboarding complete", () => {
    expect(markOnboardingCompleted(SESSION)).toEqual({
      ...SESSION,
      onboardingCompleted: true,
    });
  });

  it("does not create a session for a signed-out user", () => {
    expect(markOnboardingCompleted(null)).toBeNull();
  });
});
