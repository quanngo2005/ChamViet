/** Single prediction returned by the legacy AI vision service. */
export interface PredictionData {
  label: string;
  confidence: number;
  box: number[][];
}

export interface StoryMatchData {
  storySlug?: string;
  storyTitle?: string;
  videoId?: string;
  route?: string;
  confidence?: number;
  [key: string]: unknown;
}

export interface NormalizedPredictionResult {
  kind: "prediction";
  status: string;
  label: string;
  confidence: number;
  box: number[][];
  route?: string;
  raw: PredictionData;
}

export interface NormalizedStoryResult {
  kind: "story";
  status: string;
  route: string;
  storySlug?: string;
  storyTitle?: string;
  videoId?: string;
  confidence?: number;
  raw: StoryMatchData;
}

export interface NormalizedErrorResult {
  kind: "error";
  status?: string;
  message: string;
  raw: unknown;
}

export type ScanResolution = NormalizedPredictionResult | NormalizedStoryResult | NormalizedErrorResult;
