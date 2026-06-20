import axiosClient from "../api/axiosClient";
import { resolveLegacyLabelRoute } from "../data/scanConstants";
import { resolveStoryFromLabel } from "./visionResolveService";
import type {
  PredictionData,
  ScanResolution,
} from "../types/scan";

/**
 * Send an image to the AI backend for wooden card recognition.
 *
 * @param file     - The (preferably compressed) image file.
 * @param signal   - Optional AbortSignal to cancel the request on unmount.
 * @returns          Normalized scan result for the current production scan flow.
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

/**
 * Enhanced scan flow: calls vision-service for prediction, then resolves
 * story via BE or static fallback. Returns rich bootstrap info.
 */
export async function scanAndResolveStory(
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

  const raw = normalizeScanResponse(data);
  console.log(`[scanAndResolveStory] Vision result kind="${raw.kind}"`, raw.kind === "error" ? { message: raw.message } : { label: (raw as any).label, confidence: (raw as any).confidence });

  if (raw.kind === "story" && raw.raw && typeof raw.raw === "object") {
    const storyData = raw.raw as Record<string, unknown>;
    const label = (storyData.label as string) ?? "";
    console.log(`[scanAndResolveStory] Resolving story from label="${label}"`);
    const resolved = await resolveStoryFromLabel({
      request_id: `scan_${Date.now()}`,
      label,
      confidence: raw.confidence ?? 0,
    });
    console.log(`[scanAndResolveStory] Resolved slug="${resolved.storySlug}" fallback=${resolved.fallbackUsed}`);

    return {
      ...raw,
      route: `/story/${resolved.storySlug}`,
      storySlug: resolved.storySlug,
      videoId: resolved.videoId,
      raw: {
        ...storyData,
        fallbackUsed: resolved.fallbackUsed,
      },
      _bootstrap: {
        fallbackUsed: resolved.fallbackUsed,
      },
    };
  }

  if (raw.kind === "prediction" && raw.label) {
    console.log(`[scanAndResolveStory] Resolving story from prediction label="${raw.label}"`);
    const resolved = await resolveStoryFromLabel({
      request_id: `scan_${Date.now()}`,
      label: raw.label,
      confidence: raw.confidence,
    });
    console.log(`[scanAndResolveStory] Resolved slug="${resolved.storySlug}" fallback=${resolved.fallbackUsed}`);

    return {
      kind: "story",
      status: raw.status,
      route: `/story/${resolved.storySlug}`,
      storySlug: resolved.storySlug,
      videoId: resolved.videoId,
      confidence: raw.confidence,
      raw: {
        route: `/story/${resolved.storySlug}`,
        confidence: raw.confidence,
        fallbackUsed: resolved.fallbackUsed,
      },
      _bootstrap: {
        fallbackUsed: resolved.fallbackUsed,
      },
    };
  }

  return raw;
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
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const route = typeof payload.route === "string" ? payload.route.trim() : "";
  const productId = toOptionalString(payload.productId);
  const variantId = toOptionalString(payload.variantId);
  const componentId = toOptionalString(payload.componentId);
  const componentSku = typeof payload.componentSku === "string" ? payload.componentSku : undefined;

  const predictions = extractPredictions(payload.data);
  const bestPrediction = predictions.length > 0
    ? [...predictions].sort((a, b) => b.confidence - a.confidence)[0]
    : null;

  if (route) {
    const confidence = bestPrediction?.confidence;

    if (route.startsWith("/products/") && productId) {
      return {
        kind: "product",
        status,
        productId,
        route,
        variantId,
        componentId,
        componentSku,
        confidence,
        raw,
      };
    }

    if (route.startsWith("/story/") || route === "/story") {
      return {
        kind: "story",
        status,
        route,
        confidence,
        raw: {
          route,
          confidence,
          label: bestPrediction?.label,
        },
      };
    }
  }

  if (predictions.length > 0) {
    const fallbackRoute = resolveLegacyLabelRoute(bestPrediction!.label);

    if (fallbackRoute) {
      return {
        kind: "story",
        status,
        route: fallbackRoute,
        confidence: bestPrediction!.confidence,
        raw: {
          route: fallbackRoute,
          confidence: bestPrediction!.confidence,
          label: bestPrediction!.label,
        },
      };
    }

    return {
      kind: "error",
      status,
      message: "Sai rồi, hãy chụp hoặc chọn ảnh khác",
      raw: bestPrediction,
    };
  }

  return {
    kind: "error",
    status,
    message: message || "Sai rồi, hãy chụp hoặc chọn ảnh khác",
    raw,
  };
}

function toOptionalString(value: unknown): string | undefined {
  if (typeof value === "number" || typeof value === "string") {
    const normalized = String(value).trim();
    return normalized ? normalized : undefined;
  }

  return undefined;
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

