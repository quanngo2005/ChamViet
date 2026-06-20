import { buildApiUrl } from "../utils/apiBase";
import { findStaticStoryByLabel } from "../data/staticStoryRegistry";
import type {
  VisionResolveRequest,
  VisionResolveResult,
  VisionResolveSuccess,
  BootstrapSessionResult,
} from "../types/visionResolve";

const RESOLVE_TIMEOUT_MS = 8000;

async function postResolveStory(
  request: VisionResolveRequest,
): Promise<VisionResolveResult> {
  const url = buildApiUrl(
    import.meta.env.VITE_API_BASE_URL as string | undefined,
    "/api/v1/vision/resolve-story",
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RESOLVE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return errorBody ?? {
        request_id: request.request_id,
        error: { code: "HTTP_ERROR", message: `HTTP ${response.status}` },
      };
    }

    const data = await response.json();
    return data as VisionResolveResult;
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      request_id: request.request_id,
      error: {
        code: "BACKEND_UNAVAILABLE",
        message: error instanceof Error ? error.message : "Story service temporarily unavailable",
      },
    };
  }
}

function isResolveSuccess(result: VisionResolveResult): result is VisionResolveSuccess {
  return "storySlug" in result && !("error" in result);
}

export async function resolveStoryFromLabel(
  request: VisionResolveRequest,
): Promise<BootstrapSessionResult> {
  const result = await postResolveStory(request);
  const label = request.label;

  if (isResolveSuccess(result)) {
    console.log(`[resolveStory] BE success: slug="${result.storySlug}"`);
    return {
      storySlug: result.storySlug,
      productRoute: result.productRoute,
      videoId: result.videoId,
      fallbackUsed: false,
    };
  }

  const staticEntry = findStaticStoryByLabel(label);
  if (staticEntry) {
    console.log(`[resolveStory] BE unavailable, static fallback: slug="${staticEntry.storySlug}" label="${label}"`);
    return {
      storySlug: staticEntry.storySlug,
      productRoute: `/story/${staticEntry.storySlug}`,
      videoId: staticEntry.videoId,
      fallbackUsed: true,
      title: staticEntry.title,
    };
  }

  console.warn(`[resolveStory] No resolution for label="${label}"`);
  throw new Error("Không tìm thấy câu chuyện phù hợp cho nhãn đã nhận diện.");
}



