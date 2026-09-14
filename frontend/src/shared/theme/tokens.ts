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
  /** Secondary copy. Darker than the source `#857076`, which reads 4.3:1. */
  gray600: "#7A676D",
  gray500: "#857076",
  gray400: "#B2A3A8",
  gray300: "#D8CCD0",
  gray200: "#ECE1E4",
  gray100: "#F6EEF0",
  white: "#FFFFFF",

  /* Neo-brutalist register: outlines, paper and the four state fills. */
  brutInk: "#17181F",
  brutPaper: "#FDF8EE",
  /** Source `#7C5CFF` gives white text 4.35:1; this passes AA at 4.76:1. */
  brutPurple: "#7552FF",
  brutYellow: "#F5C33B",
  brutPink: "#FF5FA2",
  brutGreen: "#2ECF96",
  brutDisabled: "#E6E1D6",
} as const;

export const colors = {
  background: palette.brutPaper,
  /** Discover's photo cards sit on the warmer cream. */
  backgroundWarm: palette.cream50,
  surface: palette.white,
  surfaceTint: palette.pink50,
  surfaceSunken: palette.gray100,

  text: palette.brutInk,
  textSecondary: palette.gray600,
  textMuted: palette.gray600,
  /** Placeholder and decorative text only — too light for body copy. */
  textFaint: palette.gray400,
  onPrimary: palette.brutInk,

  border: palette.brutInk,
  borderStrong: palette.brutInk,

  primary: palette.pink700,
  primaryHover: palette.pink600,
  primaryPressed: palette.pink900,
  primaryTint: palette.pink50,
  /**
   * Deep brand pink. White text on `primary` measures 2.5:1, which fails
   * WCAG AA; this reads 7.5:1 and is the accessible substitute for any
   * pink text on a light ground. See DESIGN.md.
   */
  primaryAccessible: palette.pink800,

  accentRed: palette.red600,
  accentOrange: palette.orange400,
  progressTrack: palette.brutInk,

  success: palette.brutGreen,
  danger: palette.red600,
  dangerStrong: palette.red700,
  dangerSurface: palette.red100,

  link: palette.brutInk,
  focus: palette.pink700,
  overlayScrim: "rgba(23, 24, 31, 0.45)",
} as const;

/**
 * The brutalist material: every surface is a hard-outlined block with a
 * solid offset drop, and each fill states what something is.
 */
export const brut = {
  ink: palette.brutInk,
  paper: palette.brutPaper,
  purple: palette.brutPurple,
  yellow: palette.brutYellow,
  pink: palette.brutPink,
  green: palette.brutGreen,
  disabled: palette.brutDisabled,
  white: palette.white,
  /** Category / emphasis blocks, in rotation order. */
  blocks: [
    palette.brutPurple,
    palette.brutYellow,
    palette.brutPink,
    palette.brutGreen,
  ],
  border: 2,
  borderThin: 1.5,
} as const;

/** Hard offset shadow with no blur — depth reads as the offset size. */
export function drop(offset: number, color: string = brut.ink): string {
  return offset > 0 ? `${offset}px ${offset}px 0 ${color}` : "none";
}

/** Icon and label color for content placed on a block fill. */
export function onBlock(fill: string): string {
  return fill === brut.purple || fill === colors.accentRed || fill === brut.ink
    ? palette.white
    : brut.ink;
}

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
  fieldHeight: 54,
  controlHeight: 44,
  contentMaxWidth: 440,
  /** Clearance below tab content so nothing hides behind the floating bar. */
  tabBarClearance: 96,
} as const;

export const radii = {
  tag: 6,
  xs: 8,
  block: 10,
  sm: 12,
  card: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const;

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
  hero: { fontSize: 34, lineHeight: 38, letterSpacing: -0.4 },
  display: { fontSize: 30, lineHeight: 34, letterSpacing: -0.6 },
  title: { fontSize: 26, lineHeight: 30, letterSpacing: -0.52 },
  h2: { fontSize: 22, lineHeight: 26, letterSpacing: -0.44 },
  h3: { fontSize: 18, lineHeight: 23, letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  button: { fontSize: 16, lineHeight: 20, letterSpacing: 0 },
  callout: { fontSize: 15, lineHeight: 22, letterSpacing: 0 },
  sub: { fontSize: 14, lineHeight: 21, letterSpacing: 0 },
  caption: { fontSize: 13, lineHeight: 19, letterSpacing: 0 },
  micro: { fontSize: 12, lineHeight: 17, letterSpacing: 0 },
  /** Uppercase micro-labels on tags ("4 OF 6 HAVE PLAYED"). */
  tag: { fontSize: 10.5, lineHeight: 14, letterSpacing: 0.84 },
} as const;

/** Press feedback pushes the block into its own shadow — no color flip. */
export const motion = {
  pressShift: 2,
  durationMs: 130,
} as const;
