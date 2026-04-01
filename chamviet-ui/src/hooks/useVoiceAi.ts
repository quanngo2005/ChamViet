import { useState, useRef, useCallback } from "react";
import type { StoryConfig } from "../data/video-story-qa";

// ── Constants ────────────────────────────────────────────────────────────────
const COSINE_CORRECT  = 0.6;
const COSINE_UNCLEAR  = 0.35;

// ── Types ────────────────────────────────────────────────────────────────────
export type SessionPhase =
  | "idle"
  | "loading"
  | "greeting"
  | "asking"
  | "listening"
  | "evaluating"
  | "responding"
  | "done";

interface UseVoiceAIOptions {
  backendUrl: string;                               // Spring API base, e.g. "http://localhost:8081"
  storyConfig?: StoryConfig;
  onUserText?: (text: string) => void;              // STT returned user's speech
  onAiMessage?: (text: string) => void;             // AI generated a response
  onQuestionRead?: (questionText: string) => void;  // Next question was read
  onSessionEnd?: (score: number, total: number) => void;
  onError?: (error: unknown) => void;
}

// ── Helper: POST JSON ────────────────────────────────────────────────────────
async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Helper: speak text via TTS ───────────────────────────────────────────────
async function speakViaApi(backendUrl: string, text: string): Promise<void> {
  const res = await fetch(`${backendUrl}/api/v1/voice/speak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    console.error(`TTS failed: ${res.status} for text: "${text.slice(0, 50)}..."`);
    return;
  }
  const blob = await res.blob();
  if (blob.size === 0) {
    console.error(`TTS returned empty audio for: "${text.slice(0, 50)}..."`);
    return;
  }
  const url = URL.createObjectURL(blob);
  return new Promise<void>((resolve) => {
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
    audio.play().catch(() => resolve());
  });
}

// ── Helper: encode raw PCM Float32 samples → WAV Blob ─────────────────────────
function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  // fmt chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);           // chunk size
  view.setUint16(20, 1, true);            // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  // data chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Write PCM samples (float32 → int16)
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useVoiceAI({
  backendUrl,
  storyConfig,
  onUserText,
  onAiMessage,
  onQuestionRead,
  onSessionEnd,
  onError,
}: UseVoiceAIOptions) {
  // ── State ────────────────────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>("idle");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const processorRef     = useRef<ScriptProcessorNode | null>(null);
  const streamRef        = useRef<MediaStream | null>(null);
  const pcmChunksRef     = useRef<Float32Array[]>([]);
  const configRef        = useRef(storyConfig);
  configRef.current      = storyConfig;

  const base = `${backendUrl}/api/v1/voice`;

  // ── speakAndNotify ──────────────────────────────────────────────────────
  const speakAndNotify = useCallback(
    async (text: string) => {
      setAiText(text);
      onAiMessage?.(text);
      await speakViaApi(backendUrl, text);
    },
    [backendUrl, onAiMessage],
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SESSION: init → greeting → first question
  // ══════════════════════════════════════════════════════════════════════════
  const initSession = useCallback(async () => {
    const cfg = configRef.current;
    if (!cfg) return;
    try {
      setSessionPhase("loading");
      setCurrentQuestionIndex(0);
      setScore(0);

      // 1. Load story content
      await postJson(`${base}/load-content`, { content: cfg.storyContent });

      // 2. Greeting
      setSessionPhase("greeting");
      const { text: greetingText } = await postJson<{ text: string }>(
        `${base}/greeting`,
        { story_title: cfg.storyTitle, child_age: cfg.childAge },
      );
      await speakAndNotify(greetingText);

      // 3. Read first question
      if (cfg.qaList.length > 0) {
        setSessionPhase("asking");
        const { text: qText } = await postJson<{ text: string }>(
          `${base}/read-question`,
          {
            story_title: cfg.storyTitle,
            child_age:   cfg.childAge,
            question:    cfg.qaList[0].question,
          },
        );
        onQuestionRead?.(qText);
        await speakAndNotify(qText);
        setSessionPhase("listening");
      }
    } catch (err) {
      onError?.(err);
      setSessionPhase("idle");
    }
  }, [base, speakAndNotify, onQuestionRead, onError]);

  // ══════════════════════════════════════════════════════════════════════════
  // ADVANCE: read next question or end session
  // ══════════════════════════════════════════════════════════════════════════
  const advanceToNext = useCallback(
    async (nextIndex: number, currentScore: number) => {
      const cfg = configRef.current;
      if (!cfg) return;

      if (nextIndex >= cfg.qaList.length) {
        // All questions done → ending
        setSessionPhase("responding");
        const { text: endText } = await postJson<{ text: string }>(
          `${base}/ending`,
          {
            story_title: cfg.storyTitle,
            child_age:   cfg.childAge,
            score:       currentScore,
            total:       cfg.qaList.length,
          },
        );
        await speakAndNotify(endText);

        // Reset session on server
        await fetch(`${base}/reset`, { method: "POST" });

        setSessionPhase("done");
        onSessionEnd?.(currentScore, cfg.qaList.length);
        return;
      }

      // Read next question
      setSessionPhase("asking");
      const { text: qText } = await postJson<{ text: string }>(
        `${base}/read-question`,
        {
          story_title: cfg.storyTitle,
          child_age:   cfg.childAge,
          question:    cfg.qaList[nextIndex].question,
        },
      );
      onQuestionRead?.(qText);
      await speakAndNotify(qText);
      setSessionPhase("listening");
    },
    [base, speakAndNotify, onQuestionRead, onSessionEnd],
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PROCESS: full classify → match → respond pipeline
  // ══════════════════════════════════════════════════════════════════════════
  const processVoiceFlow = useCallback(
    async (audioBlob: Blob) => {
      const cfg = configRef.current;
      if (!cfg) return;

      try {
        setIsProcessing(true);
        setSessionPhase("evaluating");

        const qa = cfg.qaList[currentQuestionIndex];
        if (!qa) return;

        // 1. STT ─────────────────────────────────────────────────────────────
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");
        const sttRes = await fetch(`${base}/transcribe`, {
          method: "POST",
          body: formData,
        });
        const { text: transcribed } = await sttRes.json();

        if (!transcribed || transcribed.trim().length < 1) {
          // Too short/empty → ask to retry
          setSessionPhase("responding");
          await speakAndNotify("Cô chưa nghe rõ, bé nói to hơn nhé!");
          setSessionPhase("listening");
          return;
        }

        setUserText(transcribed);
        onUserText?.(transcribed);

        // 2. Classify intent ──────────────────────────────────────────────────
        const { intent } = await postJson<{ intent: string }>(
          `${base}/classify`,
          { current_question: qa.question, user_text: transcribed },
        );
        const intentUpper = (intent || "").trim().toUpperCase();

        setSessionPhase("responding");

        // 3. Branch on intent ─────────────────────────────────────────────────
        if (intentUpper.includes("QUESTION")) {
          // Child asks about story content → explain + remind
          const { text: explainText } = await postJson<{ text: string }>(
            `${base}/explain`,
            {
              story_title:    cfg.storyTitle,
              child_age:      cfg.childAge,
              child_question: transcribed,
            },
          );
          await speakAndNotify(explainText);

          // After explaining, remind child to answer original question
          const { text: afterText } = await postJson<{ text: string }>(
            `${base}/after-explain`,
            { child_age: cfg.childAge, original_question: qa.question },
          );
          await speakAndNotify(afterText);
          setSessionPhase("listening");
          return;
        }

        if (intentUpper.includes("CONFUSED")) {
          // Child doesn't know → give hint
          const { text: confusedText } = await postJson<{ text: string }>(
            `${base}/confused`,
            {
              story_title:    cfg.storyTitle,
              child_age:      cfg.childAge,
              question:       qa.question,
              correct_answer: qa.answer,
            },
          );
          await speakAndNotify(confusedText);
          setSessionPhase("listening");
          return;
        }

        // ANSWER / CONFIRM → cosine match
        const { score: cosineScore } = await postJson<{ score: number }>(
          `${base}/match`,
          { user_text: transcribed, correct_answer: qa.answer },
        );

        if (cosineScore >= COSINE_CORRECT) {
          // ✅ Correct
          const newScore = score + 1;
          setScore(newScore);
          const { text: correctText } = await postJson<{ text: string }>(
            `${base}/correct`,
            {
              story_title:    cfg.storyTitle,
              child_age:      cfg.childAge,
              question:       qa.question,
              child_answer:   transcribed,
              correct_answer: qa.answer,
            },
          );
          await speakAndNotify(correctText);

          // Move to next question
          const nextIdx = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIdx);
          await advanceToNext(nextIdx, newScore);
        } else if (cosineScore >= COSINE_UNCLEAR) {
          // ❓ Unclear → ask child to clarify
          const { text: unclearText } = await postJson<{ text: string }>(
            `${base}/unclear`,
            {
              story_title: cfg.storyTitle,
              child_age:   cfg.childAge,
              question:    qa.question,
            },
          );
          await speakAndNotify(unclearText);
          setSessionPhase("listening");
        } else {
          // ❌ Wrong
          const { text: wrongText } = await postJson<{ text: string }>(
            `${base}/wrong`,
            {
              story_title:    cfg.storyTitle,
              child_age:      cfg.childAge,
              question:       qa.question,
              child_answer:   transcribed,
              correct_answer: qa.answer,
            },
          );
          await speakAndNotify(wrongText);

          // Move to next question (don't loop on wrong indefinitely)
          const nextIdx = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIdx);
          await advanceToNext(nextIdx, score);
        }
      } catch (err) {
        onError?.(err);
        setSessionPhase("listening");
      } finally {
        setIsProcessing(false);
      }
    },
    [
      base,
      currentQuestionIndex,
      score,
      speakAndNotify,
      advanceToNext,
      onUserText,
      onError,
    ],
  );

  // ══════════════════════════════════════════════════════════════════════════
  // RECORDING: start / stop
  // ══════════════════════════════════════════════════════════════════════════
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      pcmChunksRef.current = [];

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        pcmChunksRef.current.push(new Float32Array(channelData));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      setIsRecording(true);
    } catch (err) {
      console.error("Không thể truy cập micro:", err);
      onError?.(err);
    }
  }, [processVoiceFlow, onError]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsProcessing(true);

    // Stop processor & audio context
    processorRef.current?.disconnect();
    audioCtxRef.current?.close();

    // Release mic
    streamRef.current?.getTracks().forEach((t) => t.stop());

    // Merge PCM chunks into one Float32Array
    const chunks = pcmChunksRef.current;
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    // Encode to real WAV and process
    const sampleRate = audioCtxRef.current?.sampleRate || 16000;
    const wavBlob = encodeWav(merged, sampleRate);
    processVoiceFlow(wavBlob);
  }, [isRecording, processVoiceFlow]);

  // ==========================================================================
  // PRELOAD
  // =========================================================================
  const preloadStory = useCallback(async () => {
  const cfg = configRef.current;
  if (!cfg) return;
  try {
    // Just the context loading, NO audio/greeting yet
    await postJson(`${base}/load-content`, { content: cfg.storyContent });
  } catch (err) {
    console.warn("Preload failed", err);
  }
}, [base]);

  // ══════════════════════════════════════════════════════════════════════════
  // RETURN
  // ══════════════════════════════════════════════════════════════════════════
  return {
    // State
    isRecording,
    isProcessing,
    sessionPhase,
    userText,
    aiText,
    currentQuestionIndex,
    score,

    // Actions
    initSession,
    startRecording,
    stopRecording,
    resetAiText: () => setAiText(""),
    preloadStory
  };
}