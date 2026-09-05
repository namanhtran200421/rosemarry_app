import { StyleSheet, View } from "react-native";

import { spacing } from "../../../shared/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
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
}: StepScreenProps) {
  const answers = profile.prompts;
  const picked = Object.keys(answers);
  const atLimit = picked.length >= MAX_PROMPTS;

  function toggle(prompt: string): void {
    const next = { ...answers };
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
      totalSteps={TOTAL_STEPS}
      onBack={goBack}
      footer={<AppButton label="Continue" onPress={goNext} />}
    >
      <StepTitle
        title="Add profile prompts"
        subtitle="Pick up to 3 prompts and answer them to show your personality."
      />
      <StepCounter selected={picked.length} max={MAX_PROMPTS} />

      <View style={styles.list}>
        {PROMPTS.map((prompt) => {
          const isOn = prompt in answers;
          const isDimmed = !isOn && atLimit;

          return (
            <PromptCard
              key={prompt}
              prompt={prompt}
              answer={answers[prompt]}
              disabled={isDimmed}
              onToggle={() => toggle(prompt)}
              onAnswerChange={(value) =>
                update("prompts", { ...answers, [prompt]: value })
              }
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
