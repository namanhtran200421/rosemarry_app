import type { Request, RequestHandler } from "express";

import { AppError } from "../../shared/errors/app-error.js";

import {
  completeOnboarding,
  getOnboardingState,
  getOnboardingSnapshot,
  listGenders,
  listInterests,
  listLifestyleQuestions,
  listOwnedMedia,
  listPrompts,
  saveBasicProfile,
  saveInterests,
  saveLifestyle,
  saveLocation,
  savePhotos,
  savePreferences,
  savePrompts,
} from "./onboarding.service.js";

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

export const getOnboardingSnapshotHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    res.status(200).json(await getOnboardingSnapshot(readUserId(req)));
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

function catalogHandler(load: () => Promise<unknown>): RequestHandler {
  return async (_req, res, next) => {
    try {
      res.status(200).json(await load());
    } catch (error: unknown) {
      next(error);
    }
  };
}

function stageHandler(
  save: (userId: number, input: unknown) => Promise<unknown>,
): RequestHandler {
  return async (req, res, next) => {
    try {
      res.status(200).json(await save(readUserId(req), req.body));
    } catch (error: unknown) {
      next(error);
    }
  };
}

export const listGendersHandler = catalogHandler(listGenders);
export const listInterestsHandler = catalogHandler(listInterests);
export const listLifestyleHandler = catalogHandler(listLifestyleQuestions);
export const listPromptsHandler = catalogHandler(listPrompts);

export const listOwnedMediaHandler: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json(await listOwnedMedia(readUserId(req)));
  } catch (error: unknown) {
    next(error);
  }
};

export const savePreferencesHandler = stageHandler(savePreferences);
export const saveInterestsHandler = stageHandler(saveInterests);
export const saveLifestyleHandler = stageHandler(saveLifestyle);
export const savePromptsHandler = stageHandler(savePrompts);
export const savePhotosHandler = stageHandler(savePhotos);
export const saveLocationHandler = stageHandler(saveLocation);

export const completeOnboardingHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    res.status(200).json(await completeOnboarding(readUserId(req)));
  } catch (error: unknown) {
    next(error);
  }
};
