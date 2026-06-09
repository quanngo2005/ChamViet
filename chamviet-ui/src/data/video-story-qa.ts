import { buildApiUrl } from "../utils/apiBase";

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
