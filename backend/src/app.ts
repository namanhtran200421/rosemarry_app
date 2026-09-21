import cors from "cors";
import express, { type Request, type Response } from "express";

import { env } from "./infrastructure/config/env.js";
import pool from "./infrastructure/database/database.js";
import authRouter from "./modules/authentication/auth.routes.js";
import verificationRouter from "./modules/verification/verification.routes.js";
import { errorHandler, notFound } from "./shared/http/error-handler.js";
import circlesRouter from "./modules/circles/circles.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: env.corsOrigins,
    allowedHeaders: ["Authorization", "Content-Type"],
    exposedHeaders: ["WWW-Authenticate"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", async function (_req: Request, res: Response) {
  try {
    const result = await pool.query<{ current_time: Date }>(
      "select now() as current_time",
    );

    res.status(200).json({
      message: "Server and database are running",
      databaseTime: result.rows[0]?.current_time,
    });
  } catch {
    res.status(503).json({
      message: "Database connection failed",
    });
  }
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/id-verification", verificationRouter);
app.use("/api/v1/circles", circlesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
