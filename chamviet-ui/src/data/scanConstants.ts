/**
 * Maps AI labels to application routes.
 * Keys must match labels produced by the YOLO model.
 */
export const ROUTE_MAP: Record<string, string> = {
  auco_laclongquan: "/story/auco-laclongquan",
};

export function resolveLegacyLabelRoute(label: string): string | undefined {
  return ROUTE_MAP[label];
}

export function resolveStoryRoute(storySlug: string): string {
  return storySlug.startsWith("/story/") ? storySlug : `/story/${storySlug}`;
}

/**
 * Minimum confidence threshold for auto-navigation.
 * Below this the user is prompted to try again.
 */
export const MIN_CONFIDENCE = 0.85;
