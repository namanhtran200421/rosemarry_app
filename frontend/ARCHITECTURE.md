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
- Public runtime configuration is validated in `shared/config`. Add new keys to
  `.env.example` without committing real credentials.

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

Run `npm run lint` before merging. The lint configuration enforces the layer
direction above and rejects source files over 300 non-blank, non-comment lines.

The layer is named `application` rather than `app` because Expo reserves
`src/app` for Expo Router projects. This app currently uses React Navigation.
