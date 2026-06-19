import { buildApiUrl } from "../utils/apiBase";
import {
  getMockStoryConfig,
  getMockStoryConfigByVideoId,
  getFirstMockStoryConfig,
} from "./mockStoryConfigs";

function isMockEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK_STORY_CONFIG !== "false";
}

export interface StoryQA {
  question: string;
  answer: string;
}

export interface StoryConfig {
  componentId?: number;
  componentSku?: string;
  videoId?: string;
  videoUrl?: string;
  storyTitle: string;
  childAge: number;
  pieceCount?: number;
  storyContent: string;
  qaList: StoryQA[];
}

interface StoryConfigApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: StoryConfig;
  error?: string;
}

function shouldSkipNgrokBrowserWarning(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".ngrok-free.app");
  } catch {
    return false;
  }
}

export async function fetchStoryConfigByVideoId(videoId: string): Promise<StoryConfig | null> {
  if (isMockEnabled()) {
    return getMockStoryConfigByVideoId(videoId);
  }

  const url = buildApiUrl(
    import.meta.env.VITE_API_BASE_URL as string | undefined,
    `/api/public/puzzle-stories/video/${videoId}`,
  );
  const headers = shouldSkipNgrokBrowserWarning(url) ? { "ngrok-skip-browser-warning": "true" } : undefined;
  const response = await fetch(
    url,
    headers ? { headers } : undefined,
  );
  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as StoryConfigApiResponse;
  return payload.success ? payload.data ?? null : null;
}

export async function fetchStoryConfigBySlug(slug: string): Promise<StoryConfig | null> {
  if (isMockEnabled()) {
    return getMockStoryConfig(slug);
  }

  const url = buildApiUrl(
    import.meta.env.VITE_API_BASE_URL as string | undefined,
    `/api/public/puzzle-stories/slug/${slug}`,
  );
  const headers = shouldSkipNgrokBrowserWarning(url) ? { "ngrok-skip-browser-warning": "true" } : undefined;
  const response = await fetch(
    url,
    headers ? { headers } : undefined,
  );
  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as StoryConfigApiResponse;
  return payload.success ? payload.data ?? null : null;
}

export async function fetchDefaultStoryConfig(): Promise<StoryConfig | null> {
  if (isMockEnabled()) {
    return getFirstMockStoryConfig();
  }

  return fetchStoryConfigBySlug("auco-laclongquan");
}

export function extractYouTubeVideoId(value?: string): string | null {
  const source = value?.trim();
  if (!source) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(source)) return source;

  try {
    const url = new URL(source);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (host.endsWith("youtube.com")) {
      const watchId = url.searchParams.get("v");
      if (watchId) return watchId;

      const [kind, id] = url.pathname.split("/").filter(Boolean);
      if ((kind === "embed" || kind === "shorts") && id) return id;
    }
  } catch {
    return null;
  }

  return null;
}
