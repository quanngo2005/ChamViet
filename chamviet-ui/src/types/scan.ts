/** Single prediction returned by the AI vision recognition service. */
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

export interface NormalizedProductResult {
  kind: "product";
  status: string;
  productId: string;
  route: string;
  variantId?: string;
  componentId?: string;
  componentSku?: string;
  confidence?: number;
  raw: unknown;
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
  _bootstrap?: {
    fallbackUsed: boolean;
  };
}

export interface NormalizedErrorResult {
  kind: "error";
  status?: string;
  message: string;
  raw: unknown;
}

export type ScanResolution =
  | NormalizedPredictionResult
  | NormalizedProductResult
  | NormalizedStoryResult
  | NormalizedErrorResult;
