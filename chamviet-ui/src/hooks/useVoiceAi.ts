import { useCallback, useEffect, useRef, useState } from "react";
import type { StoryConfig } from "../data/video-story-qa";
import { buildApiUrl } from "../utils/apiBase";

const CORRECT_THRESHOLD = 0.75;
const UNCLEAR_THRESHOLD = 0.4;
const DEFAULT_SILENT_RETRY = "Cô chưa nghe rõ, con nói to hơn một chút nhé.";
const MAX_TTS_CACHE_ITEMS = 48;
const MAX_RECORDING_GAIN = 2.4;
const TRIM_THRESHOLD_FLOOR = 0.01;
const TRIM_PADDING_MS = 140;
const FADE_MS = 12;
const AUDIO_WORKLET_NAME = "pcm-capture-processor";

const FILLER_WORDS = new Set([
  "a",
  "ah",
  "uh",
  "uhm",
  "um",
  "u",
]);

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
  backendUrl: string;
  storyConfig?: StoryConfig;
  onUserText?: (text: string) => void;
  onAiMessage?: (text: string) => void;
  onQuestionRead?: (questionText: string) => void;
  onSessionEnd?: (score: number, total: number) => void;
  onError?: (error: unknown) => void;
}

interface ChatResponse {
  reply: string;
}

interface TextResponse {
  text: string;
}

interface ClassifyResponse {
  intent: string;
}

const speechBlobCache = new Map<string, Blob>();

