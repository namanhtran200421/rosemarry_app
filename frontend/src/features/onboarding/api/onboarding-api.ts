import { environment } from "../../../shared/config/environment";
import type {
  BasicProfileInput,
  GenderOption,
  InterestOption,
  LifestyleInput,
  LifestyleOption,
  LifestyleQuestion,
  LocationInput,
  OnboardingSnapshot,
  OnboardingState,
  OwnedMedia,
  PhotosInput,
  PreferencesInput,
  PromptOption,
  PromptsInput,
  InterestsInput,
} from "./onboarding-contract";

import { isOnboardingState } from "./onboarding-state-validator";

export type * from "./onboarding-contract";

const REQUEST_TIMEOUT_MS = 10_000;

export class OnboardingApiError extends Error {
  constructor(
    readonly status: number | null,
    message?: string,
  ) {
    super(message ?? "The onboarding request could not be completed.");
    this.name = "OnboardingApiError";
  }
}

async function request<T>(
  path: string,
  token: string,
  method: "GET" | "PUT" | "POST",
  valid: (value: unknown) => value is T,
  body?: object,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(`${environment.apiUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch {
      throw new OnboardingApiError(null);
    }

    if (!response.ok) {
      let message: string | undefined;
      try {
        const error: unknown = await response.json();
        if (error && typeof error === "object" && "error" in error) {
          const detail = (error as { error: unknown }).error;
          if (detail && typeof detail === "object" && "message" in detail) {
            const candidate = (detail as { message: unknown }).message;
            if (typeof candidate === "string") message = candidate;
          }
        }
      } catch {
        // Keep the generic message when the server has no JSON error body.
      }
      throw new OnboardingApiError(response.status, message);
    }

    let result: unknown;
    try {
      result = await response.json();
    } catch {
      throw new OnboardingApiError(response.status);
    }
    if (!valid(result)) {
      throw new OnboardingApiError(response.status);
    }
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

export function fetchOnboardingState(token: string): Promise<OnboardingState> {
  return request("/api/v1/onboarding/state", token, "GET", isOnboardingState);
}

export function fetchOnboardingSnapshot(
  token: string,
): Promise<OnboardingSnapshot> {
  return request(
    "/api/v1/onboarding/snapshot",
    token,
    "GET",
    isOnboardingSnapshot,
  );
}

export function saveBasicProfile(
  token: string,
  profile: BasicProfileInput,
): Promise<OnboardingState> {
  return request(
    "/api/v1/onboarding/profile",
    token,
    "PUT",
    isOnboardingState,
    profile,
  );
}

const base = "/api/v1/onboarding";
const isId = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
const string = (value: unknown): value is string => typeof value === "string";
const list = <T>(
  value: unknown,
  valid: (item: unknown) => item is T,
): value is T[] => Array.isArray(value) && value.every(valid);

const isGender = (value: unknown): value is GenderOption =>
  record(value) && isId(value.genderId) && string(value.genderName);
const isInterest = (value: unknown): value is InterestOption =>
  record(value) &&
  isId(value.interestId) &&
  string(value.interestName) &&
  string(value.slug);
const isLifestyleOption = (value: unknown): value is LifestyleOption =>
  record(value) &&
  isId(value.optionId) &&
  string(value.label) &&
  string(value.slug) &&
  isId(value.displayOrder);
const isLifestyleQuestion = (value: unknown): value is LifestyleQuestion =>
  record(value) &&
  isId(value.questionId) &&
  string(value.questionText) &&
  string(value.slug) &&
  isId(value.displayOrder) &&
  list(value.options, isLifestyleOption);
const isPrompt = (value: unknown): value is PromptOption =>
  record(value) &&
  isId(value.promptId) &&
  string(value.promptText) &&
  string(value.slug);
const isMedia = (value: unknown): value is OwnedMedia =>
  record(value) && isId(value.mediaId) && string(value.mediaUrl);

function isOnboardingSnapshot(value: unknown): value is OnboardingSnapshot {
  if (!record(value)) return false;
  const profile = value.profile;
  const preferences = value.preferences;
  const location = value.location;
  return (
    (profile === null ||
      (record(profile) &&
        string(profile.displayName) &&
        string(profile.dateOfBirth) &&
        (profile.genderId === null || isId(profile.genderId)) &&
        (profile.bio === null || string(profile.bio)) &&
        (profile.datingGoal === null || string(profile.datingGoal)) &&
        (profile.heightCm === null || typeof profile.heightCm === "number"))) &&
    (preferences === null ||
      (record(preferences) &&
        typeof preferences.minAge === "number" &&
        typeof preferences.maxAge === "number" &&
        typeof preferences.maxDistanceKm === "number" &&
        list(preferences.preferredGenderIds, isId))) &&
    list(value.interestIds, isId) &&
    list(
      value.lifestyleAnswers,
      (item): item is LifestyleInput["answers"][number] =>
        record(item) && isId(item.questionId) && isId(item.optionId),
    ) &&
    list(
      value.prompts,
      (item): item is PromptsInput["prompts"][number] =>
        record(item) &&
        isId(item.promptId) &&
        string(item.answer) &&
        isId(item.displayOrder),
    ) &&
    list(
      value.photos,
      (item): item is PhotosInput["photos"][number] =>
        record(item) &&
        isId(item.mediaId) &&
        isId(item.photoOrder) &&
        typeof item.isPrimary === "boolean",
    ) &&
    (location === null ||
      (record(location) &&
        string(location.city) &&
        string(location.country) &&
        ["postcode", "state"].every(
          (key) => location[key] === null || string(location[key]),
        )))
  );
}

export const fetchGenders = (token: string) =>
  request(`${base}/genders`, token, "GET", (value): value is GenderOption[] =>
    list(value, isGender),
  );
export const fetchInterests = (token: string) =>
  request(
    `${base}/interests`,
    token,
    "GET",
    (value): value is InterestOption[] => list(value, isInterest),
  );
export const fetchLifestyle = (token: string) =>
  request(
    `${base}/lifestyle`,
    token,
    "GET",
    (value): value is LifestyleQuestion[] => list(value, isLifestyleQuestion),
  );
export const fetchPrompts = (token: string) =>
  request(`${base}/prompts`, token, "GET", (value): value is PromptOption[] =>
    list(value, isPrompt),
  );
export const fetchOwnedMedia = (token: string) =>
  request(`${base}/media`, token, "GET", (value): value is OwnedMedia[] =>
    list(value, isMedia),
  );

export async function uploadOwnedMedia(
  token: string,
  photo: { uri: string; fileName?: string | null; mimeType?: string | null },
): Promise<OwnedMedia> {
  let response: {
    status: number;
    body: string;
  };
  try {
    const FileSystem = await import("expo-file-system/legacy");
    response = await FileSystem.uploadAsync(
      `${environment.apiUrl}${base}/media`,
      photo.uri,
      {
        httpMethod: "POST",
        headers: { Authorization: `Bearer ${token}` },
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "photo",
        mimeType: photo.mimeType ?? "image/jpeg",
      },
    );
  } catch (cause) {
    throw new OnboardingApiError(
      null,
      cause instanceof Error
        ? `Could not upload your photo: ${cause.message}`
        : "Could not upload your photo.",
    );
  }

  if (response.status < 200 || response.status >= 300) {
    let detail: string | null = null;
    try {
      const body: unknown = JSON.parse(response.body);
      if (record(body) && record(body.error) && string(body.error.message)) {
        detail = body.error.message;
      }
    } catch {
      // The server may return a non-JSON error body.
    }
    throw new OnboardingApiError(
      response.status,
      detail ?? `Could not upload your photo (HTTP ${response.status}).`,
    );
  }

  let media: unknown;
  try {
    media = JSON.parse(response.body);
  } catch {
    throw new OnboardingApiError(response.status);
  }
  if (!isMedia(media)) throw new OnboardingApiError(response.status);
  return media;
}

const save = (path: string, token: string, body: object) =>
  request(`${base}/${path}`, token, "PUT", isOnboardingState, body);
export const savePreferences = (token: string, body: PreferencesInput) =>
  save("preferences", token, body);
export const saveInterests = (token: string, body: InterestsInput) =>
  save("interests", token, body);
export const saveLifestyle = (token: string, body: LifestyleInput) =>
  save("lifestyle", token, body);
export const savePrompts = (token: string, body: PromptsInput) =>
  save("prompts", token, body);
export const savePhotos = (token: string, body: PhotosInput) =>
  save("photos", token, body);
export const saveLocation = (token: string, body: LocationInput) =>
  save("location", token, body);
export const completeOnboarding = (token: string) =>
  request(`${base}/complete`, token, "POST", isOnboardingState);
