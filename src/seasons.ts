export type SeasonId = "winter" | "summer" | "monsoon" | "autumn";
export type ParticleKind = "snow" | "mote" | "rain" | "petal";

export interface Season {
  id: SeasonId;
  name: string;
  hindi: string;
  emoji: string;
  accent: string;
  soft: string;
  deep: string;
  particle: ParticleKind;
  tagline: string;
}

export const SEASONS: Record<SeasonId, Season> = {
  winter: {
    id: "winter", name: "Winter", hindi: "Shishir", emoji: "❄️",
    accent: "#6E93C9", soft: "#EAF1FA", deep: "#33517A",
    particle: "snow", tagline: "Frost-tipped glass, warm hearts."
  },
  summer: {
    id: "summer", name: "Summer", hindi: "Grishma", emoji: "☀️",
    accent: "#E5924A", soft: "#FBEFDD", deep: "#8A4E1C",
    particle: "mote", tagline: "Marigold mornings, mango afternoons."
  },
  monsoon: {
    id: "monsoon", name: "Monsoon", hindi: "Varsha", emoji: "🌧️",
    accent: "#4C9B9E", soft: "#E0F1F0", deep: "#1F5A5D",
    particle: "rain", tagline: "Petrichor, chai and fresh code."
  },
  autumn: {
    id: "autumn", name: "Autumn", hindi: "Sharad", emoji: "🍂",
    accent: "#C9A227", soft: "#FAF0D7", deep: "#7A5A0E",
    particle: "petal", tagline: "Festival skies, marigold light."
  }
};

export const ORDER: SeasonId[] = ["winter", "summer", "monsoon", "autumn"];

/** India (IMD-style) season by month */
export function detectSeason(): SeasonId {
  const m = new Date().getMonth();
  if (m === 11 || m <= 1) return "winter";
  if (m >= 2 && m <= 4) return "summer";
  if (m >= 5 && m <= 8) return "monsoon";
  return "autumn";
}
