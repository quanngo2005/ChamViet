export interface VisionResolveRequest {
  request_id: string;
  label: string;
  confidence: number;
}

export interface VisionResolveSuccess {
  request_id: string;
  storySlug: string;
  productRoute: string;
  videoId: string;
  fallbackUsed: boolean;
}

export interface VisionResolveError {
  request_id: string;
  error: {
    code: string;
    message: string;
  };
}

export type VisionResolveResult = VisionResolveSuccess | VisionResolveError;

export interface FallbackResolveResult {
  fallbackUsed: true;
  storySlug: string;
  videoId: string;
  title: string;
}

export interface BootstrapSessionResult {
  storySlug: string;
  productRoute: string;
  videoId: string;
  fallbackUsed: boolean;
  title?: string;
}
