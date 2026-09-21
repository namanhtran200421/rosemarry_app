import type { RequestHandler } from "express";

import { AppError } from "../../shared/errors/app-error.js";
import { listCurrentCircles } from "./circles.service.js";

export const listCurrentCirclesHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user?.id;

    if (userId === undefined) {
      throw new AppError({
        statusCode: 401,
        code: "UNAUTHENTICATED",
        message: "You must be signed in to view your Circles",
      });
    }

    const result = await listCurrentCircles(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};