const E164_PHONE_NUMBER = /^\+[1-9]\d{7,14}$/;

/** Normalizes common international-number formatting before sending it to Auth0. */
export function normalizePhoneNumber(value: string): string {
  const trimmedValue = value.trim();
  const internationalValue = trimmedValue.startsWith("00")
    ? `+${trimmedValue.slice(2)}`
    : trimmedValue;

  if (!internationalValue.startsWith("+")) {
    return internationalValue;
  }

  return `+${internationalValue.slice(1).replace(/[\s()-]/g, "")}`;
}

/** Checks the normalized value against the practical E.164 number shape. */
export function isValidPhoneNumber(value: string): boolean {
  return E164_PHONE_NUMBER.test(value);
}
