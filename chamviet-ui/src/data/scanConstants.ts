/**
 * Fallback maps for legacy development flows.
 * Production scan routing should prefer backend-enriched story/puzzle values.
 */
export const STORY_ROUTE_MAP: Record<string, string> = {
  auco_laclongquan: "/story/auco-laclongquan",
  laclongquan_auco: "/story/auco-laclongquan",
};

export function resolveLegacyLabelRoute(label: string): string | undefined {
  const key = label.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return STORY_ROUTE_MAP[key];
}

export function resolveStoryRoute(storySlug: string): string {
  return storySlug.startsWith("/story/") ? storySlug : `/story/${storySlug}`;
}

/**
 * Minimum confidence threshold for auto-navigation.
 * Below this the user is prompted to try again.
 */
export const MIN_CONFIDENCE = 0.85;
