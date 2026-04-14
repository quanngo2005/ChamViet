/** Single prediction returned by the AI service. */
export interface PredictionData {
  label: string;
  confidence: number;
  box: number[][];
}

/** Top-level response from POST /api/v1/ai/ai-connection. */
export interface AiResponse {
  status: string;
  data: PredictionData[];
}
