import { useCallback, useEffect, useRef, useState } from "react";
import type { StoryConfig } from "../data/video-story-qa";
import type { VoiceService } from "../services/voiceService";
import type { VoiceMeta, VoiceSessionResult } from "../types/voice";

const MAX_RECORDING_GAIN = 2.4;
const TRIM_THRESHOLD_FLOOR = 0.01;
const TRIM_PADDING_MS = 200;
const FADE_MS = 12;
const MIN_RECORDING_SEC = 0.3;
const AUDIO_WORKLET_NAME = "pcm-capture-processor";
const TTS_PLAYBACK_RATE = 1.18;

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
  voiceService: VoiceService;
  storyConfig?: StoryConfig;
  sessionId?: string;
  onUserText?: (text: string) => void;
  onAiMessage?: (text: string) => void;
  onQuestionRead?: (questionText: string) => void;
  onSessionEnd?: (score: number, total: number) => void;
  onError?: (error: unknown) => void;
}

interface PreparedSpeechPlayback {
  playToEnd: () => Promise<boolean>;
  stop: () => void;
}



function createSessionId(seed?: string): string {
  const normalizedSeed = (seed ?? "").trim().replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  const uniquePart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return normalizedSeed ? `${normalizedSeed}-${uniquePart}` : `voice-${uniquePart}`;
}

