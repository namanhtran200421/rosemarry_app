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

Environment values are grouped in `.env`. To preview the app on a simulator
without an ID document or camera, start it in development mock mode:

```sh
EXPO_PUBLIC_AUTH_MODE=mock npx expo run:ios
# or: EXPO_PUBLIC_AUTH_MODE=mock npx expo run:android
```

For an already installed native debug build, use
`EXPO_PUBLIC_AUTH_MODE=mock npx expo start --dev-client --lan` and open the app.
Mock mode accepts any valid international phone number and any 4–8 digit SMS
code. Tap **Verify my age** on the ID screen to simulate approval. It then uses
the local onboarding flow, so it does not exercise the backend onboarding API.
Production builds reject mock mode.

This project includes `react-native-auth0`, so it requires a native debug or
development build; Expo Go cannot run it. For a physical phone connected to
your computer, use `npx expo run:ios --device` or
`npx expo run:android --device`. Keep the phone and computer on the same network
for Metro, and use a phone-reachable `EXPO_PUBLIC_API_URL` for backend requests
instead of `localhost`.

To test real ID verification on an iPhone, leave `EXPO_PUBLIC_AUTH_MODE=auth0`,
start the backend, and find the Mac's Wi-Fi address with `ipconfig getifaddr en0`.
Check `http://<Mac-Wi-Fi-address>:3000/health` in the iPhone's Safari browser.
Then install and start the app with:

```sh
EXPO_PUBLIC_API_URL="http://$(ipconfig getifaddr en0):3000" npx expo run:ios --device
```

Allow local network access when iOS asks. Didit's webhook is the main path for
verification results. The app also asks the backend to reconcile a missing result
with Didit when you return or tap **Check again**, so local testing can continue
without a public webhook endpoint.

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

Backend onboarding now uses stage endpoints and restores saved answers on
return. The following product integrations still need work before release:

- Development photo uploads are stored on the backend's local disk. Production
  needs durable object storage before release.
- The notification step does not yet request operating-system permission.
- Terms and privacy content must be replaced with approved legal copy.

These are intentionally documented rather than hidden behind frontend-only
stubs. Their API shapes and failure behavior require product/backend decisions.
