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
  "Japan": "🇯🇵",
  "USA": "🇺🇸",
  "India": "🇮🇳",
  "Germany": "🇩🇪",
  "Thailand": "🇹🇭",
  "Indonesia": "🇮🇩",
  "Malaysia": "🇲🇾",
  "Turkey": "🇹🇷",
  "Pakistan": "🇵🇰",
  "Mexico": "🇲🇽",
  "Argentina": "🇦🇷",
  "Spain": "🇪🇸",
  "Italy": "🇮🇹",
  "Poland": "🇵🇱",
  "Romania": "🇷🇴",
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
