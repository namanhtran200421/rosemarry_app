import { StyleSheet, View } from "react-native";

import { spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage";
import { OnboardingScreen } from "../components/OnboardingScreen";
import { PromptCard } from "../components/PromptCard";
import { StepCounter } from "../components/StepCounter";
import { StepTitle } from "../components/StepTitle";
import { TOTAL_STEPS, type StepScreenProps } from "../types/onboarding.types";

const MAX_PROMPTS = 3;

const PROMPTS = [
  "A perfect first date is…",
  "My most controversial opinion is…",
  "I get way too excited about…",
  "The way to win me over is…",
  "My simple pleasures are…",
  "Two truths and a lie…",
  "I go crazy for…",
  "You should not go out with me if…",
];

export function PromptsStep({
  profile,
  update,
  goNext,
  goBack,
  stepNumber,
  totalSteps = TOTAL_STEPS,
  catalogs,
  busy,
  error,
}: StepScreenProps) {
  const answers = catalogs ? profile.promptAnswers : profile.prompts;
  const picked = Object.keys(answers);
  const atLimit = picked.length >= MAX_PROMPTS;

  const options = catalogs
    ? catalogs.prompts.map((prompt) => ({
        id: prompt.promptId,
        label: prompt.promptText,
      }))
    : PROMPTS.map((label) => ({ id: null, label }));

  function toggle(prompt: string, id: number | null): void {
    if (catalogs && id !== null) {
      const next = { ...profile.promptAnswers };
      const wasSelected = id in next;
      if (!wasSelected && atLimit) return;
      if (wasSelected) delete next[id];
      else next[id] = "";
      update("promptAnswers", next);
      update(
        "promptOrder",
        wasSelected
          ? profile.promptOrder.filter((value) => value !== id)
          : [...profile.promptOrder, id],
      );
      const textAnswers = { ...profile.prompts };
      if (wasSelected) delete textAnswers[prompt];
      else textAnswers[prompt] = "";
      update("prompts", textAnswers);
      return;
    }
    const next = { ...profile.prompts };
    if (prompt in next) {
      delete next[prompt];
    } else if (!atLimit) {
      next[prompt] = "";
    }
    update("prompts", next);
  }

  return (
    <OnboardingScreen
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      onBack={goBack}
      footer={
        <>
          {error ? <ErrorMessage message={error} /> : null}
          <AppButton label="Continue" onPress={goNext} busy={busy} />
        </>
      }
    >
      <StepTitle
        title="Add profile prompts"
        subtitle="Pick up to 3 prompts and answer them to show your personality."
      />
      <StepCounter selected={picked.length} max={MAX_PROMPTS} />

      <View style={styles.list}>
        {options.map(({ id, label }) => {
          const answer =
            id === null ? profile.prompts[label] : profile.promptAnswers[id];
          const isOn = answer !== undefined;
          const isDimmed = !isOn && atLimit;

          return (
            <PromptCard
              key={id ?? label}
              prompt={label}
              answer={answer}
              disabled={isDimmed}
              onToggle={() => toggle(label, id)}
              onAnswerChange={(value) => {
                update("prompts", { ...profile.prompts, [label]: value });
                if (id !== null)
                  update("promptAnswers", {
                    ...profile.promptAnswers,
                    [id]: value,
                  });
              }}
            />
          );
        })}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});
