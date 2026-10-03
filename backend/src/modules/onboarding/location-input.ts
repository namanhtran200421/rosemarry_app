import { AppError } from "../../shared/errors/app-error.js";
import type { LocationInput } from "./onboarding.types.js";

function invalid(message: string): never {
  throw new AppError({ statusCode: 400, code: "INVALID_LOCATION", message });
}

function requiredText(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 100)
    invalid(`${name} is required and must be 100 characters or less`);
  return value.trim();
}

function optionalText(
  value: unknown,
  name: string,
  maxLength: number,
): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > maxLength
  )
    invalid(`${name} must be ${maxLength} characters or less`);
  return value.trim();
}

export function parseLocationInput(
  body: Record<string, unknown>,
): LocationInput {
  return {
    city: requiredText(body.city, "City"),
    country: requiredText(body.country, "Country"),
    state: optionalText(body.state, "State or region", 100),
    postcode: optionalText(body.postcode, "Postal code", 20),
  };
}
