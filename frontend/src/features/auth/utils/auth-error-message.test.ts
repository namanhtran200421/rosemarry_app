import { describe, expect, it } from "vitest";

// The error module also imports the API client. Mock mode keeps this unit test
// independent from developer-specific Auth0 and API environment variables.
process.env.EXPO_PUBLIC_AUTH_MODE = "mock";

const { getAuthenticationErrorMessage, isAuthenticationCancellation } =
  await import("./auth-error-message");
const { AccountCreatedSignInError } = await import("./auth-error-message");

describe("authentication error helpers", () => {
  it("treats Auth0 user cancellation as a normal close action", () => {
    expect(isAuthenticationCancellation({ type: "USER_CANCELLED" })).toBe(true);
    expect(isAuthenticationCancellation({ code: "USER_CANCELLED" })).toBe(true);
    expect(isAuthenticationCancellation(new Error("Network failed"))).toBe(
      false,
    );
  });

  it("returns a safe message for hosted sign-in failures", () => {
    expect(getAuthenticationErrorMessage("sign-in", new Error("secret"))).toBe(
      "We couldn't sign you in. Try again or choose another method.",
    );
  });

  it("gives a recovery path when account creation completed", () => {
    expect(
      getAuthenticationErrorMessage(
        "create-account",
        new AccountCreatedSignInError(),
      ),
    ).toBe("Your account was created. Switch to Log in and try again.");
  });
});
