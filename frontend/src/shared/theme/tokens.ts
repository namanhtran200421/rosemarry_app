export const colors = {
  background: "#FFF8FA",
  surface: "#FFFFFF",
  text: "#291C22",
  textMuted: "#705E66",
  primary: "#A13D62",
  primaryPressed: "#7F2F4C",
  border: "#E5D4DB",
  danger: "#9C3048",
  dangerSurface: "#FFF0F3",
  focus: "#315C9B",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 40,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 38, lineHeight: 44 },
  title: { fontSize: 30, lineHeight: 36 },
  body: { fontSize: 16, lineHeight: 24 },
  button: { fontSize: 16, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
} as const;
