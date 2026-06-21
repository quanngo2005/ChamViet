import { MockVoiceService } from "./mockVoiceService";
import { buildApiUrl, resolveApiOrigin } from "../utils/apiBase";
import type { VoiceSessionStartRequest, VoiceMeta, VoiceSessionResult } from "../types/voice";

const VOICE_META_HEADER = "X-Voice-Meta";

export interface VoiceService {
  transcribe(
    audioBlob: Blob,
    sessionId?: string,
    signal?: AbortSignal,
  ): Promise<string>;

  startSession(
    request: VoiceSessionStartRequest,
    signal?: AbortSignal,
  ): Promise<VoiceSessionResult>;

  answerSession(
    audioBlob: Blob,
    sessionId: string,
    signal?: AbortSignal,
  ): Promise<VoiceSessionResult>;

  getNextQuestionAudio(
    sessionId: string,
    signal?: AbortSignal,
  ): Promise<VoiceSessionResult>;
}

export function createVoiceService(): VoiceService {
  if (import.meta.env.VITE_USE_MOCK_VOICE_SERVICE === "true") {
    return new MockVoiceService();
  }
  const backendUrl = resolveApiOrigin(
    import.meta.env.VITE_API_BASE_URL as string | undefined,
  );
  return new RealVoiceService(backendUrl);
}

function decodeVoiceMeta(value: string | null): VoiceMeta {
  if (!value) {
    throw new Error("Voice AI response omitted metadata");
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as VoiceMeta;
}

async function fetchVoice(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new Error("Mất kết nối khi gửi âm thanh. Kiểm tra mạng rồi thử lại nhé.");
  }
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  const text = await response.text().catch(() => "");
  if (!text) {
    return fallback;
  }

  try {
    const payload = JSON.parse(text) as {
      detail?: string;
      message?: string;
      error?: string;
    };
    return payload.error || payload.message || payload.detail || fallback;
  } catch {
    return text;
  }
}

async function buildVoiceError(response: Response, url: string): Promise<Error> {
  if (response.status === 413) {
    return new Error("Bản ghi âm quá lớn hoặc quá dài. Hãy trả lời ngắn hơn rồi thử lại nhé.");
  }
  if (response.status === 415) {
    return new Error("Định dạng âm thanh không đúng. Hãy tải lại trang và thử ghi âm lại nhé.");
  }

  const detail = await readErrorMessage(response, `${url} -> ${response.status}`);
  return new Error(detail);
}

async function readVoiceAudioResponse(
  response: Response,
  url: string,
): Promise<VoiceSessionResult> {
  if (!response.ok) {
    throw await buildVoiceError(response, url);
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error("Voice AI returned empty audio");
  }

  return {
    blob,
    meta: decodeVoiceMeta(response.headers.get(VOICE_META_HEADER)),
  };
}

export class RealVoiceService implements VoiceService {
  private readonly backendUrl: string;

  constructor(backendUrl: string) {
    this.backendUrl = backendUrl;
  }

  async transcribe(
    audioBlob: Blob,
    sessionId?: string,
    signal?: AbortSignal,
  ): Promise<string> {
    const url = buildApiUrl(this.backendUrl, "/api/v1/voice/transcribe");
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    if (sessionId?.trim()) {
      formData.append("session_id", sessionId);
    }

    const response = await fetchVoice(url, {
      method: "POST",
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw await buildVoiceError(response, url);
    }

    const payload = await response.json() as { text?: string };
    return typeof payload.text === "string" ? payload.text.trim() : "";
  }

  async startSession(
    request: VoiceSessionStartRequest,
    signal?: AbortSignal,
  ): Promise<VoiceSessionResult> {
    const url = buildApiUrl(this.backendUrl, "/api/v1/voice/session/start");
    const response = await fetchVoice(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });

    return readVoiceAudioResponse(response, url);
  }

  async answerSession(
    audioBlob: Blob,
    sessionId: string,
    signal?: AbortSignal,
  ): Promise<VoiceSessionResult> {
    const url = buildApiUrl(this.backendUrl, "/api/v1/voice/session/answer");
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("session_id", sessionId);

    const response = await fetchVoice(url, {
      method: "POST",
      body: formData,
      signal,
    });

    return readVoiceAudioResponse(response, url);
  }

  async getNextQuestionAudio(
    sessionId: string,
    signal?: AbortSignal,
  ): Promise<VoiceSessionResult> {
    const url = buildApiUrl(this.backendUrl, "/api/v1/voice/session/next-question");
    const params = new URLSearchParams({ session_id: sessionId });
    const response = await fetchVoice(`${url}?${params.toString()}`, {
      method: "POST",
      signal,
    });

    return readVoiceAudioResponse(response, url);
  }

}
