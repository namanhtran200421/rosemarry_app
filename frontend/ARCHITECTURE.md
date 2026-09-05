# Frontend architecture

The frontend uses a small feature-first structure so product behavior stays close
to the screens that use it while reusable infrastructure stays neutral.

```text
src/
  application/  App-wide composition, providers, and navigation
  features/  Product capabilities such as auth, profiles, and conversations
  shared/    Reusable UI, configuration, theme tokens, and generic utilities
```

## Dependency direction

Dependencies flow in one direction:

```text
application -> features -> shared
```

- `shared` must not import from `features` or `application`.
- A feature may import from `shared`, but not from another feature's internal
  screens. Cross-feature composition belongs in `application`.
- Network calls live in the owning feature's `api` folder.
- Stateful business behavior lives in a feature hook or provider, not in a
  navigation file or shared visual component.
- Screens compose feature components. They should not own environment parsing,
  raw API calls, or app-wide session state.
- Shared UI components use values from `shared/theme/tokens.ts`; feature screens
  should not introduce new brand colors or spacing constants.
- Public runtime configuration is validated in `shared/config`. Keep all local
  values grouped in the ignored `.env` file without committing credentials.
- Native Expo configuration reads the Auth0 domain from the same environment in
  `app.config.ts`, preventing the callback host from drifting across builds.

## Adding a feature

Create only the folders the feature needs:

```text
features/<feature>/
  api/
  components/
  screens/
  session/ or hooks/
  types/
  utils/
```

Keep files single-purpose and use direct imports. Avoid catch-all barrel files,
global `utils.ts` files, and feature logic in `App.tsx`.

Run `npm run check` before merging. It checks formatting, types, lint rules, and
unit tests. The lint configuration enforces the layer direction above and
rejects source files over 300 non-blank, non-comment lines.

The layer is named `application` rather than `app` because Expo reserves
`src/app` for Expo Router projects. This app currently uses React Navigation.

## Authentication flow

Phone sign-in is an embedded, two-step Auth0 passwordless flow:

1. `LoginScreen` normalizes the mobile number to international E.164 format and
   asks Auth0 to send an SMS code.
2. `VerifyCodeScreen` submits that code to Auth0. Auth0 stores the resulting
   credentials in its native encrypted credential manager.
3. `Auth0SessionProvider` sends only the Auth0 access token to
   `POST /api/v1/auth/session` and stores the returned Rosemarry session in
   memory.
4. Logout clears the locally stored Auth0 credentials and the in-memory app
   session. It does not open an Auth0 browser session.

The mobile bundle contains public Auth0 application identifiers only. Never add
an Auth0 client secret to the frontend. The Auth0 tenant must have the SMS
passwordless connection and Passwordless OTP grant enabled.

Authentication concerns are intentionally separated:

- `AuthSessionContext` is the stable contract consumed by screens and
  navigation.
- `Auth0SessionProvider` implements real Auth0 and API behavior.
- `MockAuthSessionProvider` bypasses only the remote authentication logic; it
  preserves the phone and verification screens for local UI work.
- `AppProviders` selects the implementation from `EXPO_PUBLIC_AUTH_MODE`.
  `mock` mode throws at startup in production builds.

Navigation is split similarly: `AppNavigator` owns the session boundary,
`AuthNavigator` owns the signed-out flow, and `AuthenticatedNavigator` owns the
onboarding/home flow.
