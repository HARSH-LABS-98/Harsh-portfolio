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

/** The primary identity of the site — Alaskan Blue (first blue from the reference) */
export const PRIMARY: SeasonId = "winter";

export const SEASONS: Record<SeasonId, Season> = {
  winter: {
    id: "winter", name: "Winter", hindi: "Shishir", emoji: "❄️",
    accent: "#71AAE5", soft: "#EAF3FC", deep: "#2B5B98",
    particle: "snow", tagline: "Alaskan blue, calm and clear."
  },
  summer: {
    id: "summer", name: "Summer", hindi: "Grishma", emoji: "☀️",
    accent: "#E9C46A", soft: "#FAF4E3", deep: "#8C6D2F",
    particle: "mote", tagline: "Soft sunlight, slow afternoons."
  },
  monsoon: {
    id: "monsoon", name: "Monsoon", hindi: "Varsha", emoji: "🌧️",
    accent: "#708090", soft: "#E8EDF2", deep: "#2E3A46",
    particle: "rain", tagline: "Petrichor, chai and fresh code."
  },
  autumn: {
    id: "autumn", name: "Autumn", hindi: "Sharad", emoji: "🍂",
    accent: "#BE4B42", soft: "#F8ECEB", deep: "#5E211E",
    particle: "petal", tagline: "Festival skies, crimson light."
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
