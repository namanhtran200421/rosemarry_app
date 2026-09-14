import { afterEach, describe, expect, it, vi } from "vitest";

process.env.EXPO_PUBLIC_AUTH_MODE = "mock";

const { ApplicationSessionError, createApplicationSession } =
  await import("./auth-api");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("application session API", () => {
  it("accepts the backend onboarding completion contract", async () => {
    const responseBody = {
      userId: 27,
      role: "USER",
      onboardingCompleted: false,
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(createApplicationSession("access-token")).resolves.toEqual(
      responseBody,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/auth/session",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer access-token" },
      }),
    );
  });

  it("rejects the stale profileExists response shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            userId: 27,
            role: "USER",
            profileExists: false,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    await expect(createApplicationSession("access-token")).rejects.toEqual(
      expect.any(ApplicationSessionError),
    );
  });
});
