import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type { RequestHandler } from "express";
import { fileTypeFromBuffer } from "file-type";
import multer from "multer";

import { AppError } from "../../shared/errors/app-error.js";
import { addOwnedMedia } from "./onboarding.repository.js";

export const mediaUploadDir = path.resolve(
  __dirname,
  "../../../uploads",
);

const extensionByMime = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});

export const receivePhoto: RequestHandler = (req, res, next) => {
  upload.single("photo")(req, res, (error: unknown) => {
    if (error) {
      next(
        new AppError({
          statusCode: 400,
          code: "INVALID_PHOTO",
          message: "Choose one photo smaller than 8 MB.",
        }),
      );
      return;
    }
    next();
  });
};

export const uploadPhoto: RequestHandler = async (req, res, next) => {
  let filePath: string | undefined;
  let fileWritten = false;
  try {
    const userId = req.user?.id;
    const host = req.get("host");
    if (userId === undefined || !host) {
      throw new AppError({
        statusCode: 401,
        code: "UNAUTHENTICATED",
        message: "Sign in to add a profile photo.",
      });
    }

    const bytes = req.file?.buffer;
    const detected = bytes && (await fileTypeFromBuffer(bytes));
    const extension = detected && extensionByMime.get(detected.mime);
    if (!bytes || !extension) {
      throw new AppError({
        statusCode: 400,
        code: "INVALID_PHOTO",
        message: "Choose a JPEG, PNG, WebP, or HEIC photo.",
      });
    }

    const filename = `${randomUUID()}.${extension}`;
    filePath = path.join(mediaUploadDir, filename);
    await mkdir(mediaUploadDir, { recursive: true });
    await writeFile(filePath, bytes, { flag: "wx" });
    fileWritten = true;
    const mediaUrl = `${req.protocol}://${host}/uploads/${filename}`;
    const media = await addOwnedMedia(
      userId,
      mediaUrl,
      detected.mime,
      bytes.length,
    );
    filePath = undefined;
    res.status(201).json(media);
  } catch (error) {
    if (filePath && fileWritten)
      await rm(filePath, { force: true }).catch(() => undefined);
    next(error);
  }
};
