# UX contract

This file records behavior that should remain consistent across Rosemarry's
mobile flows. Visual values live in `DESIGN.md`; implementation boundaries live
in `ARCHITECTURE.md`.

## Canonical UI

| Need                     | Component                    | Notes                                              |
| ------------------------ | ---------------------------- | -------------------------------------------------- |
| Page container           | `Screen`                     | Safe-area-aware warm canvas                        |
| Primary/secondary action | `AppButton`                  | Includes disabled and busy states                  |
| Text entry               | `AppTextInput`               | Label, hint, and error semantics                   |
| Back navigation          | `BackButton`                 | Accessible icon action used by auth and onboarding |
| Recoverable error        | `ErrorMessage`               | Inline, screen-local feedback                      |
| Single choice            | `OptionRow` or `Radio`       | Use the existing selection language                |
| Compact choice           | `Chip` or `SegmentedControl` | Use only when labels remain readable               |

Do not create one-off replacements for these patterns inside a screen.

## Navigation and flow

- Signed-out users see Welcome, legal pages, phone entry, and code verification.
- Phone verification may use a local mock provider, but the screens and their
  validation remain in the route stack.
- Every pushed auth and onboarding screen exposes a back action. Back from the
  first onboarding step signs out and returns to the signed-out flow.
- Onboarding branches are stored in navigation history, so Back returns to the
  actual previous answer rather than a guessed linear step.
- Completion enters Home. Logout returns to Welcome.

## Async and failure behavior

- Disable repeat submission while an authentication request is running.
- Show authentication failures next to the current form and keep the user's
  input available for correction.
- Never log access tokens, OTP codes, or private profile answers.
- Loading the stored Auth0 session uses a full-screen loading state so protected
  content is not flashed.

## Verification

Run `npm run check` and `npm run doctor` for every release candidate. Exercise
both `mock` and `auth0` modes on a native build, including invalid phone/code,
request failure, Back at each step, app restart, and logout.
