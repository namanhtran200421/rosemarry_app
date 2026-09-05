import { describe, expect, it } from "vitest";

import { isValidPhoneNumber, normalizePhoneNumber } from "./phone-number";

describe("phone number helpers", () => {
  it.each([
    [" +61 (412) 345-678 ", "+61412345678"],
    ["0061 412 345 678", "+61412345678"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizePhoneNumber(input)).toBe(expected);
  });

  it.each(["+61412345678", "+14155552671"])(
    "accepts a practical E.164 number: %s",
    (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    },
  );

  it.each(["0412345678", "+012345678", "+61 412 345 678"])(
    "rejects a non-normalized number: %s",
    (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    },
  );
});
