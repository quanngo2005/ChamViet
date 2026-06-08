import axiosClient from "../api/axiosClient";
import { resolveLegacyLabelRoute } from "../data/scanConstants";
import type {
  PredictionData,
  ScanResolution,
} from "../types/scan";

/**
 * Send an image to the AI backend for wooden card recognition.
 *
 * @param file     - The (preferably compressed) image file.
 * @param signal   - Optional AbortSignal to cancel the request on unmount.
 * @returns          Normalized scan result for the supported demo puzzle labels.
 */
export async function scanImage(
  file: File,
  signal?: AbortSignal,
): Promise<ScanResolution> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post<unknown>(
    "/ai/ai-connection",
    formData,
    { signal },
  );

  return normalizeScanResponse(data);
}

function normalizeScanResponse(raw: unknown): ScanResolution {
  if (!raw || typeof raw !== "object") {
    return {
      kind: "error",
      message: "AI response is empty",
      raw,
    };
  }

  const payload = raw as Record<string, unknown>;
  const status = typeof payload.status === "string" ? payload.status : "unknown";

  const predictions = extractPredictions(payload.data);
  if (predictions.length > 0) {
    const best = [...predictions].sort((a, b) => b.confidence - a.confidence)[0];
    const route = resolveLegacyLabelRoute(best.label);

    if (route) {
      return {
        kind: "story",
        status,
        route,
        confidence: best.confidence,
        raw: {
          route,
          confidence: best.confidence,
        },
      };
    }

    return {
      kind: "error",
      status,
      message: "Recognized label is not supported by the demo scanner",
      raw: best,
    };
  }

  return {
    kind: "error",
    status,
    message: "AI response does not contain a supported scan payload",
    raw,
  };
}

function extractPredictions(value: unknown): PredictionData[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const candidate = entry as Record<string, unknown>;
      const label = candidate.label;
      const confidence = candidate.confidence;
      const box = candidate.box;

      if (typeof label !== "string" || typeof confidence !== "number" || !Array.isArray(box)) {
        return null;
      }

      return {
        label,
        confidence,
        box: box as number[][],
      };
    })
    .filter((item): item is PredictionData => item !== null);
}

