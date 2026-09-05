# Rosemarry mobile

Expo/React Native client for Rosemarry. The source is organized by feature with
app composition in `src/application` and reusable foundations in `src/shared`.
See [ARCHITECTURE.md](./ARCHITECTURE.md) before adding a feature and
[DESIGN.md](./DESIGN.md) before changing UI.

## Local setup

```sh
npm ci
npm run start
```

Environment values are grouped in `.env`. Set `EXPO_PUBLIC_AUTH_MODE=mock` to exercise the phone and OTP
screens without calling Auth0. Mock mode bypasses authentication logic only; it
does not skip either screen. Production builds reject mock mode.

Use `EXPO_PUBLIC_AUTH_MODE=auth0` with the public Auth0 and API values in `.env`
to exercise the real sign-in flow. Never put an Auth0 client secret in this
application.

## Commands

- `npm run check` — formatting, TypeScript, ESLint, and unit tests
- `npm run doctor` — Expo dependency/configuration health
- `npm run ios` / `npm run android` — native development builds
- `npm run format` — apply the repository formatting rules

Generated native projects, Expo state, build output, dependencies, and local
environment files are ignored. Do not commit them.

## Release status

The codebase is structured for production maintenance, but the following
product integrations must be completed and acceptance-tested before release:

- The backend contract for `POST /api/v1/auth/session` must exist and match
  `AuthSession`.
- Onboarding answers are currently held in memory and need a persistence API.
- Profile photo controls are placeholders and need an image picker/upload flow.
- The notification step does not yet request operating-system permission.
- Terms and privacy content must be replaced with approved legal copy.

These are intentionally documented rather than hidden behind frontend-only
stubs. Their API shapes and failure behavior require product/backend decisions.
