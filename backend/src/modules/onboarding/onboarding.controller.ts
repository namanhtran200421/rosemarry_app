import type { RequestHandler } from "express";

import { readAuthenticatedSubject } from "../authentication/auth.middleware.js";

import {
  getOnboardingState,
  saveBasicProfile,
} from "./onboarding.service.js";

/**
 * Get the current onboarding stage.
 */
export const getOnboardingStateHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    // Get the authenticated Auth0 user ID.
    const providerUserId =
      readAuthenticatedSubject(req);

    // Ask the service for the current onboarding state.
    const state =
      await getOnboardingState(providerUserId);

    res.status(200).json(state);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Create or update the user's basic profile.
 */
export const saveBasicProfileHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    // Get the authenticated Auth0 user ID.
    const providerUserId =
      readAuthenticatedSubject(req);

    // Service handles validation, create/update,
    // and onboarding progression.
    const state =
      await saveBasicProfile(
        providerUserId,
        req.body,
      );

    res.status(200).json(state);
  } catch (error: unknown) {
    next(error);
  }
};