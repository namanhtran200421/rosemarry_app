import type {
  LocationInput,
  OnboardingStage,
  OnboardingSnapshot,
  PhotosInput,
  PromptsInput,
} from "../api/onboarding-api";
import {
  EMPTY_PROFILE,
  type OnboardingCatalogs,
  OnboardingProfile,
  OnboardingStepId,
} from "../types/onboarding.types";

export const STAGE_SCREEN: Record<OnboardingStage, OnboardingStepId> = {
  BASIC_PROFILE: "name",
  PREFERENCES: "preferences",
  INTERESTS: "interests",
  LIFESTYLE: "lifestyle",
  PROMPTS: "prompts",
  PHOTOS: "photos",
  LOCATION: "location",
  VERIFICATION: "done",
  COMPLETE: "done",
};

export const SERVER_STEP_NUMBER: Partial<Record<OnboardingStepId, number>> = {
  name: 1,
  age: 2,
  gender: 3,
  height: 4,
  lookingFor: 5,
  preferences: 6,
  interests: 7,
  lifestyle: 8,
  prompts: 9,
  photos: 10,
  location: 11,
};

const SERVER_SEQUENCE: OnboardingStepId[] = [
  "name",
  "age",
  "gender",
  "height",
  "lookingFor",
  "preferences",
  "interests",
  "lifestyle",
  "prompts",
  "photos",
  "location",
  "done",
];

export function nextServerStep(
  step: OnboardingStepId,
): OnboardingStepId | null {
  if (step === "genderMore") return "height";
  const next = SERVER_SEQUENCE[SERVER_SEQUENCE.indexOf(step) + 1];
  return next ?? null;
}

export function previousServerStep(
  step: OnboardingStepId,
): OnboardingStepId | null {
  if (step === "genderMore") return "gender";
  const previous = SERVER_SEQUENCE[SERVER_SEQUENCE.indexOf(step) - 1];
  return previous ?? null;
}

const DATING_GOALS: Record<string, string> = {
  LONG_TERM_RELATIONSHIP: "long",
  SHORT_TERM_RELATIONSHIP: "short",
  CASUAL_DATING: "casual",
  NEW_FRIENDS: "friends",
  NOT_SURE_YET: "unsure",
};

export function fromSnapshot(
  snapshot: OnboardingSnapshot,
  catalogs: OnboardingCatalogs,
): OnboardingProfile {
  if (!snapshot.profile) return EMPTY_PROFILE;
  const profile = snapshot.profile;
  const gender = catalogs.genders.find(
    (item) => item.genderId === profile.genderId,
  );
  const totalInches =
    profile.heightCm === null ? null : Math.round(profile.heightCm / 2.54);
  const prompts = Object.fromEntries(
    snapshot.prompts.map((answer) => [
      catalogs.prompts.find((item) => item.promptId === answer.promptId)
        ?.promptText ?? String(answer.promptId),
      answer.answer,
    ]),
  );
  const lifestyle = Object.fromEntries(
    snapshot.lifestyleAnswers.map((answer) => {
      const question = catalogs.lifestyle.find(
        (item) => item.questionId === answer.questionId,
      );
      const option = question?.options.find(
        (item) => item.optionId === answer.optionId,
      );
      const key = question?.slug
        ? question.slug[0].toUpperCase() + question.slug.slice(1)
        : String(answer.questionId);
      return [key, option?.label ?? ""];
    }),
  );
  return {
    ...EMPTY_PROFILE,
    name: profile.displayName,
    bio: profile.bio ?? "",
    dateOfBirth: profile.dateOfBirth,
    genderId: profile.genderId,
    gender:
      gender?.genderName ??
      (profile.genderId === null ? "Prefer not to say" : ""),
    height:
      totalInches === null
        ? EMPTY_PROFILE.height
        : `${Math.floor(totalInches / 12)}'${totalInches % 12}`,
    lookingFor: profile.datingGoal
      ? (DATING_GOALS[profile.datingGoal] ?? "")
      : "",
    preferences: snapshot.preferences
      ? {
          showMe: "Everyone",
          ageMin: snapshot.preferences.minAge,
          ageMax: snapshot.preferences.maxAge,
          distance: snapshot.preferences.maxDistanceKm,
        }
      : EMPTY_PROFILE.preferences,
    preferredGenderIds: snapshot.preferences?.preferredGenderIds ?? [],
    interestIds: snapshot.interestIds,
    interests: snapshot.interestIds.map(
      (id) =>
        catalogs.interests.find((item) => item.interestId === id)
          ?.interestName ?? String(id),
    ),
    lifestyleAnswers: Object.fromEntries(
      snapshot.lifestyleAnswers.map((answer) => [
        answer.questionId,
        answer.optionId,
      ]),
    ),
    lifestyle,
    promptAnswers: Object.fromEntries(
      snapshot.prompts.map((answer) => [answer.promptId, answer.answer]),
    ),
    promptOrder: snapshot.prompts.map((answer) => answer.promptId),
    prompts,
    mediaIds: snapshot.photos.map((photo) => photo.mediaId),
    mediaUrls: snapshot.photos
      .map(
        (photo) =>
          catalogs.media.find((media) => media.mediaId === photo.mediaId)
            ?.mediaUrl ?? "",
      )
      .filter(Boolean),
    location: snapshot.location
      ? {
          postcode: snapshot.location.postcode ?? "",
          city: snapshot.location.city,
          state: snapshot.location.state ?? "",
          country: snapshot.location.country,
        }
      : EMPTY_PROFILE.location,
  };
}

export function toPhotos(profile: OnboardingProfile): PhotosInput {
  return {
    photos: profile.mediaIds.map((mediaId, index) => ({
      mediaId,
      photoOrder: index + 1,
      isPrimary: index === 0,
    })),
  };
}

export function toPrompts(profile: OnboardingProfile): PromptsInput {
  return {
    prompts: profile.promptOrder.map((id, index) => ({
      promptId: id,
      answer: profile.promptAnswers[id].trim(),
      displayOrder: index + 1,
    })),
  };
}

export function toLocation(profile: OnboardingProfile): LocationInput {
  const optional = (value: string) => value.trim() || null;
  return {
    postcode: optional(profile.location.postcode),
    city: profile.location.city.trim(),
    state: optional(profile.location.state),
    country: profile.location.country.trim(),
  };
}
