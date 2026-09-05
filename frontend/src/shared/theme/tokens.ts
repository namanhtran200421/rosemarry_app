/**
 * Rosemarry design tokens — React Native runtime adapter.
 *
 * Ported from the Claude Design project `tokens/*.css`
 * (project d06839d4-18ff-4554-a01e-d9af25785706). DESIGN.md documents the
 * rationale; this file is the runtime source of truth and must change in the
 * same changeset.
 */

/** Raw brand ramps. Component code should prefer the semantic aliases below. */
export const palette = {
  pink900: "#7D0D34",
  pink800: "#A4134A",
  pink700: "#F27FA8",
  pink600: "#EF4F83",
  pink500: "#F472A8",
  pink300: "#F7A6C8",
  pink100: "#FBD7E6",
  pink50: "#FDEEF4",

  cream50: "#FBF2E9",

  red700: "#A8153A",
  red600: "#D81E4A",
  red100: "#F9D5DE",

  orange500: "#F4853A",
  orange400: "#F9A45F",
  orange300: "#FFC08A",
  orange100: "#FFE7D1",

  ink: "#241A1D",
  gray700: "#4D3F43",
  gray500: "#857076",
  gray400: "#B2A3A8",
  gray300: "#D8CCD0",
  gray200: "#ECE1E4",
  gray100: "#F6EEF0",
  white: "#FFFFFF",
} as const;

export const colors = {
  background: palette.cream50,
  surface: palette.white,
  surfaceTint: palette.pink50,
  surfaceSunken: palette.gray100,

  text: palette.ink,
  textSecondary: palette.gray500,
  textMuted: palette.gray500,
  /** Placeholder and decorative text only — too light for body copy. */
  textFaint: palette.gray400,
  onPrimary: palette.ink,

  border: palette.gray200,
  borderStrong: palette.gray300,

  primary: palette.pink700,
  primaryHover: palette.pink600,
  primaryPressed: palette.pink900,
  primaryTint: palette.pink50,
  /**
   * Deep brand pink. White text on `primary` measures 2.5:1, which fails
   * WCAG AA; this reads 7.5:1 and is the accessible substitute for any
   * pink surface that carries white text. See DESIGN.md.
   */
  primaryAccessible: palette.pink800,

  accentRed: palette.red600,
  accentOrange: palette.orange400,
  progressTrack: palette.ink,

  success: "#1F9D5F",
  danger: palette.red600,
  dangerStrong: palette.red700,
  dangerSurface: palette.red100,

  link: palette.red600,
  focus: palette.pink700,
  focusRing: "rgba(242, 127, 168, 0.35)",
  selectedRing: palette.pink700,
  overlayScrim: "rgba(12, 20, 17, 0.55)",
} as const;

/** 4px base scale. Numeric keys mirror the CSS `--space-*` tokens. */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl2: 20,
  xl: 24,
  xxl2: 32,
  xxl: 40,
  xxl3: 48,
  xxl4: 64,
} as const;

/** Layout constants lifted from `--screen-pad-*`, `--field-h`, `--control-h`. */
export const layout = {
  screenPadX: 24,
  screenPadY: 20,
  stackGap: 12,
  fieldHeight: 56,
  controlHeight: 44,
  contentMaxWidth: 440,
} as const;

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const;

/**
 * Soft, low, warm-tinted elevation. The design never uses a hard drop
 * shadow; selection is expressed with a pink ring instead.
 */
export const shadows = {
  xs: {
    shadowColor: "#0C1411",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#0C1411",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: "#0C1411",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0C1411",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 8,
  },
};

/**
 * DynaPuff — the rounded display face the design specifies for every text
 * style. React Native selects a weight by face name rather than by
 * `fontWeight`, so styles set `fontFamily` from this map and omit weight.
 * Loaded in App.tsx via `useFonts`.
 */
export const fonts = {
  regular: "DynaPuff_400Regular",
  medium: "DynaPuff_500Medium",
  semibold: "DynaPuff_600SemiBold",
  bold: "DynaPuff_700Bold",
} as const;

/**
 * Mobile-first scale. Line heights resolve the CSS ratios (1.15 / 1.3 / 1.5)
 * to absolute values, and letter spacing resolves `-0.02em` per size.
 */
export const typography = {
  display: { fontSize: 30, lineHeight: 35, letterSpacing: -0.6 },
  title: { fontSize: 26, lineHeight: 30, letterSpacing: -0.52 },
  h2: { fontSize: 22, lineHeight: 25, letterSpacing: -0.44 },
  h3: { fontSize: 18, lineHeight: 23, letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  button: { fontSize: 16, lineHeight: 20, letterSpacing: 0 },
  callout: { fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  sub: { fontSize: 14, lineHeight: 21, letterSpacing: 0 },
  caption: { fontSize: 13, lineHeight: 20, letterSpacing: 0 },
  micro: { fontSize: 12, lineHeight: 18, letterSpacing: 0 },
  /** Brief uppercase eyebrows only. */
  eyebrow: { fontSize: 12, lineHeight: 18, letterSpacing: 0.48 },
} as const;

/** Press feedback is a quiet scale-down — no color flip, no ripple. */
export const motion = {
  pressScale: 0.98,
  pressScaleCompact: 0.94,
  durationMs: 130,
} as const;
