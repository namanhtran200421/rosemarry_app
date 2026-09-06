import { describe, expect, it } from "vitest";

import { normalizeEmail, validateEmailCredentials } from "./email-credentials";

describe("email credential validation", () => {
  it("trims accidental spaces from an email address", () => {
    expect(normalizeEmail("  person@example.com  ")).toBe("person@example.com");
  });

  it("requires a valid email and password for login", () => {
    expect(
      validateEmailCredentials("login", {
        email: "not-an-email",
        password: "",
        confirmPassword: "",
      }),
    ).toEqual({
      email: "Enter a valid email address, such as name@example.com.",
      password: "Enter your password.",
    });
  });

  it("allows an existing short password during login", () => {
    expect(
      validateEmailCredentials("login", {
        email: "person@example.com",
        password: "old",
        confirmPassword: "",
      }),
    ).toEqual({});
  });

  it("requires a longer matching password when creating an account", () => {
    expect(
      validateEmailCredentials("create", {
        email: "person@example.com",
        password: "short",
        confirmPassword: "different",
      }),
    ).toEqual({
      password: "Use at least 15 characters for your password.",
      confirmPassword: "The passwords do not match. Try again.",
    });
  });

  it("accepts a matching password that meets the Auth0 minimum", () => {
    expect(
      validateEmailCredentials("create", {
        email: "person@example.com",
        password: "fifteen-letters!",
        confirmPassword: "fifteen-letters!",
      }),
    ).toEqual({});
  });
});
