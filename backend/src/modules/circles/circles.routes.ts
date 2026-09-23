import { Router } from "express";

import {
  requireApplicationUser,
  validateAccessToken,
} from "../authentication/auth.middleware.js";
import {
  getCircleHandler,
  getCircleMemberHandler,
  listCircleMessagesHandler,
  listCurrentCirclesHandler,
  markCircleReadHandler,
  sendCircleMessageHandler,
} from "./circles.controller.js";

const router = Router();

router.use(validateAccessToken, requireApplicationUser);

router.get("/current", listCurrentCirclesHandler);
router.get("/:cycleId/members/:memberUserId", getCircleMemberHandler);
router.get("/:cycleId/messages", listCircleMessagesHandler);
router.post("/:cycleId/messages", sendCircleMessageHandler);
router.patch("/:cycleId/read", markCircleReadHandler);
router.get("/:cycleId", getCircleHandler);

export default router;
