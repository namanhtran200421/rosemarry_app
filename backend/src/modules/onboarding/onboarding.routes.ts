// onboarding.routes.ts

import { Router } from "express";

import {
  requireApplicationUser,
  validateAccessToken,
} from "../authentication/auth.middleware.js";

import {
  completeOnboardingHandler,
  getOnboardingStateHandler,
  getOnboardingSnapshotHandler,
  listGendersHandler,
  listInterestsHandler,
  listLifestyleHandler,
  listOwnedMediaHandler,
  listPromptsHandler,
  saveBasicProfileHandler,
  saveInterestsHandler,
  saveLifestyleHandler,
  saveLocationHandler,
  savePhotosHandler,
  savePreferencesHandler,
  savePromptsHandler,
} from "./onboarding.controller.js";
import { receivePhoto, uploadPhoto } from "./media-upload.js";

const router = Router();

router.use(validateAccessToken, requireApplicationUser);

/**
 * Get the user's current onboarding stage.
 */
router.get("/state", getOnboardingStateHandler);
router.get("/snapshot", getOnboardingSnapshotHandler);

/**
 * Create or update the user's basic profile.
 */
router.put("/profile", saveBasicProfileHandler);

router.get("/genders", listGendersHandler);
router.get("/interests", listInterestsHandler);
router.get("/lifestyle", listLifestyleHandler);
router.get("/prompts", listPromptsHandler);
router.get("/media", listOwnedMediaHandler);
router.post("/media", receivePhoto, uploadPhoto);

router.put("/preferences", savePreferencesHandler);
router.put("/interests", saveInterestsHandler);
router.put("/lifestyle", saveLifestyleHandler);
router.put("/prompts", savePromptsHandler);
router.put("/photos", savePhotosHandler);
router.put("/location", saveLocationHandler);
router.post("/complete", completeOnboardingHandler);

export default router;
