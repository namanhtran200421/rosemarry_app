import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { brut } from "../theme/tokens";

type FeatherName = ComponentProps<typeof Feather>["name"];
type CommunityName = ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * The design kit names its Lucide-style glyphs; each maps to the closest
 * bundled glyph. Feather covers the stroke set, and the few shapes it lacks
 * come from Material Community Icons so the app ships no SVG dependency.
 */
const GLYPHS = {
  ChevronLeft: ["f", "chevron-left"],
  ChevronRight: ["f", "chevron-right"],
  ChevronDown: ["f", "chevron-down"],
  ArrowLeft: ["f", "arrow-left"],
  Check: ["f", "check"],
  X: ["f", "x"],
  Plus: ["f", "plus"],
  Menu: ["f", "menu"],
  Search: ["f", "search"],
  Settings: ["f", "settings"],
  Send: ["f", "send"],
  MessageCircle: ["f", "message-circle"],
  Rewind: ["f", "rotate-ccw"],
  Lock: ["f", "lock"],
  Clock: ["f", "clock"],
  Globe: ["f", "globe"],
  Crosshair: ["f", "crosshair"],
  EyeOff: ["f", "eye-off"],
  Bell: ["f", "bell"],
  LogOut: ["f", "log-out"],
  Trash: ["f", "trash-2"],
  FileText: ["f", "file-text"],
  RefreshCw: ["f", "refresh-cw"],
  HeartOutline: ["f", "heart"],
  MapPin: ["f", "map-pin"],
  User: ["f", "user"],
  Users: ["f", "users"],
  Sliders: ["f", "sliders"],
  Moon: ["f", "moon"],
  Briefcase: ["f", "briefcase"],
  Target: ["f", "target"],
  Camera: ["f", "camera"],
  ShoppingBag: ["f", "shopping-bag"],
  Mic: ["f", "mic"],
  Coffee: ["f", "coffee"],
  Activity: ["f", "activity"],
  Music: ["f", "music"],
  Book: ["f", "book"],
  Film: ["f", "film"],
  Dots: ["f", "more-horizontal"],
  Mail: ["f", "mail"],
  Star: ["m", "star"],
  Star4: ["m", "star-four-points"],
  Heart: ["m", "heart"],
  SlashedHeart: ["m", "heart-off-outline"],
  Cards: ["m", "cards-outline"],
  Cigarette: ["m", "smoking"],
  GlassWater: ["m", "cup-water"],
  Leaf: ["m", "leaf"],
  Dumbbell: ["m", "dumbbell"],
  Brain: ["m", "brain"],
  Baby: ["m", "baby-face-outline"],
  GradCap: ["m", "school-outline"],
  Ruler: ["m", "ruler"],
  Flower: ["m", "flower-outline"],
  Racket: ["m", "tennis"],
  Waves: ["m", "waves"],
  Palette: ["m", "palette-outline"],
  Plane: ["m", "airplane"],
  Gem: ["m", "diamond-stone"],
  Wine: ["m", "glass-wine"],
  Gamepad: ["m", "gamepad-variant-outline"],
  Dog: ["m", "dog"],
  Bike: ["m", "bike"],
  Sparkles: ["m", "creation"],
  Google: ["m", "google"],
} as const satisfies Record<
  string,
  readonly ["f", FeatherName] | readonly ["m", CommunityName]
>;

export type IconName = keyof typeof GLYPHS;

export function isIconName(value: string): value is IconName {
  return value in GLYPHS;
}

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

/** A decorative glyph. Pair it with a visible or accessible text label. */
export function Icon({ name, size = 22, color = brut.ink }: IconProps) {
  const [set, glyph] = GLYPHS[name];
  const hidden = {
    accessibilityElementsHidden: true,
    importantForAccessibility: "no-hide-descendants",
  } as const;

  return set === "f" ? (
    <Feather {...hidden} name={glyph} size={size} color={color} />
  ) : (
    <MaterialCommunityIcons
      {...hidden}
      name={glyph}
      size={size}
      color={color}
    />
  );
}
