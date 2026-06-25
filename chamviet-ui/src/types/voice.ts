/** Explicit voice session readiness state for StoryPage bootstrap convergence. */
export type VoiceSessionState =
  | "initializing"  // session start in progress
  | "ready"         // real session active (scan preload or started)
  | "fallback"      // content loaded but voice unavailable
  | "unavailable";  // backend/voice unreachable

import type { StoryQA } from "../data/video-story-qa";

export interface VoiceSessionStartRequest {
  session_id: string;
  story_title: string;
  story_content: string;
  child_age: number;
  qa_list: StoryQA[];
}

export interface VoiceMeta {
  text?: string;
  phase?: string;
  session_id?: string;
  transcript?: string;
  intent?: string;
  question_index?: number;
  total_questions?: number;
  completed?: boolean;
  score?: number;
  is_correct?: boolean;
  question?: string;
  question_text?: string;
  feedback_text?: string;
  next_question_text?: string;
  next_question_index?: number;
}

export interface VoiceSessionResult {
  blob: Blob;
  meta: VoiceMeta;
}
