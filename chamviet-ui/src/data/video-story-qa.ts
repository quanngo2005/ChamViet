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

export async function fetchStoryConfigByVideoId(videoId: string): Promise<StoryConfig | null> {
  const response = await fetch(
    buildApiUrl(import.meta.env.VITE_API_BASE_URL as string | undefined, `/api/public/puzzle-stories/video/${videoId}`),
  );
  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as StoryConfigApiResponse;
  return payload.success ? payload.data ?? null : null;
}
