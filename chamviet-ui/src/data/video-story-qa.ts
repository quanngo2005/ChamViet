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

const API_BASE = "http://localhost:8081/api/public";

export async function fetchStoryConfigByVideoId(videoId: string): Promise<StoryConfig | null> {
  const response = await fetch(`${API_BASE}/puzzle-stories/video/${videoId}`);
  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as StoryConfigApiResponse;
  return payload.success ? payload.data ?? null : null;
}
