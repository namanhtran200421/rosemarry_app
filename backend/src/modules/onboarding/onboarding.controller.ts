import type { Request, RequestHandler } from "express";

import { AppError } from "../../shared/errors/app-error.js";

import { getOnboardingState, saveBasicProfile } from "./onboarding.service.js";

function readUserId(req: Request): number {
  if (req.user === undefined) {
    throw new AppError({
      statusCode: 401,
      code: "UNAUTHENTICATED",
      message: "Complete application sign in before accessing onboarding",
    });
  }

  return req.user.id;
}

/**
 * Get the current onboarding stage.
 */
export const getOnboardingStateHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const state = await getOnboardingState(readUserId(req));

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
    const state = await saveBasicProfile(readUserId(req), req.body);

    res.status(200).json(state);
  } catch (error: unknown) {
    next(error);
  }
};
