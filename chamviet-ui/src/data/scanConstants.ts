/**
 * Maps AI labels to application routes.
 * Keys must match labels produced by the YOLO model.
 */
export const ROUTE_MAP: Record<string, string> = {
  auco_laclongquan: "/story/auco-laclongquan",
};

/**
 * Minimum confidence threshold for auto-navigation.
 * Below this the user is prompted to try again.
 */
export const MIN_CONFIDENCE = 0.85;
