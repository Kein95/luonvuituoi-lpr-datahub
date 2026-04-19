import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Country name → emoji flag (best-effort mapping) */
const countryFlags: Record<string, string> = {
  "China": "🇨🇳",
  "Brazil": "🇧🇷",
  "Ukraine": "🇺🇦",
  "Iran": "🇮🇷",
  "Europe (11 countries)": "🇪🇺",
  "Korea": "🇰🇷",
  "Bangladesh": "🇧🇩",
  "Taiwan": "🇹🇼",
  "France": "🇫🇷",
  "Vietnam": "🇻🇳",
};

export function getFlag(country: string): string {
  return countryFlags[country] || "🌐";
}

/** Generate dataset ID from name (kebab-case) */
export function toDatasetId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Track outbound link click via beacon API */
export function trackOutbound(datasetName: string, linkType: string, url: string) {
  try {
    const data = JSON.stringify({
      event: "outbound_click",
      dataset: datasetName,
      type: linkType,
      url,
      timestamp: new Date().toISOString(),
    });
    // Use sendBeacon for non-blocking tracking
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", data);
    }
    // Also store locally for analytics dashboard
    const clicks = JSON.parse(localStorage.getItem("lpr_clicks") || "[]");
    clicks.push({ dataset: datasetName, type: linkType, url, time: Date.now() });
    // Keep last 500 clicks
    if (clicks.length > 500) clicks.splice(0, clicks.length - 500);
    localStorage.setItem("lpr_clicks", JSON.stringify(clicks));
  } catch {
    // Silent fail — tracking should never break UX
  }
}
