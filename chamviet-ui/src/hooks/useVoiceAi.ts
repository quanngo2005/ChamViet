import { useCallback, useEffect, useRef, useState } from "react";
import type { StoryConfig } from "../data/video-story-qa";
import { buildApiUrl } from "../utils/apiBase";

const CORRECT_THRESHOLD = 0.75;
const UNCLEAR_THRESHOLD = 0.4;
const DEFAULT_SILENT_RETRY = "Cô chưa nghe rõ, con nói to hơn một chút nhé.";

const FILLER_WORDS = new Set([
  "a",
  "ah",
  "da",
  "dạ",
  "uh",
  "uhm",
  "um",
  "u",
  "vang",
  "vâng",
  "nhe",
  "nhé",
  "oi",
  "ơi",
  "co",
  "cô",
  "con",
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

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${url} -> ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchSpeechBlob(backendUrl: string, text: string): Promise<Blob | null> {
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

function normalizeText(value: string): string {
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
  const streamRef = useRef<MediaStream | null>(null);
  const pcmChunksRef = useRef<Float32Array[]>([]);
  const prewarmedStoryKeyRef = useRef<string | null>(null);
  const configRef = useRef(storyConfig);
  configRef.current = storyConfig;

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
    if (!config) {
      return;
    }

    try {
      setSessionPhase("loading");
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsAwaitingUserText(false);
      setUserText("");
      setAiText("");

      await postJson<unknown>(
        buildApiUrl(backendUrl, "/api/v1/voice/load-content"),
        { content: config.storyContent },
      );

      setSessionPhase("greeting");
      await speakAndNotify(buildGreetingText(config));
      await askQuestion(0);
    } catch (error) {
      setIsAwaitingUserText(false);
      onError?.(error);
      setSessionPhase("idle");
    }
  }, [askQuestion, backendUrl, onError, speakAndNotify]);

  const handleQuestionBranch = useCallback(
    async (transcribed: string, question: string) => {
      const config = configRef.current;
      if (!config) {
        return;
      }

      const { reply } = await postJson<ChatResponse>(
        buildApiUrl(backendUrl, "/api/v1/voice/chat"),
        { message: buildQuestionPrompt(config, question, transcribed) },
      );

      await speakAndNotify(reply);
      setSessionPhase("listening");
    },
    [backendUrl, speakAndNotify],
  );

  const handleConfusedBranch = useCallback(
    async (question: string, answer: string) => {
      const config = configRef.current;
      if (!config) {
        return;
      }

      const { reply } = await postJson<ChatResponse>(
        buildApiUrl(backendUrl, "/api/v1/voice/chat"),
        { message: buildConfusedPrompt(config, question, answer) },
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

      try {
        setIsProcessing(true);
        setSessionPhase("evaluating");

        const qa = config.qaList[currentQuestionIndex];
        if (!qa) {
          return;
        }

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        const sttResponse = await fetch(buildApiUrl(backendUrl, "/api/v1/voice/transcribe"), {
          method: "POST",
          body: formData,
        });
        if (!sttResponse.ok) {
          throw new Error(`Transcribe failed -> ${sttResponse.status}`);
        }

        const { text: transcribed } = (await sttResponse.json()) as TextResponse;
        if (!transcribed || transcribed.trim().length === 0) {
          setIsAwaitingUserText(false);
          setSessionPhase("responding");
          await speakAndNotify(DEFAULT_SILENT_RETRY);
          setSessionPhase("listening");
          return;
        }

        setIsAwaitingUserText(false);
        setUserText(transcribed);
        onUserText?.(transcribed);

        const { intent } = await postJson<ClassifyResponse>(
          buildApiUrl(backendUrl, "/api/v1/voice/classify"),
          { current_question: qa.question, user_text: transcribed },
        );
        const normalizedIntent = (intent || "").trim().toUpperCase();

        setSessionPhase("responding");

        if (normalizedIntent.includes("QUESTION")) {
          await handleQuestionBranch(transcribed, qa.question);
          return;
        }

        if (normalizedIntent.includes("CONFUSED")) {
          await handleConfusedBranch(qa.question, qa.answer);
          return;
        }

        const normalizedAnswer = normalizeText(transcribed);
        const answerScore = scoreAnswer(transcribed, qa.answer);
        if (answerScore >= CORRECT_THRESHOLD) {
          const nextScore = score + 1;
          setScore(nextScore);
          await speakAndNotify(buildCorrectText());
          await advanceToNext(currentQuestionIndex + 1, nextScore);
          return;
        }

        if (
          normalizedAnswer.length === 0 ||
          normalizedIntent.includes("CONFIRM") ||
          answerScore >= UNCLEAR_THRESHOLD
        ) {
          await speakAndNotify(buildUnclearText());
          setSessionPhase("listening");
          return;
        }

        await speakAndNotify(buildWrongText(qa.answer));
        await advanceToNext(currentQuestionIndex + 1, score);
      } catch (error) {
        setIsAwaitingUserText(false);
        onError?.(error);
        setSessionPhase("listening");
      } finally {
        setIsProcessing(false);
      }
    },
    [
      advanceToNext,
      backendUrl,
      currentQuestionIndex,
      handleConfusedBranch,
      handleQuestionBranch,
      onError,
      onUserText,
      score,
      speakAndNotify,
    ],
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processorRef.current = processor;
      pcmChunksRef.current = [];

      processor.onaudioprocess = (event) => {
        const channelData = event.inputBuffer.getChannelData(0);
        pcmChunksRef.current.push(new Float32Array(channelData));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
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
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    void audioCtxRef.current?.close();

    const chunks = pcmChunksRef.current;
    const totalLength = chunks.reduce((length, chunk) => length + chunk.length, 0);
    const merged = new Float32Array(totalLength);

    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    const sampleRate = audioCtxRef.current?.sampleRate ?? 16000;
    const wavBlob = encodeWav(merged, sampleRate);
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
