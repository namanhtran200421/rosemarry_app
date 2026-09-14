const portrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=1000&q=80&fit=crop&crop=faces`;
const scene = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&h=650&q=80&fit=crop`;
const action = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=1000&q=80&fit=crop`;

/** Demo portrait and scenery photos, keyed the way the design kit names them. */
const PHOTO_URIS: Record<string, string> = {
  "jess-1": portrait("1494790108377-be9c29b29330"),
  "jess-2": portrait("1534528741775-53994a69daeb"),
  "jess-3": portrait("1502823403499-6ccfcf4fb453"),
  "soph-1": portrait("1544005313-94ddf0286df2"),
  "soph-2": portrait("1531123897727-8f129e1688ce"),
  "soph-3": portrait("1438761681033-6461ffad8d80"),
  "maya-1": portrait("1489424731084-a5d8b219a5bb"),
  "maya-2": portrait("1517841905240-472988babdf9"),
  "maya-3": portrait("1524250502761-1ac6f2e30d43"),
  "liam-1": portrait("1507003211169-0a1dd7228f2d"),
  "liam-2": portrait("1472099645785-5658abf4ff4e"),
  "liam-3": portrait("1506794778202-cad84cf45f1d"),
  "noah-1": portrait("1547425260-76bcadfb4f2c"),
  "noah-2": portrait("1500648767791-00dcc994a43e"),
  "noah-3": portrait("1463453091185-61582044d556"),
  "riley-1": portrait("1531427186611-ecfd6d936c79"),
  "riley-2": portrait("1568602471122-7832951cc4c5"),
  "riley-3": portrait("1500648767791-00dcc994a43e"),
  "guy-1": action("1510915361894-db8b60106cb1"),
  "guy-2": action("1556910103-1c02745aae4d"),
  "guy-3": action("1522075469751-3a6694fb2f61"),
  "guy-4": action("1571019613454-1cb2f99b2d8b"),
  "emelie-1": portrait("1438761681033-6461ffad8d80"),
  "abigail-1": portrait("1531123897727-8f129e1688ce"),
  "olivia-1": portrait("1517841905240-472988babdf9"),
  "chloe-1": portrait("1524250502761-1ac6f2e30d43"),
  "scene-latte": scene("1495474472287-4d71bcdd2085"),
  "scene-coffee": scene("1447933601403-0c6688de566e"),
  "scene-sunrise": scene("1470252649378-9c29740c9fa8"),
  "scene-city": scene("1506905925346-21bda4d32df4"),
};

export const DEMO_SCENES = [
  "scene-latte",
  "scene-coffee",
  "scene-sunrise",
  "scene-city",
];

/** Resolves a photo key to a URI; values that are already URIs pass through. */
export function photoUri(key: string | undefined): string | undefined {
  if (!key) {
    return undefined;
  }
  return /^(https?|file|data|blob):/.test(key) ? key : PHOTO_URIS[key];
}
