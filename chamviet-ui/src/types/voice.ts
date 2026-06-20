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
}

export interface VoiceSessionResult {
  blob: Blob;
  meta: VoiceMeta;
}
