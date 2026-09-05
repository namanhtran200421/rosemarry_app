import pool from "./config/database"
import cors from "cors"
import { errorHandler, notFound } from "./middleware/errorHandler";
import verificationRouter from "./id_verification/route/id_verification.routes.js";
import express, { type Request, type Response } from "express";
import {
  requireApplicationUser,
  validateAccessToken,
} from "./middleware/auth.middleware";
import authRouter from "./authentication/route/auth.route";
import idVerificationRouter from "./id_verification/route/id_verification.routes.js";


const app = express();

/*
 * Avoid advertising the framework in response headers. This is a small
 * hardening measure and has no effect on application behavior.
 */
app.disable("x-powered-by");

/*
 * React Native itself is not subject to browser CORS enforcement, but this
 * remains useful for Expo web and browser-based development.
 *
 * Use an explicit allow-list before deploying a web client publicly.
 */
app.use(cors());

/*
 * Reject unexpectedly large JSON bodies before they consume excessive memory.
 * Authentication requests currently do not require a body.
 */
app.use(express.json({ limit: "1mb" }));

/**
 * Public infrastructure health endpoint.
 *
 * It intentionally does not expose database connection details or raw errors.
 */
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
    // 503 communicates that the service is temporarily unavailable.
    res.status(503).json({
      message: "Database connection failed",
    });
  }
});

/*
 * The session route validates its Auth0 token internally because it needs to
 * create the application user on first login.
 */
app.use("/api/v1/auth", authRouter);

app.use("/verification", verificationRouter);
app.use(notFound)
app.use(errorHandler)
/*
 * Product endpoints use two authentication layers:
 *
 * 1. Validate the Auth0 access token.
 * 2. Resolve the token subject to an active internal Rosemarry user.
 */
app.use(
  "/api/v1/id-verification",
  validateAccessToken,
  requireApplicationUser,
  idVerificationRouter,
);

/*
 * These must remain last:
 * - notFound handles requests that matched no route.
 * - errorHandler serializes errors forwarded by routes and middleware.
 */
app.use(notFound);
app.use(errorHandler);

export default app;