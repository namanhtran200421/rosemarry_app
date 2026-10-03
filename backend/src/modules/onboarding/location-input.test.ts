import assert from "node:assert/strict";
import test from "node:test";

import { parseLocationInput } from "./location-input.js";

test("accepts city and country without coordinates", () => {
  assert.deepEqual(
    parseLocationInput({
      city: " Melbourne ",
      country: " Australia ",
      state: " Victoria ",
    }),
    {
      city: "Melbourne",
      country: "Australia",
      state: "Victoria",
      postcode: null,
    },
  );
});

test("requires a nonblank city and country", () => {
  assert.throws(
    () => parseLocationInput({ city: " ", country: "Australia" }),
    { code: "INVALID_LOCATION", statusCode: 400 },
  );
  assert.throws(
    () => parseLocationInput({ city: "Melbourne" }),
    { code: "INVALID_LOCATION", statusCode: 400 },
  );
});

test("limits optional location fields", () => {
  assert.throws(
    () =>
      parseLocationInput({
        city: "Melbourne",
        country: "Australia",
        postcode: "1".repeat(21),
      }),
    { code: "INVALID_LOCATION", statusCode: 400 },
  );
});
