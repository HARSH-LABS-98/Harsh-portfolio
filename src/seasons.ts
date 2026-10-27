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

/** The primary identity of the site — Crystal Blue (from the reference palette) */
export const PRIMARY: SeasonId = "winter";

export const SEASONS: Record<SeasonId, Season> = {
  winter: {
    id: "winter", name: "Winter", hindi: "Shishir", emoji: "❄️",
    accent: "#1E90FF", soft: "#E6F0FA", deep: "#1B4E8F",
    particle: "snow", tagline: "Crystal blue, calm and clear."
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
    accent: "#C05A3C", soft: "#F6E9E2", deep: "#6E2E1C",
    particle: "petal", tagline: "Festival skies, terracotta light."
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
