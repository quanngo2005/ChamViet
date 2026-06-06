import axiosClient from "../api/axiosClient";
import {
  resolveLegacyLabelProductId,
  resolveLegacyLabelRoute,
  resolveStoryRoute,
} from "../data/scanConstants";
import { resolveStoryRouteFromName } from "../data/storyVideoRegistry";
import type {
  PredictionData,
  ScanResolution,
  StoryMatchData,
} from "../types/scan";

/**
 * Send an image to the AI backend for wooden card recognition.
 *
 * @param file     - The (preferably compressed) image file.
 * @param signal   - Optional AbortSignal to cancel the request on unmount.
 * @returns          Normalized scan result that can handle both legacy labels and future story payloads.
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

  const productPayload = extractProductMatchData(payload);
  if (productPayload?.productId) {
    return {
      kind: "product",
      status,
      productId: productPayload.productId,
      route: productPayload.route ?? `/products/${productPayload.productId}`,
      variantId: productPayload.variantId,
      componentId: productPayload.componentId,
      componentSku: productPayload.componentSku,
      confidence: productPayload.confidence,
      raw,
    };
  }

  const storyPayload = extractStoryMatchData(payload);
  if (storyPayload) {
    const route =
      storyPayload.route
      ?? (storyPayload.storySlug ? resolveStoryRoute(storyPayload.storySlug) : undefined)
      ?? resolveStoryRouteFromName(storyPayload.storyTitle);
    if (route) {
      return {
        kind: "story",
        status,
        route,
        storySlug: storyPayload.storySlug,
        storyTitle: storyPayload.storyTitle,
        videoId: storyPayload.videoId,
        confidence: storyPayload.confidence,
        raw: storyPayload,
      };
    }
  }

  const predictions = extractPredictions(payload.data);
  if (predictions.length > 0) {
    const best = [...predictions].sort((a, b) => b.confidence - a.confidence)[0];
    const productId = resolveLegacyLabelProductId(best.label);
    const route = resolveLegacyLabelRoute(best.label);

    if (productId && route) {
      return {
        kind: "product",
        status,
        productId,
        route,
        confidence: best.confidence,
        raw,
      };
    }

    return {
      kind: "prediction",
      status,
      label: best.label,
      confidence: best.confidence,
      box: best.box,
      route,
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

function extractStoryMatchData(payload: Record<string, unknown>): StoryMatchData | null {
  const candidates = [payload, payload.data, payload.result, payload.story, payload.payload];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;

    const record = candidate as Record<string, unknown>;
    const storySlug = readString(record, "storySlug", "story_slug", "slug");
    const storyTitle = readString(record, "storyTitle", "story_title", "title");
    const videoId = readString(record, "videoId", "video_id");
    const route = readString(record, "route", "redirectTo", "redirect_to");
    const confidence = readNumber(record, "confidence", "score");

    if (storySlug || storyTitle || videoId || route || typeof confidence === "number") {
      return {
        storySlug,
        storyTitle,
        videoId,
        route,
        confidence,
      };
    }
  }

  return null;
}

function extractProductMatchData(payload: Record<string, unknown>) {
  const candidates = [payload, payload.data, payload.result, payload.story, payload.payload];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;

    const record = candidate as Record<string, unknown>;
    const productId = readIdentifier(record, "productId", "product_id");
    const variantId = readIdentifier(record, "variantId", "variant_id");
    const componentId = readIdentifier(record, "componentId", "component_id");
    const componentSku = readString(record, "componentSku", "component_sku");
    const route = readString(record, "route", "redirectTo", "redirect_to");
    const confidence = readNumber(record, "confidence", "score");

    if (productId) {
      return {
        productId,
        variantId,
        componentId,
        componentSku,
        route,
        confidence,
      };
    }
  }

  return null;
}

function readString(record: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function readIdentifier(record: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function readNumber(record: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}
