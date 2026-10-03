import { afterEach, describe, expect, it, vi } from "vitest";

process.env.EXPO_PUBLIC_AUTH_MODE = "mock";

vi.mock("expo-file-system/legacy", () => ({
  FileSystemUploadType: { MULTIPART: 1 },
  uploadAsync: vi.fn(),
}));

const {
  fetchOnboardingState,
  fetchOnboardingSnapshot,
  saveBasicProfile,
  savePreferences,
  savePhotos,
  saveLocation,
  completeOnboarding,
  fetchLifestyle,
  fetchOwnedMedia,
  uploadOwnedMedia,
  OnboardingApiError,
} = await import("./onboarding-api");
const FileSystem = await import("expo-file-system/legacy");

afterEach(() => vi.unstubAllGlobals());

describe("onboarding API", () => {
  it("uploads a selected photo as authenticated multipart data", async () => {
    const media = {
      mediaId: 7,
      mediaUrl: "http://localhost/uploads/photo.jpg",
    };
    vi.mocked(FileSystem.uploadAsync).mockResolvedValue({
      status: 201,
      body: JSON.stringify(media),
      headers: {},
      mimeType: "application/json",
    });

    await expect(
      uploadOwnedMedia("access-token", {
        uri: "file:///photo.jpg",
        mimeType: "image/jpeg",
      }),
    ).resolves.toEqual(media);
    expect(FileSystem.uploadAsync).toHaveBeenCalledWith(
      "/api/v1/onboarding/media",
      "file:///photo.jpg",
      expect.objectContaining({
        headers: { Authorization: "Bearer access-token" },
        uploadType: 1,
        fieldName: "photo",
      }),
    );
  });

  it("loads the authenticated server stage", async () => {
    const state = { stage: "BASIC_PROFILE", completedAt: null };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(state), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchOnboardingState("access-token")).resolves.toEqual(state);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/onboarding/state",
      expect.objectContaining({
        method: "GET",
        headers: { Authorization: "Bearer access-token" },
      }),
    );
  });

  it("saves basic profile fields with the backend contract", async () => {
    const state = { stage: "PREFERENCES", completedAt: null };
    const profile = {
      displayName: "Alex",
      dateOfBirth: "2000-03-02",
      genderId: null,
      bio: null,
      datingGoal: "LONG_TERM_RELATIONSHIP" as const,
      heightCm: 173,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(state), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(saveBasicProfile("access-token", profile)).resolves.toEqual(
      state,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/onboarding/profile",
      expect.objectContaining({
        method: "PUT",
        headers: {
          Authorization: "Bearer access-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      }),
    );
  });

  it("surfaces a backend validation message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: "MINIMUM_AGE_REQUIRED",
              message: "You must be at least 18 years old",
            },
          }),
          { status: 400 },
        ),
      ),
    );

    await expect(fetchOnboardingState("access-token")).rejects.toMatchObject({
      name: OnboardingApiError.name,
      status: 400,
      message: "You must be at least 18 years old",
    });
  });

  it("saves later stages and completes onboarding with the expected methods", async () => {
    const fetchMock = vi.fn().mockImplementation(
      async () =>
        new Response(
          JSON.stringify({
            stage: "COMPLETE",
            completedAt: "2026-10-03T00:00:00Z",
          }),
          { status: 200 },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);
    await savePreferences("access-token", {
      minAge: 24,
      maxAge: 35,
      maxDistanceKm: 50,
      preferredGenderIds: [],
    });
    await savePhotos("access-token", {
      photos: [
        { mediaId: 1, photoOrder: 1, isPrimary: true },
        { mediaId: 2, photoOrder: 2, isPrimary: false },
      ],
    });
    await saveLocation("access-token", {
      city: "Melbourne",
      country: "Australia",
      state: null,
      postcode: null,
    });
    await completeOnboarding("access-token");
    expect(
      fetchMock.mock.calls.map(([url, options]) => [url, options.method]),
    ).toEqual([
      ["/api/v1/onboarding/preferences", "PUT"],
      ["/api/v1/onboarding/photos", "PUT"],
      ["/api/v1/onboarding/location", "PUT"],
      ["/api/v1/onboarding/complete", "POST"],
    ]);
  });

  it("reads owned media and rejects malformed catalog data", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify([
              { mediaId: 7, mediaUrl: "https://example.test/7.jpg" },
            ]),
            { status: 200 },
          ),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify([{ questionId: 1, options: "invalid" }]),
            { status: 200 },
          ),
        ),
    );
    await expect(fetchOwnedMedia("access-token")).resolves.toEqual([
      { mediaId: 7, mediaUrl: "https://example.test/7.jpg" },
    ]);
    await expect(fetchLifestyle("access-token")).rejects.toBeInstanceOf(
      OnboardingApiError,
    );
  });

  it("loads a saved onboarding snapshot", async () => {
    const snapshot = {
      profile: null,
      preferences: null,
      interestIds: [],
      lifestyleAnswers: [],
      prompts: [],
      photos: [],
      location: {
        city: "Melbourne",
        country: "Australia",
        state: "Victoria",
        postcode: null,
      },
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(snapshot), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchOnboardingSnapshot("access-token")).resolves.toEqual(
      snapshot,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/onboarding/snapshot",
      expect.objectContaining({ method: "GET" }),
    );
  });
});