async function prepareSpeechPlayback(
  blob: Blob,
  signal?: AbortSignal,
): Promise<PreparedSpeechPlayback | null> {
  if (signal?.aborted) {
    return null;
  }

  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.playbackRate = TTS_PLAYBACK_RATE;

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
    signal?.addEventListener("abort", () => finish(false), { once: true });
    audio.load();
  });

  if (!isReady || signal?.aborted) {
    URL.revokeObjectURL(url);
    return null;
  }

  let cleaned = false;
  let resolvePlay: ((value: boolean) => void) | null = null;

  const cleanup = (value: boolean) => {
    if (cleaned) {
      return;
    }

    cleaned = true;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio.onended = null;
    audio.onerror = null;
    URL.revokeObjectURL(url);
    resolvePlay?.(value);
  };

  const abortPlayback = () => cleanup(false);
  signal?.addEventListener("abort", abortPlayback, { once: true });

  return {
    playToEnd: () => new Promise<boolean>((resolve) => {
      if (cleaned || signal?.aborted) {
        resolve(false);
        return;
      }

      resolvePlay = resolve;
      audio.onended = () => cleanup(true);
      audio.onerror = () => cleanup(false);
      audio.play().catch(() => cleanup(false));
    }),
    stop: () => cleanup(false),
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

  const threshold = Math.max(TRIM_THRESHOLD_FLOOR, peak * 0.04);
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

export function useVoiceAI({
  voiceService,
  storyConfig,
  sessionId,
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
  const isRecordingRef = useRef(false);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silenceGainRef = useRef<GainNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcmChunksRef = useRef<Float32Array[]>([]);
  const currentQuestionIndexRef = useRef(0);
  const scoreRef = useRef(0);
  const sessionPhaseRef = useRef<SessionPhase>("idle");
  const processAbortRef = useRef<AbortController | null>(null);
  const sessionAbortRef = useRef<AbortController | null>(null);
  const speechAbortRef = useRef<AbortController | null>(null);
  const activeSpeechRef = useRef<PreparedSpeechPlayback | null>(null);
  const sessionGenerationRef = useRef(0);
  const configRef = useRef(storyConfig);
  configRef.current = storyConfig;
  const sessionIdRef = useRef(
    sessionId || createSessionId(storyConfig?.componentSku || storyConfig?.videoId || "story"),
  );

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

  const stopCurrentSpeech = useCallback(() => {
    speechAbortRef.current?.abort();
    speechAbortRef.current = null;
    activeSpeechRef.current?.stop();
    activeSpeechRef.current = null;
  }, []);

  const stopSession = useCallback(() => {
    sessionGenerationRef.current += 1;
    sessionAbortRef.current?.abort();
    sessionAbortRef.current = null;
    processAbortRef.current?.abort();
    processAbortRef.current = null;
    stopCurrentSpeech();
    cleanupAudioResources();
    isRecordingRef.current = false;
    setIsRecording(false);
    setIsProcessing(false);
    setIsAwaitingUserText(false);
    setSessionPhase("idle");
    sessionPhaseRef.current = "idle";
  }, [cleanupAudioResources, stopCurrentSpeech]);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  const resolveMetaPhase = useCallback((meta: VoiceMeta): SessionPhase => {
    if (meta.completed || meta.phase === "done") {
      return "done";
    }

    const phase = meta.phase;
    if (
      phase === "idle" ||
      phase === "loading" ||
      phase === "greeting" ||
      phase === "asking" ||
      phase === "listening" ||
      phase === "evaluating" ||
      phase === "responding"
    ) {
      return phase;
    }

    return "listening";
  }, []);

  const applyVoiceMeta = useCallback(
    (meta: VoiceMeta, phaseOverride?: SessionPhase) => {
      const text = (meta.text ?? "").trim();
      if (text) {
        setAiText(text);
        onAiMessage?.(text);
      }

      if (typeof meta.transcript === "string") {
        setUserText(meta.transcript);
        if (meta.transcript.trim()) {
          onUserText?.(meta.transcript);
        }
      }

      if (typeof meta.question_index === "number") {
        setCurrentQuestionIndex(meta.question_index);
        currentQuestionIndexRef.current = meta.question_index;
      }

      if (typeof meta.score === "number") {
        setScore(meta.score);
        scoreRef.current = meta.score;
      }

      if (meta.question_text && !meta.completed) {
        onQuestionRead?.(meta.question_text);
      }

      const nextPhase = phaseOverride ?? resolveMetaPhase(meta);
      setSessionPhase(nextPhase);
      sessionPhaseRef.current = nextPhase;
    },
    [onAiMessage, onQuestionRead, onUserText, resolveMetaPhase],
  );

  const playVoiceBlob = useCallback(
    async (blob: Blob, controller: AbortController, generation: number) => {
      stopCurrentSpeech();
      speechAbortRef.current = controller;
      const preparedSpeech = await prepareSpeechPlayback(blob, controller.signal);
      if (!preparedSpeech) {
        if (speechAbortRef.current === controller) {
          speechAbortRef.current = null;
        }
        return generation === sessionGenerationRef.current && !controller.signal.aborted;
      }

      if (generation !== sessionGenerationRef.current || controller.signal.aborted) {
        preparedSpeech.stop();
        if (speechAbortRef.current === controller) {
          speechAbortRef.current = null;
        }
        return false;
      }

      activeSpeechRef.current = preparedSpeech;
      const completed = await preparedSpeech.playToEnd();
      if (activeSpeechRef.current === preparedSpeech) {
        activeSpeechRef.current = null;
      }
      if (speechAbortRef.current === controller) {
        speechAbortRef.current = null;
      }
      return completed && generation === sessionGenerationRef.current;
    },
    [stopCurrentSpeech],
  );

  const playAndApplyVoiceResult = useCallback(
    async (
      result: VoiceSessionResult,
      controller: AbortController,
      generation: number,
      speakingPhase: SessionPhase,
    ) => {
      const finalPhase = resolveMetaPhase(result.meta);
      applyVoiceMeta(result.meta, speakingPhase);
      const completed = await playVoiceBlob(result.blob, controller, generation);
      if (!completed || generation !== sessionGenerationRef.current || controller.signal.aborted) {
        return false;
      }

      setSessionPhase(finalPhase);
      sessionPhaseRef.current = finalPhase;

      if (finalPhase === "done" || result.meta.completed) {
        onSessionEnd?.(result.meta.score ?? scoreRef.current, result.meta.total_questions ?? configRef.current?.qaList.length ?? 0);
      }

      return true;
    },
    [applyVoiceMeta, onSessionEnd, playVoiceBlob, resolveMetaPhase],
  );

  const initSession = useCallback(async () => {
    const config = configRef.current;
    if (!config || (sessionPhaseRef.current !== "idle" && sessionPhaseRef.current !== "done")) {
      return;
    }

    sessionAbortRef.current?.abort();
    const sessionController = new AbortController();
    sessionAbortRef.current = sessionController;
    sessionGenerationRef.current += 1;
    const generation = sessionGenerationRef.current;

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

      const result = await voiceService.startSession(
        {
          session_id: sessionIdRef.current,
          story_title: config.storyTitle,
          story_content: config.storyContent,
          child_age: config.childAge,
          qa_list: config.qaList,
        },
        sessionController.signal,
      );

      if (generation !== sessionGenerationRef.current || sessionController.signal.aborted) {
        return;
      }

      await playAndApplyVoiceResult(result, sessionController, generation, "greeting");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setIsAwaitingUserText(false);
      onError?.(error);
      setSessionPhase("idle");
      sessionPhaseRef.current = "idle";
    } finally {
      if (sessionAbortRef.current === sessionController) {
        sessionAbortRef.current = null;
      }
    }
  }, [voiceService, onError, playAndApplyVoiceResult]);

  const processVoiceFlow = useCallback(
    async (audioBlob: Blob) => {
      if (!configRef.current) {
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

        const result = await voiceService.answerSession(
          audioBlob,
          sessionIdRef.current,
          controller.signal,
        );
        setIsAwaitingUserText(false);
        await playAndApplyVoiceResult(result, controller, sessionGenerationRef.current, "responding");
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
    [voiceService, onError, playAndApplyVoiceResult],
  );

  const startRecording = useCallback(async () => {
    if (isRecordingRef.current) {
      return;
    }

    isRecordingRef.current = true;
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
      isRecordingRef.current = false;
      setIsAwaitingUserText(false);
      onError?.(error);
    }
  }, [onError]);

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) {
      return;
    }

    isRecordingRef.current = false;
    setIsRecording(false);
    const sampleRate = audioCtxRef.current?.sampleRate ?? 16000;
    cleanupAudioResources();

    const chunks = pcmChunksRef.current;
    const totalLength = chunks.reduce((length, chunk) => length + chunk.length, 0);
    const durationSec = totalLength / sampleRate;
    if (durationSec < MIN_RECORDING_SEC) {
      onError?.(new Error("Âm thanh quá ngắn, hãy nói lại nhé."));
      return;
    }

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
  }, [processVoiceFlow, onError]);

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
    stopSession,
    resetAiText: () => setAiText(""),
  };
}
