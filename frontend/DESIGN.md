---
version: beta
name: "Rosemarry"
description: "A warm, sincere mobile social experience built around trusted circles and conversations."
source: "Claude Design project d06839d4-18ff-4554-a01e-d9af25785706"
colors:
  background: "#FBF2E9"
  surface: "#FFFFFF"
  surface-tint: "#FDEEF4"
  surface-sunken: "#F6EEF0"
  text: "#241A1D"
  text-secondary: "#857076"
  text-faint: "#B2A3A8"
  primary: "#F27FA8"
  primary-pressed: "#7D0D34"
  primary-accessible: "#A4134A"
  primary-tint: "#FDEEF4"
  border: "#ECE1E4"
  border-strong: "#D8CCD0"
  accent-red: "#D81E4A"
  accent-orange: "#F9A45F"
  success: "#1F9D5F"
  danger: "#D81E4A"
  danger-strong: "#A8153A"
  danger-surface: "#F9D5DE"
typography:
  sans:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    designIntent: "DynaPuff"
rounded:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "18px"
  xl: "22px"
  xxl: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "40px"
layout:
  screen-pad-x: "24px"
  field-height: "56px"
  control-height: "44px"
components:
  screen:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    height: "56px"
  button-neutral:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
  button-danger:
    backgroundColor: "{colors.danger-surface}"
    textColor: "{colors.danger-strong}"
  input:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    focusColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "56px"
  chip:
    selectedBackground: "{colors.primary}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
---

# Rosemarry Design System

## Overview

### Creative North Star

Rosemarry is _warm, sincere, and a little romantic_ — a pink songbird carrying a
red rose. The interface is soft-cornered and generously spaced, with a single
dominant brand pink doing nearly all the work on a warm cream canvas.

### Product context and register

- **Audience and primary job:** Adults signing in to a mobile relationship and
  social-circle product, then moving into profiles, circles, and conversations.
- **Register:** Product UI. Trust, legibility, and predictable states lead.
- **Voice:** Plain, warm, second person. Headlines are literal questions
  ("What's your mobile number?"). Subtext reassures briefly and is
  benefit-framed. Buttons are verbs. No emoji.
- **Casing:** Sentence case everywhere. The design system prohibits ALL-CAPS;
  the remaining uppercase eyebrows in `AuthHeader` and `HomeScreen` are a
  known deviation pending a copy pass.
- **Restraint:** Authentication, errors, and account actions avoid decorative
  motion, ambiguous icons, and novelty interaction.
- **Token ownership:** `src/shared/theme/tokens.ts` is the hand-maintained
  React Native runtime adapter and must change in the same changeset as this
  file.

## Colors

A warm cream (`#FBF2E9`) canvas with pure-white cards floating on top. A single
magenta-pink (`#F27FA8`) carries every primary button, selected chip, selected
row, and radio tick. Rose-red (`#D81E4A`) is reserved for the wordmark and text
links. Warm orange (`#F9A45F`) is a small accent for progress and notification
illustration. Neutrals are subtly warm. There are no purple or blue gradients.

### Contrast — read before shipping

White text on `primary` measures **2.5:1**, below the WCAG AA 4.5:1 threshold
for normal text. Primary controls therefore use `colors.onPrimary` mapped to
`palette.ink`, providing **6.8:1** while preserving the brand-pink fill.
`colors.primaryAccessible` (`#A4134A`) remains available when a deep-pink
surface with white content is specifically required.

Danger surfaces already use `dangerStrong` (`#A8153A`) for text and borders,
which reads 5.4:1 on `dangerSurface`.

## Typography

The design specifies **DynaPuff** at every size. The four used weights are
loaded through `expo-font` in `App.tsx`; the app holds its startup screen until
the font succeeds or fails, then falls back to the platform face on failure.
Runtime styles use the face names from `shared/theme/tokens.ts`.

Display text is 30px with tight `-0.02em` tracking; body is 16px with a 24px
line height. Line heights resolve the source ratios (1.15 / 1.3 / 1.5) to
absolute values, as React Native requires.

## Layout

Screens own safe-area handling through the shared `Screen` primitive. Content is
single-column, capped at 440px, with 24px side gutters. Controls are a
consistent 56px tall; the minimum tap target is 44px.

## Elevation & Depth

Soft, low, warm-tinted shadows — never a hard drop shadow. Cards use
`shadows.md` (`0 6px 20px rgba(12,20,17,.08)`). Selection is expressed with a
1.5px pink ring rather than elevation.

## Shapes

Heavily rounded: inputs and option rows at 16px, buttons at 18px, cards and
sheets at 22px, and full-pill chips, segmented controls, and avatars. Nothing
has a sharp corner.

## Components

### Foundational visual states

Every action has default, pressed, disabled, and busy states. Press feedback is
a quiet scale-down (0.98, or 0.94 for compact controls) — no color flip, no
ripple. Disabled drops to 45% opacity. Busy labels retain their geometry while
a centered progress indicator appears. Errors are persistent inline messages
with an assertive live-region announcement.

### Selection language

Two flavors, both driven by the brand pink:

- **Fill** — the control turns solid pink with an ink label. Use for compact
  single-line choices: chips, the active segment, `OptionRow` with
  `selectedStyle="fill"`.
- **Tint + ring + check** — pink-tinted background, 1.5px pink ring, and a
  filled pink circle with an ink check. Use for rich rows carrying a subtitle.

### Shared primitives

`shared/ui` holds `Screen`, `AppButton`, `AppTextInput`, `ErrorMessage`,
`LoadingScreen`, `BrandMark`, `BackButton`, `Chip`, `IconButton`, `OptionRow`,
`Radio`, and `SegmentedControl`. Feature screens compose these and must not
introduce new brand colors, radii, or loading behavior.

### Iconography

The reference set is Feather line icons (≈2px stroke, round caps, no fill),
rendered in pink or gray and paired with a text label. Emoji and unicode glyphs
are not used. Repeated icon-only actions must be wrapped in a shared component
with an accessible name; `BackButton` is the canonical example.

### Motion

Motion communicates state only: 120–150ms ease transitions on background and
transform. No bounces, no infinite loops, no parallax. Any future transition
must respect the platform's reduced-motion preference.

## Do's and Don'ts

- **Do:** Route reusable visual behavior through `shared/ui` and visual values
  through the runtime token adapter.
- **Do:** Keep authentication failure recoverable without losing the current
  screen or showing raw technical details.
- **Don't:** add one-off brand colors, radii, or loading behavior in a feature.
- **Don't:** use ALL-CAPS, emoji, loud gradients, or glass panels.
