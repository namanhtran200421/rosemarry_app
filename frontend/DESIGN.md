---
version: alpha
name: "Rosemarry"
description: "A calm, intentional mobile social experience built around trusted circles and conversations."
colors:
  background: "#FFF8FA"
  surface: "#FFFFFF"
  text: "#291C22"
  text-muted: "#705E66"
  primary: "#A13D62"
  primary-pressed: "#7F2F4C"
  border: "#E5D4DB"
  danger: "#9C3048"
  danger-surface: "#FFF0F3"
  focus: "#315C9B"
typography:
  sans:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
rounded:
  sm: "8px"
  md: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "40px"
components:
  screen:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "{spacing.xl}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.surface}"
  button-neutral:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  button-danger:
    backgroundColor: "{colors.danger-surface}"
    textColor: "{colors.danger}"
  message-error:
    backgroundColor: "{colors.danger-surface}"
    textColor: "{colors.danger}"
    rounded: "{rounded.sm}"
    height: "48px"
  muted-copy:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-muted}"
  border-swatch:
    backgroundColor: "{colors.border}"
    textColor: "{colors.text}"
  focus-indicator:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.surface}"
---

# Rosemarry Design System

## Overview

### Creative North Star

Rosemarry should feel like a thoughtfully annotated invitation: warm and personal,
with the clarity and restraint needed for identity, safety, and account actions.

### Product context and register

- **Audience and primary job:** Adults signing in to a mobile relationship and
  social-circle product, then moving into profiles, circles, and conversations.
- **Target market and evidence:** The repository establishes a mobile application
  with Auth0 identity, profiles, dating goals, circles, and messaging. No narrower
  market or locale contract is documented yet.
- **Locale and language policy:** English is the current owned UI language. New
  product copy must be centralized before a second locale is introduced.
- **Usage scene:** Touch-first iOS and Android use, often one-handed; primary
  actions use at least 48px height and respect device safe areas.
- **Register:** Product UI. Trust, legibility, and predictable states lead.
- **Memorable signature:** A short, slightly rotated rose stroke acts as a quiet
  registration mark on brand moments.
- **Restraint:** Authentication, errors, and account actions avoid decorative
  motion, ambiguous icons, and novelty interaction.
- **Anti-references:** Avoid swipe-game visual language, loud gradients, glass
  panels, and generic dashboard chrome; none reflects the circle-led product model.
- **Token ownership/runtime mapping:** This file documents the canonical visual
  decisions. `src/shared/theme/tokens.ts` is the hand-maintained React Native
  runtime adapter and must change in the same changeset as token updates here.

## Colors

The pale rose background and white surface keep the application warm without
reducing text contrast. `primary` is reserved for identity and the main safe action.
`danger` and `danger-surface` identify security-sensitive or destructive actions
with text as well as color. `focus` is reserved for a future shared keyboard focus
treatment and must remain distinct from brand and danger.

## Typography

Use the platform system sans family to avoid late font swaps and preserve native
legibility. Display text is bold and compact; body copy uses a 16px baseline with
24px line height. Labels use sentence case. Uppercase is restricted to brief
eyebrows with deliberate tracking.

## Layout

Screens own safe-area handling through the shared `Screen` primitive. Content is
single-column, centered, and capped at 440px for tablet readability. Use the
documented spacing tokens; leave 40px between major decision areas and 12–16px
between closely related controls.

## Elevation & Depth

Tonal separation and borders establish hierarchy. Static authentication and home
surfaces do not use shadows. Overlays may add elevation only when their behavior is
implemented through a shared accessible primitive.

## Shapes

Controls use a 14px radius: soft enough for the product's human tone without
becoming pill-shaped. Messages use 8px corners and a semantic leading rule. The
brand stroke is the sole pill-shaped decorative element.

## Components

### Foundational visual states

Every action has default, pressed, disabled, and busy states. Busy labels retain
their geometry while a centered progress indicator appears. Errors are persistent
inline messages with an assertive live-region announcement. Loading screens reserve
the full content area and name the operation in progress.

### Buttons and actions

Use solid brand for the primary safe action, white outline for neutral providers,
and a rose-tinted danger outline for logout or destructive actions in normal
screens. Buttons are at least 48px high. Labels name the actual action.

### Navigation and data display

Authentication routes are selected from application session state; authenticated
and unauthenticated screens cannot sit together in back history. Future tabs and
lists must be shared patterns before being repeated across features.

### Forms and overlays

Errors stay next to the control group that can recover from them and never expose
raw provider or backend responses. App-owned dialog and notification primitives
must be introduced in `shared/ui` before a feature needs those behaviors.

### Iconography

No icon family is selected yet. Prefer explicit text labels. Adopt one shared icon
family before adding repeated icon-only controls.

### Motion

Motion communicates state only. Prefer native press feedback and progress
indicators; avoid ambient motion in authentication. Any future transition must
respect the platform's reduced-motion preference.

### Content and data visualization

Use calm, direct copy from the user's perspective. Say “Log out,” “Try again,” and
“Continue with …”; do not expose protocol or provider implementation language.

## Do's and Don'ts

- **Do:** Route reusable visual behavior through `shared/ui` and visual values
  through the runtime token adapter.
- **Do:** Keep authentication failure recoverable without losing the current
  screen or showing raw technical details.
- **Don't:** add one-off brand colors, radii, or loading behavior inside a feature.
- **Don't:** use romantic clichés, decorative gradients, or swipe-game patterns
  as a substitute for the circle-led product identity.
