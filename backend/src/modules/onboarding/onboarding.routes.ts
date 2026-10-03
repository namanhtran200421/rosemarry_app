// onboarding.routes.ts

import { Router } from "express";

import { validateAccessToken } from "../authentication/auth.middleware.js";

import {
  getOnboardingStateHandler,
  saveBasicProfileHandler,
} from "./onboarding.controller.js";

const router = Router();

/**
 * Get the user's current onboarding stage.
 */
router.get(
  "/state",
  validateAccessToken,
  getOnboardingStateHandler,
);

/**
 * Create or update the user's basic profile.
 */
router.put(
  "/profile",
  validateAccessToken,
  saveBasicProfileHandler,
);

export default router;