async function postJson<T>(url: string, body: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`${url} -> ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchSpeechBlob(backendUrl: string, text: string): Promise<Blob | null> {
  const cacheKey = `${backendUrl}::${text.trim()}`;
  const cached = speechBlobCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(buildApiUrl(backendUrl, "/api/v1/voice/speak"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    return null;
  }

  speechBlobCache.set(cacheKey, blob);
  if (speechBlobCache.size > MAX_TTS_CACHE_ITEMS) {
    const oldestKey = speechBlobCache.keys().next().value;
    if (oldestKey) {
      speechBlobCache.delete(oldestKey);
    }
  }

  return blob;
}

async function warmSpeechCache(backendUrl: string, text: string): Promise<void> {
  await fetchSpeechBlob(backendUrl, text);
}

async function prepareSpeechPlayback(
  backendUrl: string,
  text: string,
): Promise<{ playToEnd: () => Promise<boolean> } | null> {
  const blob = await fetchSpeechBlob(backendUrl, text);
  if (!blob) {
    return null;
  }

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  const isReady = await new Promise<boolean>((resolve) => {
    let settled = false;

    const finish = (value: boolean) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(value);
    };

    audio.oncanplaythrough = () => finish(true);
    audio.onloadeddata = () => finish(true);
    audio.onerror = () => finish(false);
    audio.load();
  });

  if (!isReady) {
    URL.revokeObjectURL(url);
    return null;
  }

  return {
    playToEnd: () =>
      new Promise<boolean>((resolve) => {
        const cleanup = (value: boolean) => {
          URL.revokeObjectURL(url);
          resolve(value);
        };

        audio.onended = () => cleanup(true);
        audio.onerror = () => cleanup(false);
        audio.play().catch(() => cleanup(false));
      }),
  };
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let index = 0; index < samples.length; index += 1, offset += 2) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function preprocessRecordedSamples(samples: Float32Array, sampleRate: number): Float32Array {
  if (samples.length === 0) {
    return samples;
  }

  const centered = new Float32Array(samples.length);
  let sum = 0;
  for (let index = 0; index < samples.length; index += 1) {
    sum += samples[index];
  }

  const mean = sum / samples.length;
  let peak = 0;
  for (let index = 0; index < samples.length; index += 1) {
    const value = samples[index] - mean;
    centered[index] = value;
    const magnitude = Math.abs(value);
    if (magnitude > peak) {
      peak = magnitude;
    }
  }

  if (peak === 0) {
    return centered;
  }

  const threshold = Math.max(TRIM_THRESHOLD_FLOOR, peak * 0.08);
  let start = 0;
  while (start < centered.length && Math.abs(centered[start]) < threshold) {
    start += 1;
  }

  let end = centered.length - 1;
  while (end > start && Math.abs(centered[end]) < threshold) {
    end -= 1;
  }

  const padding = Math.floor((sampleRate * TRIM_PADDING_MS) / 1000);
  const trimmedStart = Math.max(0, start - padding);
  const trimmedEnd = Math.min(centered.length, end + padding + 1);
  const trimmed = centered.slice(trimmedStart, trimmedEnd);

  let trimmedPeak = 0;
  for (let index = 0; index < trimmed.length; index += 1) {
    const magnitude = Math.abs(trimmed[index]);
    if (magnitude > trimmedPeak) {
      trimmedPeak = magnitude;
    }
  }

  if (trimmedPeak === 0) {
    return trimmed;
  }

  const gain = Math.min(MAX_RECORDING_GAIN, 0.88 / trimmedPeak);
  const normalized = new Float32Array(trimmed.length);
  for (let index = 0; index < trimmed.length; index += 1) {
    normalized[index] = Math.max(-1, Math.min(1, trimmed[index] * gain));
  }

  const fadeSamples = Math.min(
    Math.floor((sampleRate * FADE_MS) / 1000),
    Math.floor(normalized.length / 2),
  );
  if (fadeSamples === 0 || normalized.length < 2 * fadeSamples) {
    return normalized;
  }
  for (let index = 0; index < fadeSamples; index += 1) {
    const fadeIn = index / Math.max(fadeSamples, 1);
    const fadeOut = (fadeSamples - index) / Math.max(fadeSamples, 1);
    normalized[index] *= fadeIn;
    normalized[normalized.length - 1 - index] *= fadeOut;
  }

  return normalized;
}

function normalizeText(value: string): string {
  const tokens = value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 1 && FILLER_WORDS.has(tokens[0])) {
    return "";
  }

  return value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !FILLER_WORDS.has(token))
    .join(" ")
    .trim();
}

async function createPcmCaptureNode(
  audioContext: AudioContext,
  onChunk: (chunk: Float32Array) => void,
): Promise<AudioWorkletNode> {
  const workletSource = `
    class PcmCaptureProcessor extends AudioWorkletProcessor {
      process(inputs) {
        const input = inputs[0];
        const channel = input && input[0];
        if (channel && channel.length) {
          this.port.postMessage(channel.slice(0));
        }
        return true;
      }
    }

    registerProcessor("${AUDIO_WORKLET_NAME}", PcmCaptureProcessor);
  `;

  const blobUrl = URL.createObjectURL(new Blob([workletSource], { type: "text/javascript" }));
  try {
    await audioContext.audioWorklet.addModule(blobUrl);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }

  const node = new AudioWorkletNode(audioContext, AUDIO_WORKLET_NAME, {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [1],
  });
  node.port.onmessage = (event: MessageEvent<Float32Array>) => {
    onChunk(new Float32Array(event.data));
  };
  return node;
}

function scoreAnswer(userText: string, answer: string): number {
  const normalizedUser = normalizeText(userText);
  const normalizedAnswer = normalizeText(answer);

  if (!normalizedUser || !normalizedAnswer) {
    return 0;
  }

  if (normalizedUser === normalizedAnswer) {
    return 1;
  }

  if (
    normalizedAnswer.includes(normalizedUser) ||
    normalizedUser.includes(normalizedAnswer)
  ) {
    return 0.82;
  }

  const userTokens = normalizedUser.split(" ").filter(Boolean);
  const answerTokens = normalizedAnswer.split(" ").filter(Boolean);
  if (userTokens.length === 0 || answerTokens.length === 0) {
    return 0;
  }

  const answerSet = new Set(answerTokens);
  const commonCount = userTokens.filter((token) => answerSet.has(token)).length;
  const precision = commonCount / userTokens.length;
  const recall = commonCount / answerTokens.length;
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return Number(f1.toFixed(2));
}

function buildGreetingText(config: StoryConfig): string {
  return `Chào con. Bây giờ mình cùng ôn lại câu chuyện ${config.storyTitle} bằng vài câu hỏi ngắn nhé.`;
}

function buildQuestionText(question: string, index: number, total: number): string {
  return `Bây giờ là câu ${index + 1} trên ${total}. ${question}`;
}

function buildCorrectText(): string {
  return "Giỏi quá, con trả lời đúng rồi.";
}

function buildUnclearText(): string {
  return "Cô nghe chưa rõ ý lắm, con thử nói rõ hơn một chút nhé.";
}

function buildWrongText(answer: string): string {
  return `Con đã rất cố gắng rồi. Cô gợi ý đáp án là: ${answer}. Mình sang câu tiếp theo nhé.`;
}

function buildEndingText(score: number, total: number): string {
  if (score === total) {
    return `Con làm rất tuyệt. Con trả lời đúng cả ${total} câu rồi.`;
  }
  if (score === 0) {
    return `Hôm nay con đã rất chăm lắng nghe. Lần sau mình cùng cố gắng hơn nhé.`;
  }
  return `Con đã trả lời đúng ${score} trên ${total} câu. Cô khen con đã cố gắng lắm.`;
}

function buildQuestionPrompt(config: StoryConfig, question: string, childQuestion: string): string {
  return [
    `Con ${config.childAge} tuổi đang hỏi thêm về câu chuyện ${config.storyTitle}.`,
    `Câu hỏi của bé là: "${childQuestion}".`,
    `Hãy trả lời thật ngắn gọn, dễ hiểu cho trẻ em, tối đa 2 câu.`,
    `Sau đó nhắc bé quay lại trả lời câu hỏi này: "${question}".`,
    "Không dùng bullet points."
  ].join(" ");
}

function buildConfusedPrompt(config: StoryConfig, question: string, answer: string): string {
  return [
    `Con ${config.childAge} tuổi đang chưa biết trả lời câu hỏi trong truyện ${config.storyTitle}.`,
    `Câu hỏi là: "${question}".`,
    `Đáp án đúng là: "${answer}".`,
    "Hãy đưa ra một gợi ý ngắn, thân thiện, không nói nguyên văn toàn bộ đáp án nếu không cần thiết.",
    "Không dùng bullet points."
  ].join(" ");
}

function buildPrewarmTexts(config: StoryConfig): string[] {
  const texts = new Set<string>();
  const totalQuestions = config.qaList.length;

  texts.add(buildGreetingText(config));
  texts.add(buildCorrectText());
  texts.add(buildUnclearText());

  for (let index = 0; index < totalQuestions; index += 1) {
    const qa = config.qaList[index];
    texts.add(buildQuestionText(qa.question, index, totalQuestions));
    texts.add(buildWrongText(qa.answer));
  }

  for (let currentScore = 0; currentScore <= totalQuestions; currentScore += 1) {
    texts.add(buildEndingText(currentScore, totalQuestions));
  }

  return Array.from(texts);
}

function buildStoryCacheKey(config: StoryConfig): string {
  return JSON.stringify({
    title: config.storyTitle,
    age: config.childAge,
    qaList: config.qaList,
  });
}

export function useVoiceAI({
  backendUrl,
  storyConfig,
  onUserText,
  onAiMessage,
  onQuestionRead,
  onSessionEnd,
  onError,
}: UseVoiceAIOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAwaitingUserText, setIsAwaitingUserText] = useState(false);
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>("idle");
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silenceGainRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcmChunksRef = useRef<Float32Array[]>([]);
  const prewarmedStoryKeyRef = useRef<string | null>(null);
  const currentQuestionIndexRef = useRef(0);
  const scoreRef = useRef(0);
  const sessionPhaseRef = useRef<SessionPhase>("idle");
  const processAbortRef = useRef<AbortController | null>(null);
  const configRef = useRef(storyConfig);
  configRef.current = storyConfig;

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    sessionPhaseRef.current = sessionPhase;
  }, [sessionPhase]);

  const cleanupAudioResources = useCallback(() => {
    processorRef.current?.disconnect();
    processorRef.current = null;
    workletNodeRef.current?.disconnect();
    workletNodeRef.current = null;
    silenceGainRef.current?.disconnect();
    silenceGainRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const audioContext = audioCtxRef.current;
    audioCtxRef.current = null;
    if (audioContext) {
      void audioContext.close();
    }
  }, []);

  useEffect(() => {
    return () => {
      processAbortRef.current?.abort();
      cleanupAudioResources();
    };
  }, [cleanupAudioResources]);

  useEffect(() => {
    if (!storyConfig) {
      prewarmedStoryKeyRef.current = null;
      return;
    }

    const storyKey = buildStoryCacheKey(storyConfig);
    if (prewarmedStoryKeyRef.current === storyKey) {
      return;
    }

    prewarmedStoryKeyRef.current = storyKey;

    let cancelled = false;

    void (async () => {
      const texts = buildPrewarmTexts(storyConfig);
      for (const text of texts) {
        if (cancelled) {
          return;
        }

        try {
          await warmSpeechCache(backendUrl, text);
        } catch {
          return;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [backendUrl, storyConfig]);

  const speakAndNotify = useCallback(
    async (text: string) => {
      const preparedSpeech = await prepareSpeechPlayback(backendUrl, text);
      if (!preparedSpeech) {
        return;
      }

      setAiText(text);
      onAiMessage?.(text);
      await preparedSpeech.playToEnd();
    },
    [backendUrl, onAiMessage],
  );

  const askQuestion = useCallback(
    async (questionIndex: number) => {
      const config = configRef.current;
      if (!config) {
        return;
      }

      const qa = config.qaList[questionIndex];
      if (!qa) {
        return;
      }

      setCurrentQuestionIndex(questionIndex);
      currentQuestionIndexRef.current = questionIndex;
      setSessionPhase("asking");
      const questionText = buildQuestionText(qa.question, questionIndex, config.qaList.length);
      onQuestionRead?.(questionText);
      await speakAndNotify(questionText);
      setSessionPhase("listening");
    },
    [onQuestionRead, speakAndNotify],
  );

  const finishSession = useCallback(
    async (finalScore: number) => {
      const config = configRef.current;
      if (!config) {
        return;
      }

      setSessionPhase("responding");
      await speakAndNotify(buildEndingText(finalScore, config.qaList.length));
      await fetch(buildApiUrl(backendUrl, "/api/v1/voice/reset"), { method: "POST" });
      setSessionPhase("done");
      onSessionEnd?.(finalScore, config.qaList.length);
    },
    [backendUrl, onSessionEnd, speakAndNotify],
  );

  const advanceToNext = useCallback(
    async (nextIndex: number, currentScore: number) => {
      const config = configRef.current;
      if (!config) {
        return;
      }

      if (nextIndex >= config.qaList.length) {
        await finishSession(currentScore);
        return;
      }

      await askQuestion(nextIndex);
    },
    [askQuestion, finishSession],
  );

  const initSession = useCallback(async () => {
    const config = configRef.current;
    if (!config || (sessionPhaseRef.current !== "idle" && sessionPhaseRef.current !== "done")) {
      return;
    }

    try {
      setSessionPhase("loading");
      sessionPhaseRef.current = "loading";
      setCurrentQuestionIndex(0);
      currentQuestionIndexRef.current = 0;
      setScore(0);
      scoreRef.current = 0;
      setIsAwaitingUserText(false);
      setUserText("");
      setAiText("");

      await postJson<unknown>(
        buildApiUrl(backendUrl, "/api/v1/voice/load-content"),
        { content: config.storyContent },
      );

      setSessionPhase("greeting");
      sessionPhaseRef.current = "greeting";
      await speakAndNotify(buildGreetingText(config));
      await askQuestion(0);
    } catch (error) {
      setIsAwaitingUserText(false);
      onError?.(error);
      setSessionPhase("idle");
      sessionPhaseRef.current = "idle";
    }
  }, [askQuestion, backendUrl, onError, speakAndNotify]);

  const handleQuestionBranch = useCallback(
    async (transcribed: string, question: string, signal?: AbortSignal) => {
      const config = configRef.current;
      if (!config) {
        return;
      }

      const { reply } = await postJson<ChatResponse>(
        buildApiUrl(backendUrl, "/api/v1/voice/chat"),
        { message: buildQuestionPrompt(config, question, transcribed) },
        signal,
      );

      await speakAndNotify(reply);
      setSessionPhase("listening");
    },
    [backendUrl, speakAndNotify],
  );

  const handleConfusedBranch = useCallback(
    async (question: string, answer: string, signal?: AbortSignal) => {
      const config = configRef.current;
      if (!config) {
        return;
      }

      const { reply } = await postJson<ChatResponse>(
        buildApiUrl(backendUrl, "/api/v1/voice/chat"),
        { message: buildConfusedPrompt(config, question, answer) },
        signal,
      );

      await speakAndNotify(reply);
      setSessionPhase("listening");
    },
    [backendUrl, speakAndNotify],
  );

  const processVoiceFlow = useCallback(
    async (audioBlob: Blob) => {
      const config = configRef.current;
      if (!config) {
        setIsAwaitingUserText(false);
        return;
      }

      processAbortRef.current?.abort();
      const controller = new AbortController();
      processAbortRef.current = controller;

      try {
        setIsProcessing(true);
        setSessionPhase("evaluating");
        sessionPhaseRef.current = "evaluating";

        const questionIndex = currentQuestionIndexRef.current;
        const currentScore = scoreRef.current;
        const qa = config.qaList[questionIndex];
        if (!qa) {
          return;
        }

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        const sttResponse = await fetch(buildApiUrl(backendUrl, "/api/v1/voice/transcribe"), {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
        if (!sttResponse.ok) {
          throw new Error(`Transcribe failed -> ${sttResponse.status}`);
        }

        const { text: transcribed } = (await sttResponse.json()) as TextResponse;
        if (!transcribed || transcribed.trim().length === 0) {
          setIsAwaitingUserText(false);
          setSessionPhase("responding");
          sessionPhaseRef.current = "responding";
          await speakAndNotify(DEFAULT_SILENT_RETRY);
          setSessionPhase("listening");
          sessionPhaseRef.current = "listening";
          return;
        }

        setIsAwaitingUserText(false);
        setUserText(transcribed);
        onUserText?.(transcribed);

        const { intent } = await postJson<ClassifyResponse>(
          buildApiUrl(backendUrl, "/api/v1/voice/classify"),
          { current_question: qa.question, user_text: transcribed },
          controller.signal,
        );
        const normalizedIntent = (intent || "").trim().toUpperCase();

        setSessionPhase("responding");
        sessionPhaseRef.current = "responding";

        if (normalizedIntent.includes("QUESTION")) {
          await handleQuestionBranch(transcribed, qa.question, controller.signal);
          return;
        }

        if (normalizedIntent.includes("CONFUSED")) {
          await handleConfusedBranch(qa.question, qa.answer, controller.signal);
          return;
        }

        const normalizedAnswer = normalizeText(transcribed);
        const answerScore = scoreAnswer(transcribed, qa.answer);
        if (answerScore >= CORRECT_THRESHOLD) {
          const nextScore = currentScore + 1;
          setScore(nextScore);
          scoreRef.current = nextScore;
          await speakAndNotify(buildCorrectText());
          await advanceToNext(questionIndex + 1, nextScore);
          return;
        }

        if (
          normalizedAnswer.length === 0 ||
          normalizedIntent.includes("CONFIRM") ||
          answerScore >= UNCLEAR_THRESHOLD
        ) {
          await speakAndNotify(buildUnclearText());
          setSessionPhase("listening");
          sessionPhaseRef.current = "listening";
          return;
        }

        await speakAndNotify(buildWrongText(qa.answer));
        await advanceToNext(questionIndex + 1, currentScore);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setIsAwaitingUserText(false);
        onError?.(error);
        setSessionPhase("listening");
        sessionPhaseRef.current = "listening";
      } finally {
        setIsProcessing(false);
        if (processAbortRef.current === controller) {
          processAbortRef.current = null;
        }
      }
    },
    [
      advanceToNext,
      backendUrl,
      handleConfusedBranch,
      handleQuestionBranch,
      onError,
      onUserText,
      speakAndNotify,
    ],
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: { ideal: 1 },
          sampleRate: { ideal: 48000 },
          sampleSize: { ideal: 16 },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      const audioContext = new AudioContext();
      audioCtxRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      const silenceGain = audioContext.createGain();
      silenceGain.gain.value = 0;
      silenceGainRef.current = silenceGain;
      pcmChunksRef.current = [];
      let captureNodeConnected = false;

      if ("audioWorklet" in audioContext) {
        try {
          const workletNode = await createPcmCaptureNode(audioContext, (chunk) => {
            pcmChunksRef.current.push(chunk);
          });
          workletNodeRef.current = workletNode;
          source.connect(workletNode);
          workletNode.connect(silenceGain);
          captureNodeConnected = true;
        } catch {
          workletNodeRef.current = null;
        }
      }

      if (!captureNodeConnected) {
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        processor.onaudioprocess = (event) => {
          const channelData = event.inputBuffer.getChannelData(0);
          pcmChunksRef.current.push(new Float32Array(channelData));
        };
        source.connect(processor);
        processor.connect(silenceGain);
      }

      silenceGain.connect(audioContext.destination);
      setIsRecording(true);
    } catch (error) {
      setIsAwaitingUserText(false);
      onError?.(error);
    }
  }, [onError]);

  const stopRecording = useCallback(() => {
    if (!isRecording) {
      return;
    }

    setIsRecording(false);
    const sampleRate = audioCtxRef.current?.sampleRate ?? 16000;
    cleanupAudioResources();

    const chunks = pcmChunksRef.current;
    const totalLength = chunks.reduce((length, chunk) => length + chunk.length, 0);
    const merged = new Float32Array(totalLength);

    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    const processed = preprocessRecordedSamples(merged, sampleRate);
    const wavBlob = encodeWav(processed, sampleRate);
    setIsAwaitingUserText(true);
    void processVoiceFlow(wavBlob);
  }, [isRecording, processVoiceFlow]);

  return {
    isRecording,
    isProcessing,
    isAwaitingUserText,
    sessionPhase,
    userText,
    aiText,
    currentQuestionIndex,
    score,
    initSession,
    startRecording,
    stopRecording,
    resetAiText: () => setAiText(""),
  };
}
