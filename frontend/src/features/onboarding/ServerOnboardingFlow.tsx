import { useCallback, useEffect, useState } from "react";

import { AppButton } from "../../shared/ui/AppButton";
import { ErrorMessage } from "../../shared/ui/ErrorMessage";
import { LoadingScreen } from "../../shared/ui/LoadingScreen";
import {
  fetchGenders,
  fetchInterests,
  fetchLifestyle,
  fetchOnboardingState,
  fetchOnboardingSnapshot,
  fetchOwnedMedia,
  fetchPrompts,
  type OnboardingState,
} from "./api/onboarding-api";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { StepTitle } from "./components/StepTitle";
import { ONBOARDING_STEP_SCREENS } from "./config/onboarding-steps";
import type { OnboardingFlowProps } from "./OnboardingFlow";
import {
  EMPTY_PROFILE,
  type OnboardingCatalogs,
  type OnboardingProfile,
  type OnboardingStepId,
} from "./types/onboarding.types";
import {
  SERVER_STEP_NUMBER,
  STAGE_SCREEN,
  fromSnapshot,
  nextServerStep,
  previousServerStep,
} from "./utils/server-onboarding";
import { submitServerStep } from "./utils/submit-server-step";

export function ServerOnboardingFlow({
  onComplete,
  onExit,
  getAccessToken,
}: OnboardingFlowProps) {
  const [profile, setProfile] = useState<OnboardingProfile>(EMPTY_PROFILE);
  const [stepOverride, setStepOverride] = useState<OnboardingStepId | null>(
    null,
  );
  const update = useCallback(
    <K extends keyof OnboardingProfile>(
      key: K,
      value: OnboardingProfile[K],
    ) => {
      setProfile((current) => ({ ...current, [key]: value }));
    },
    [],
  );
  const [state, setState] = useState<OnboardingState | null>(null);
  const [catalogs, setCatalogs] = useState<OnboardingCatalogs | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    async function load(): Promise<void> {
      try {
        const token = await getAccessToken();
        const [
          progress,
          snapshot,
          genders,
          interests,
          lifestyle,
          prompts,
          media,
        ] = await Promise.all([
          fetchOnboardingState(token),
          fetchOnboardingSnapshot(token),
          fetchGenders(token),
          fetchInterests(token),
          fetchLifestyle(token),
          fetchPrompts(token),
          fetchOwnedMedia(token),
        ]);
        if (active) {
          setProfile(
            fromSnapshot(snapshot, {
              genders,
              interests,
              lifestyle,
              prompts,
              media,
            }),
          );
          setState(progress);
          setStepOverride(null);
          setCatalogs({ genders, interests, lifestyle, prompts, media });
          setLoadError(null);
        }
      } catch {
        if (active)
          setLoadError(
            "Could not load your onboarding progress. Please retry.",
          );
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [getAccessToken, reload]);

  const step = state ? (stepOverride ?? STAGE_SCREEN[state.stage]) : "name";

  function goBack(): void {
    const previous = previousServerStep(step);
    if (previous) {
      setError(null);
      setStepOverride(previous);
    } else {
      onExit?.();
    }
  }

  async function advance(): Promise<void> {
    if (!state || busy) return;
    setError(null);
    if (["name", "age", "gender", "genderMore", "height"].includes(step)) {
      setStepOverride(nextServerStep(step));
      return;
    }
    setBusy(true);
    try {
      const token = await getAccessToken();
      const next = await submitServerStep(step, token, profile);
      if (step === "photos" && catalogs) {
        update(
          "mediaUrls",
          profile.mediaIds
            .map(
              (id) =>
                catalogs.media.find((item) => item.mediaId === id)?.mediaUrl ??
                "",
            )
            .filter(Boolean),
        );
      }
      setState(next);
      setStepOverride(nextServerStep(step));
      if (next.stage === "COMPLETE" && next.completedAt !== null)
        onComplete(profile);
    } catch (cause) {
      setError(
        cause instanceof Error &&
          cause.message !== "The onboarding request could not be completed."
          ? cause.message
          : "Could not save your progress. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function refreshMedia(): Promise<void> {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const media = await fetchOwnedMedia(token);
      setCatalogs((current) => (current ? { ...current, media } : current));
    } catch {
      setError("Could not refresh your photos. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  if (loadError) {
    return (
      <OnboardingScreen
        onBack={onExit}
        footer={
          <AppButton
            label="Retry"
            onPress={() => {
              setLoadError(null);
              setReload((value) => value + 1);
            }}
          />
        }
      >
        <StepTitle title="Your progress is unavailable" />
        <ErrorMessage message={loadError} />
      </OnboardingScreen>
    );
  }

  if (!state || !catalogs)
    return <LoadingScreen label="Loading your progress" />;

  const StepScreen = ONBOARDING_STEP_SCREENS[step];
  return (
    <StepScreen
      profile={profile}
      update={update}
      catalogs={catalogs}
      onRefreshMedia={() => void refreshMedia()}
      goNext={() => void advance()}
      goTo={setStepOverride}
      goBack={goBack}
      stepNumber={SERVER_STEP_NUMBER[step] ?? null}
      totalSteps={11}
      busy={busy}
      error={error}
    />
  );
}
