import { describe, expect, it } from "vitest";

import { resolveVerificationPhase } from "./verification-state";

describe("resolveVerificationPhase", () => {
  it("lets a previously verified user continue", () => {
    expect(
      resolveVerificationPhase({ ageVerified: true, status: "REJECTED" }),
    ).toBe("approved");
  });

  it("keeps manual review separate from retryable outcomes", () => {
    expect(
      resolveVerificationPhase({ ageVerified: false, status: "IN_REVIEW" }),
    ).toBe("inReview");
    expect(
      resolveVerificationPhase({ ageVerified: false, status: "EXPIRED" }),
    ).toBe("retryable");
  });

  it("offers the first verification to a new user", () => {
    expect(resolveVerificationPhase({ ageVerified: false, status: null })).toBe(
      "idle",
    );
  });
});
