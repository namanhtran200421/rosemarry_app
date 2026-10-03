import { Router } from "express";

import { validateAccessToken } from "./auth.middleware.js";
import { createSessionHandler } from "./auth.controller.js";

const router = Router();

/**
 * Validates the access token first,
 * then passes control to the controller.
 */
router.post(
  "/session",
  validateAccessToken,
  createSessionHandler
);

export default router;