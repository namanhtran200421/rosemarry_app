import type { RequestHandler } from "express";

import { AppError } from "../../shared/errors/app-error.js";
import {
  getCircleForUser,
  getCircleMemberProfile,
  listCircleMessages,
  listCurrentCircles,
  markCircleRead,
  sendCircleMessage,
} from "./circles.service.js";

const DEFAULT_MESSAGE_LIMIT = 30;
const MAX_MESSAGE_LIMIT = 50;

function readUserId(req: Parameters<RequestHandler>[0]): number {
  const userId = req.user?.id;

  if (userId === undefined) {
    throw new AppError({
      statusCode: 401,
      code: "UNAUTHENTICATED",
      message: "You must be signed in to access Circles",
    });
  }

  return userId;
}

function parsePositiveInteger(value: unknown, fieldName: string): number {
  const parsed = typeof value === "string" ? Number(value) : Number.NaN;

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new AppError({
      statusCode: 400,
      code: "INVALID_ROUTE_PARAMETER",
      message: `${fieldName} must be a positive integer`,
    });
  }

  return parsed;
}

function parseMessageLimit(value: unknown): number {
  if (value === undefined) {
    return DEFAULT_MESSAGE_LIMIT;
  }

  const limit = parsePositiveInteger(value, "limit");

  if (limit > MAX_MESSAGE_LIMIT) {
    throw new AppError({
      statusCode: 400,
      code: "INVALID_MESSAGE_LIMIT",
      message: `limit cannot be greater than ${MAX_MESSAGE_LIMIT}`,
    });
  }

  return limit;
}

function parseMessageId(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw new AppError({
      statusCode: 400,
      code: "INVALID_MESSAGE_ID",
      message: `${fieldName} must be a positive message ID`,
    });
  }

  return value;
}

export const listCurrentCirclesHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = readUserId(req);

    const result = await listCurrentCircles(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCircleHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = readUserId(req);
    const cycleId = parsePositiveInteger(req.params.cycleId, "cycleId");
    const circle = await getCircleForUser(cycleId, userId);

    res.status(200).json({ circle });
  } catch (error) {
    next(error);
  }
};

export const getCircleMemberHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = readUserId(req);
    const cycleId = parsePositiveInteger(req.params.cycleId, "cycleId");
    const memberUserId = parsePositiveInteger(
      req.params.memberUserId,
      "memberUserId",
    );
    const member = await getCircleMemberProfile(
      cycleId,
      memberUserId,
      userId,
    );

    res.status(200).json({ member });
  } catch (error) {
    next(error);
  }
};

export const listCircleMessagesHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = readUserId(req);
    const cycleId = parsePositiveInteger(req.params.cycleId, "cycleId");
    const limit = parseMessageLimit(req.query.limit);
    const before =
      req.query.before === undefined
        ? undefined
        : parseMessageId(req.query.before, "before");
    const page = await listCircleMessages(cycleId, userId, {
      limit,
      ...(before !== undefined && { before }),
    });

    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

export const sendCircleMessageHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = readUserId(req);
    const cycleId = parsePositiveInteger(req.params.cycleId, "cycleId");
    const body =
      typeof req.body === "object" &&
      req.body !== null &&
      "body" in req.body &&
      typeof req.body.body === "string"
        ? req.body.body
        : undefined;

    if (body === undefined) {
      throw new AppError({
        statusCode: 400,
        code: "INVALID_MESSAGE_BODY",
        message: "body must be a string",
      });
    }

    const message = await sendCircleMessage(cycleId, userId, body);

    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

export const markCircleReadHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = readUserId(req);
    const cycleId = parsePositiveInteger(req.params.cycleId, "cycleId");
    const lastReadMessageId =
      typeof req.body === "object" && req.body !== null
        ? parseMessageId(req.body.lastReadMessageId, "lastReadMessageId")
        : parseMessageId(undefined, "lastReadMessageId");

    await markCircleRead(cycleId, userId, lastReadMessageId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
