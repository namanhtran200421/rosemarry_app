import assert from "node:assert/strict";
import { test } from "node:test";

import { furthestStage, requireStageReached } from "./onboarding.stage.js";

test("later stages cannot be reached before prior stages", () => {
  assert.throws(() => requireStageReached("PREFERENCES", "LIFESTYLE"), {
    code: "ONBOARDING_STAGE_NOT_REACHED",
    statusCode: 409,
  });
});

test("editing an earlier answer keeps the later stage", () => {
  assert.equal(furthestStage("PHOTOS", "INTERESTS"), "PHOTOS");
  assert.equal(furthestStage("PREFERENCES", "INTERESTS"), "INTERESTS");
});
