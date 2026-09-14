import { afterEach, describe, expect, it, vi } from "vitest";

process.env.EXPO_PUBLIC_AUTH_MODE = "mock";

const { VerificationApiError, fetchVerificationState, startVerification } =
  await import("./verification-api");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("verification API", () => {
  it("starts an authenticated Didit session", async () => {
    const responseBody = {
      url: "https://verification.example/session/abc",
      sessionId: "abc",
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(startVerification("access-token")).resolves.toEqual(
      responseBody,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/id-verification/start",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer access-token" },
      }),
    );
  });

  it("accepts a verified status response", async () => {
    const responseBody = { ageVerified: true, status: "APPROVED" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(responseBody), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(fetchVerificationState("access-token")).resolves.toEqual(
      responseBody,
    );
  });

  it("rejects an invalid status response", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ ageVerified: "yes" }), { status: 200 }),
        ),
    );

    await expect(fetchVerificationState("access-token")).rejects.toEqual(
      expect.any(VerificationApiError),
    );
  });
});
