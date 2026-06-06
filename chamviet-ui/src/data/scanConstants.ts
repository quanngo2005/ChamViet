/**
 * Fallback maps for legacy development flows.
 * Production scan routing should prefer backend-enriched `productId` values.
 */
export const PRODUCT_ID_MAP: Record<string, string> = {
  auco_laclongquan: "1",
};

export function resolveLegacyLabelProductId(label: string): string | undefined {
  return PRODUCT_ID_MAP[label];
}

export function resolveLegacyLabelRoute(label: string): string | undefined {
  const productId = resolveLegacyLabelProductId(label);
  return productId ? `/products/${productId}` : undefined;
}

export function resolveStoryRoute(storySlug: string): string {
  return storySlug.startsWith("/story/") ? storySlug : `/story/${storySlug}`;
}

/**
 * Minimum confidence threshold for auto-navigation.
 * Below this the user is prompted to try again.
 */
export const MIN_CONFIDENCE = 0.85;
