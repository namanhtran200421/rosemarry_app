import { describe, expect, it } from "vitest";

import { EMPTY_PROFILE } from "../types/onboarding.types";
import {
  STAGE_SCREEN,
  fromSnapshot,
  nextServerStep,
  previousServerStep,
  toLocation,
  toPhotos,
  toPrompts,
} from "./server-onboarding";

describe("server onboarding mapping", () => {
  it("resumes at the backend stage", () => {
    expect(STAGE_SCREEN.PREFERENCES).toBe("preferences");
    expect(STAGE_SCREEN.PHOTOS).toBe("photos");
    expect(STAGE_SCREEN.VERIFICATION).toBe("done");
  });

  it("can revisit earlier answers and return through the server stages", () => {
    expect(previousServerStep("photos")).toBe("prompts");
    expect(previousServerStep("preferences")).toBe("lookingFor");
    expect(nextServerStep("lookingFor")).toBe("preferences");
    expect(nextServerStep("location")).toBe("done");
  });

  it("sends selected media in order with one primary photo", () => {
    expect(toPhotos({ ...EMPTY_PROFILE, mediaIds: [7, 3] })).toEqual({
      photos: [
        { mediaId: 7, photoOrder: 1, isPrimary: true },
        { mediaId: 3, photoOrder: 2, isPrimary: false },
      ],
    });
  });

  it("trims prompt answers and submits city and country without coordinates", () => {
    expect(
      toPrompts({
        ...EMPTY_PROFILE,
        promptAnswers: { 2: " Hello " },
        promptOrder: [2],
      }),
    ).toEqual({ prompts: [{ promptId: 2, answer: "Hello", displayOrder: 1 }] });
    expect(
      toLocation({
        ...EMPTY_PROFILE,
        location: {
          postcode: " ",
          city: " Melbourne ",
          state: "",
          country: " Australia ",
        },
      }),
    ).toEqual({
      postcode: null,
      city: "Melbourne",
      state: null,
      country: "Australia",
    });
  });

  it("restores saved answers after an app restart", () => {
    const profile = fromSnapshot(
      {
        profile: {
          displayName: "Alex",
          dateOfBirth: "2000-03-02",
          genderId: 2,
          bio: "Hello",
          datingGoal: "LONG_TERM_RELATIONSHIP",
          heightCm: 173,
        },
        preferences: {
          minAge: 24,
          maxAge: 35,
          maxDistanceKm: 50,
          preferredGenderIds: [2],
        },
        interestIds: [4],
        lifestyleAnswers: [{ questionId: 1, optionId: 3 }],
        prompts: [{ promptId: 5, answer: "Coffee", displayOrder: 1 }],
        photos: [{ mediaId: 7, photoOrder: 1, isPrimary: true }],
        location: {
          city: "Melbourne",
          country: "Australia",
          state: "Victoria",
          postcode: null,
        },
      },
      {
        genders: [{ genderId: 2, genderName: "Woman" }],
        interests: [{ interestId: 4, interestName: "Music", slug: "music" }],
        lifestyle: [
          {
            questionId: 1,
            questionText: "Do you smoke?",
            slug: "smoking",
            displayOrder: 1,
            options: [
              { optionId: 3, label: "No", slug: "no", displayOrder: 1 },
            ],
          },
        ],
        prompts: [
          { promptId: 5, promptText: "First date?", slug: "first-date" },
        ],
        media: [{ mediaId: 7, mediaUrl: "https://example.test/7.jpg" }],
      },
    );
    expect(profile.name).toBe("Alex");
    expect(profile.gender).toBe("Woman");
    expect(profile.interests).toEqual(["Music"]);
    expect(profile.promptAnswers[5]).toBe("Coffee");
    expect(profile.promptOrder).toEqual([5]);
    expect(profile.mediaIds).toEqual([7]);
    expect(profile.mediaUrls).toEqual(["https://example.test/7.jpg"]);
    expect(profile.location).toEqual({
      city: "Melbourne",
      country: "Australia",
      state: "Victoria",
      postcode: "",
    });
  });
});
