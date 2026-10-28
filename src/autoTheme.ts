import { SeasonId, detectSeason, PRIMARY } from "./seasons";

/**
 * Auto theming:
 *  - The site always starts on the PRIMARY (Crystal Blue) palette — instant, no waiting.
 *  - In the background we scan the visitor's location (free ipwho.is lookup).
 *      · Visitor in India      → theme follows the Indian season in their state (calendar-based).
 *      · Visitor outside India → stays on the normal primary palette.
 *  - Visitor cap: after VISITOR_CAP visits in a day (per device), the scan is
 *    skipped and everyone gets the primary palette.
 *    NOTE: a true global counter needs a backend; this is a per-device counter
 *    that approximates the rule without adding any server cost.
 */

const VISITOR_CAP = 35;
const COUNTER_KEY = "harshu-visitor-counter";

function bumpDailyVisitors(): number {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(COUNTER_KEY);
    const data = raw ? JSON.parse(raw) : { date: today, count: 0 };
    if (data.date !== today) { data.date = today; data.count = 0; }
    data.count += 1;
    localStorage.setItem(COUNTER_KEY, JSON.stringify(data));
    return data.count;
  } catch (e) {
    return 1;
  }
}

async function fetchWithTimeout(url: string, ms: number): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Resolve the season the auto mode should use. Never throws. */
export async function resolveAutoSeason(): Promise<SeasonId> {
  try {
    const visits = bumpDailyVisitors();
    if (visits > VISITOR_CAP) return PRIMARY;
  } catch (e) { /* counter failed — continue with scan */ }

  try {
    const json = await fetchWithTimeout("https://ipwho.is/", 3500);
    if (json && json.success !== false) {
      if (json.country_code === "IN") return detectSeason();
    }
  } catch (e) { /* offline or blocked — keep primary */ }

  return PRIMARY;
}

