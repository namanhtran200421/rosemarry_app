import { Router } from "express";

import {
  requireApplicationUser,
  validateAccessToken,
} from "../authentication/auth.middleware.js";
import { listCurrentCirclesHandler } from "./circles.controller.js";

const router = Router();

router.use(validateAccessToken, requireApplicationUser);

router.get("/current", listCurrentCirclesHandler);

export default router;