import { useState, useRef, useEffect, useCallback } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Portal from "@mui/material/Portal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MicIcon from "@mui/icons-material/Mic";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useVoiceAI } from "../../hooks/useVoiceAi";
import { createVoiceService } from "../../services/voiceService";
import { resolveApiOrigin } from "../../utils/apiBase";
import { fetchStoryConfigByVideoId, type StoryConfig } from "../../data/video-story-qa";
import mascot from "../../assets/masotknen.webp";

const voiceService = createVoiceService();
const API_BASE_URL = resolveApiOrigin(import.meta.env.VITE_API_BASE_URL as string | undefined);

// ─── Design tokens ───────────────────────────────────────────────────────────
const COLORS = {
  bg: "#1f1313",
  surface: "#ffffff",
  surfaceAlt: "rgba(255, 255, 255, 0.06)",
  title: "#ffffff",
  titleDark: "#0f172a",
  body: "rgba(255, 255, 255, 0.78)",
  bodyDark: "#334155",
  muted: "rgba(255, 255, 255, 0.60)",
  mutedDark: "#64748b",
  accent: "#a83232",
  accentSoft: "rgba(168, 50, 50, 0.10)",
  borderSoft: "rgba(168, 50, 50, 0.18)",
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DialogueOption {
  id?: string;
  label: string;
  nextStep: number | string;
  isCta?: boolean;
}

export interface DialogueStep {
  id: number | string;
  text: string;
  options: DialogueOption[];
}

export interface VideoStopConfig {
  stopTime: number;
  mascotAvatar?: string;
  mascotAvatarUrl?: string;
  dialogue?: DialogueStep[];
  dialogues?: Record<string, DialogueStep>;
  startDialogueId?: string | number;
  storyConfig?: StoryConfig;
  [key: string]: any;
}

export type VideoRegistry = Record<string, VideoStopConfig>;

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  id: string;
}

// ─── Default registry ─────────────────────────────────────────────────────────
const DEFAULT_VIDEO_REGISTRY: VideoRegistry = {
  Mb0RWyh3sqQ: {
    stopTime: 8,
    mascotAvatar: mascot,
    dialogue: [],
  },
};

// ─── Component props ──────────────────────────────────────────────────────────
interface YouTubeStopOverlayPlayerProps {
  videoId: string;
  autoplay?: boolean;
  registry?: VideoRegistry;
  storyConfig?: StoryConfig;
  onCtaClick?: (videoId: string, config: VideoStopConfig) => void;
  colors?: any;
}

function extractYouTubeVideoId(value?: string): string | null {
  const source = value?.trim();
  if (!source) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(source)) return source;

  try {
    const url = new URL(source);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (host.endsWith("youtube.com")) {
      const watchId = url.searchParams.get("v");
      if (watchId) return watchId;

      const [kind, id] = url.pathname.split("/").filter(Boolean);
      if ((kind === "embed" || kind === "shorts") && id) return id;
    }
  } catch {
    return null;
  }

  return null;
}

function isNativeVideoUrl(value?: string): boolean {
  const source = value?.trim();
  return Boolean(source && (/^data:video\//i.test(source) || /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(source)));
}

function resolveVideoSourceUrl(value: string): string {
  if (/^(https?:|blob:|data:)/i.test(value)) return value;
  if (value.startsWith("/")) return `${API_BASE_URL}${value}`;
  return `${API_BASE_URL}/${value.replace(/^\.?\//, "")}`;
}

// ─── Keyframes injected once ──────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes mascotFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-14px); }
  }
  @keyframes msgFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes typingBounce {
    0%, 80%, 100% { transform: translateY(0); }
    40%           { transform: translateY(-6px); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    50%      { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
  }
`;

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots({ role = "ai" }: { role?: "user" | "ai" }) {
  const isUser = role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        px: 2,
        py: 1.5,
        bgcolor: isUser ? COLORS.accent : "#f1f5f9",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        width: "fit-content",
        animation: "msgFadeIn 0.25s ease",
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: isUser ? "rgba(255,255,255,0.8)" : COLORS.mutedDark,
            animationName: "typingBounce",
            animationDuration: "1.2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </Box>
  );
}

// ─── Phase status text ────────────────────────────────────────────────────────
function phaseStatusText(
  phase: string,
  isRecording: boolean,
  isAwaitingUserText: boolean,
): { primary: string; secondary: string } {
  if (isRecording) return { primary: "Đang nghe...", secondary: "Thả tay để gửi" };
  if (isAwaitingUserText) {
    return {
      primary: "Đã nhận giọng nói",
      secondary: "Bé hạc đang nghe lại câu trả lời của con",
    };
  }
  switch (phase) {
    case "loading": return { primary: "Đang chuẩn bị...", secondary: "Bé hạc đang tải câu chuyện" };
    case "greeting": return { primary: "Bé hạc đang chào...", secondary: "Lắng nghe nhé!" };
    case "asking": return { primary: "Bé hạc đang hỏi...", secondary: "Lắng nghe câu hỏi nhé!" };
    case "evaluating": return { primary: "Đang xử lý...", secondary: "Bé hạc đang suy nghĩ" };
    case "responding": return { primary: "Bé hạc đang trả lời...", secondary: "Lắng nghe nhé!" };
    case "done": return { primary: "Hoàn thành!", secondary: "Nhấn Tiếp tục để xem video" };
    default: return { primary: "Nhấn giữ để trả lời", secondary: "Bé hạc lắng nghe bạn nói" };
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function YouTubeStopOverlayPlayer({
  videoId,
  autoplay: _autoplay = false,
  registry,
  storyConfig: storyConfigOverride,
  onCtaClick: _onCtaClick,
}: YouTubeStopOverlayPlayerProps) {
  // ── State ───────────────────────────────────────────────────────────────
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionInitiated, setSessionInitiated] = useState(false);
  const [resolvedStoryConfig, setResolvedStoryConfig] = useState<StoryConfig | null>(null);

  // ── Refs ────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const nativeVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activeRegistry = registry || DEFAULT_VIDEO_REGISTRY;
  const config = activeRegistry[videoId] || DEFAULT_VIDEO_REGISTRY[videoId];
  const storyConfig = storyConfigOverride ?? config?.storyConfig ?? resolvedStoryConfig ?? undefined;
  const backendVideoUrl = storyConfig?.videoUrl?.trim();
  const backendYouTubeVideoId = extractYouTubeVideoId(backendVideoUrl);
  const playbackVideoId = backendYouTubeVideoId ?? videoId;
  const nativeVideoSrc =
    backendVideoUrl && !backendYouTubeVideoId && isNativeVideoUrl(backendVideoUrl)
      ? resolveVideoSourceUrl(backendVideoUrl)
      : null;

  // ── Message helpers ─────────────────────────────────────────────────────
  const addMessage = useCallback((role: "user" | "ai", content: string) => {
    setMessages((prev) => [
      ...prev,
      { role, content, id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
    ]);
  }, []);

  // ── Voice AI ────────────────────────────────────────────────────────────
  const {
    isRecording,
    isProcessing,
    isAwaitingUserText,
    sessionPhase,
    currentQuestionIndex,
    score,
    initSession,
    startRecording,
    stopRecording,
    stopSession,
  } = useVoiceAI({
    voiceService,
    storyConfig,
    onUserText: (text) => addMessage("user", text),
    onAiMessage: (text) => addMessage("ai", text),
    onQuestionRead: (_qText) => {
      // Question text comes through onAiMessage already via speakAndNotify
    },
    onSessionEnd: (_s, _t) => {
      // Session done — handled by sessionPhase === "done"
    },
    onError: () => addMessage("ai", "Ôi, có lỗi xảy ra rồi! Bé thử lại nhé."),
  });

  // ── Inject global keyframes ─────────────────────────────────────────────
  useEffect(() => {
    const id = "be-go-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (storyConfigOverride) {
      setResolvedStoryConfig(storyConfigOverride);
      return () => {
        cancelled = true;
      };
    }

    if (config?.storyConfig) {
      setResolvedStoryConfig(config.storyConfig);
      return () => {
        cancelled = true;
      };
    }

    fetchStoryConfigByVideoId(videoId)
      .then((payload) => {
        if (!cancelled) {
          setResolvedStoryConfig(payload);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedStoryConfig(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [config?.storyConfig, storyConfigOverride, videoId]);

  // ── Auto-scroll chat to bottom ──────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isAwaitingUserText, isProcessing, messages]);

  // ── Init session when overlay opens ─────────────────────────────────────
  useEffect(() => {
    if (overlayOpen && storyConfig && !sessionInitiated) {
      setSessionInitiated(true);
      initSession();
    }
  }, [overlayOpen, storyConfig, sessionInitiated, initSession]);

  // ── Reset on overlay close ──────────────────────────────────────────────
  const resetOverlay = useCallback(() => {
    setMessages([]);
    setSessionInitiated(false);
  }, []);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  // ── YouTube event handlers ──────────────────────────────────────────────
  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    if (event.data === 0) {
      setOverlayOpen(true);
    }
  };

  const mascotSrc = config?.mascotAvatarUrl || config?.mascotAvatar || "";

  // ── Action handlers ─────────────────────────────────────────────────────
  const handleSkip = () => {
    stopSession();
    setOverlayOpen(false);
    setTimeout(() => resetOverlay(), 500);
  };

  const closeOverlayAndResume = () => {
    stopSession();
    setOverlayOpen(false);
    setTimeout(() => resetOverlay(), 500);
  };

  const handleReplay = () => {
    stopSession();
    if (nativeVideoRef.current) {
      nativeVideoRef.current.currentTime = config?.startTime || 0;
      void nativeVideoRef.current.play();
    } else if (playerRef.current) {
      playerRef.current.seekTo(config?.startTime || 0);
      playerRef.current.playVideo();
    }
    setOverlayOpen(false);
    setTimeout(() => resetOverlay(), 500);
  };

  // ── Mic enabled only in listening phase ─────────────────────────────────
  const canRecord = Boolean(storyConfig) && sessionPhase === "listening" && !isProcessing && !isRecording;

  // ── Status text ─────────────────────────────────────────────────────────
  const status = phaseStatusText(sessionPhase, isRecording, isAwaitingUserText);

  // ── QA progress ─────────────────────────────────────────────────────────
  const totalQuestions = storyConfig?.qaList?.length ?? 0;
  const progressText = totalQuestions > 0
    ? `Câu ${Math.min(currentQuestionIndex + 1, totalQuestions)}/${totalQuestions} · Đúng: ${score}`
    : "";

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        "& > div": { width: "100%", height: "100%", position: "absolute", inset: 0 },
        "& iframe": { width: "100% !important", height: "100% !important" },
      }}
    >
      {nativeVideoSrc ? (
        <Box
          component="video"
          ref={nativeVideoRef}
          src={nativeVideoSrc}
          controls
          playsInline
          preload="metadata"
          onEnded={() => setOverlayOpen(true)}
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            display: "block",
            objectFit: "contain",
            backgroundColor: "#000000",
          }}
        />
      ) : (
        <YouTube
          videoId={playbackVideoId}
          onReady={onReady}
          onStateChange={onStateChange}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: { rel: 0, modestbranding: 1, controls: 1, disablekb: 1, fs: 1 },
          }}
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        />
      )}

      {config && (
        <Portal>
          <Fade in={overlayOpen}>
            {/* ── Full-screen backdrop ───────────────────────────────────── */}
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: { xs: "flex-end", md: "center" },
                justifyContent: "center",
                p: { xs: 1, sm: 2, md: 4 },
                background:
                  "linear-gradient(135deg, rgba(15,5,5,0.92) 0%, rgba(31,19,19,0.96) 100%)",
                backdropFilter: "blur(18px)",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              {/* ── Main content: mascot (L) + chat panel (R) ────────────── */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "stretch", md: "center" },
                  justifyContent: "center",
                  gap: { xs: 1.25, md: 5 },
                  width: "100%",
                  maxWidth: 1040,
                  maxHeight: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >
                {/* ── LEFT: Mascot ────────────────────────────────────────── */}
                <Box
                  sx={{
                    flex: "0 0 auto",
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 160, md: 260 },
                      height: { xs: 160, md: 260 },
                      position: "relative",
                      animationName: "mascotFloat",
                      animationDuration: "3s",
                      animationTimingFunction: "ease-in-out",
                      animationIterationCount: "infinite",
                    }}
                  >
                    {/* Glow ring when recording */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: -12,
                        borderRadius: "50%",
                        background: isRecording
                          ? "radial-gradient(circle, rgba(239,68,68,0.55) 0%, transparent 70%)"
                          : "transparent",
                        transition: "background 0.4s ease",
                        pointerEvents: "none",
                      }}
                    />
                    <Box
                      component="img"
                      src={mascotSrc}
                      alt="Bé hạc mascot"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: isRecording
                          ? "drop-shadow(0 0 20px rgba(239,68,68,0.8))"
                          : "drop-shadow(0 12px 24px rgba(0,0,0,0.5))",
                        transition: "filter 0.35s ease",
                      }}
                    />
                  </Box>

                  {/* Mascot name label */}
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1.5,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      fontSize: "0.65rem",
                    }}
                  >
                    Chíp Bông
                  </Typography>
                </Box>

                {/* ── RIGHT: Chat panel ────────────────────────────────────── */}
                <Paper
                  elevation={0}
                  sx={{
                    flex: "1 1 auto",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: { xs: "min(calc(100dvh - 16px), 760px)", md: "72vh" },
                    maxHeight: "calc(100dvh - 16px)",
                    maxWidth: { xs: "100%", md: 560 },
                    width: "100%",
                    borderRadius: { xs: "24px 24px 0 0", sm: "24px", md: "20px" },
                    overflow: "hidden",
                    bgcolor: "rgba(255,255,255,0.93)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(168,50,50,0.12)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    boxSizing: "border-box",
                    overscrollBehavior: "contain",
                  }}
                  data-lenis-prevent
                >
                  {/* Panel header */}
                  <Box
                    sx={{
                      px: { xs: 2, sm: 2.5, md: 3 },
                      py: { xs: 1.5, md: 2 },
                      borderBottom: "1px solid rgba(15,23,42,0.08)",
                      background:
                        "linear-gradient(to right, rgba(168,50,50,0.06), rgba(168,50,50,0.02))",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 1.25,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: "1 1 240px" }}>
                      <Box
                        component="img"
                        src={mascotSrc}
                        alt="Bé hạc mascot"
                        sx={{
                          display: { xs: "block", md: "none" },
                          width: 44,
                          height: 44,
                          objectFit: "contain",
                          flexShrink: 0,
                          filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.16))",
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800, color: COLORS.titleDark, lineHeight: 1.2 }}
                        >
                          Hỏi đáp cùng Chíp Bông
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.mutedDark }}>
                          {storyConfig ? "Nhấn giữ micro để trả lời" : "Chưa tải được dữ liệu câu hỏi"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, flex: "0 1 auto", flexWrap: "wrap", ml: "auto" }}>
                      {progressText && (
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 999,
                            bgcolor: COLORS.accentSoft,
                            color: COLORS.accent,
                            fontSize: 12,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {progressText}
                        </Box>
                      )}
                      <Button
                        onClick={handleSkip}
                        startIcon={<CloseIcon />}
                        size="small"
                        sx={{
                          color: COLORS.mutedDark,
                          textTransform: "none",
                          fontWeight: 700,
                          borderRadius: 999,
                          px: 1.5,
                          minWidth: "auto",
                          "&:hover": { color: COLORS.titleDark, bgcolor: "rgba(15,23,42,0.06)" },
                        }}
                      >
                        Bỏ qua
                      </Button>
                    </Box>
                  </Box>

                  {/* Messages area */}
                  <Box
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      overflowY: "auto",
                      px: { xs: 2, sm: 2.5 },
                      py: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      WebkitOverflowScrolling: "touch",
                      overscrollBehavior: "contain",
                      touchAction: "pan-y",
                      "&::-webkit-scrollbar": { width: 5 },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: "rgba(0,0,0,0.15)",
                        borderRadius: 4,
                      },
                    }}
                    data-lenis-prevent
                  >
                    {!storyConfig && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          animation: "msgFadeIn 0.25s ease",
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: "85%",
                            px: 2,
                            py: 1.25,
                            borderRadius: "18px 18px 18px 4px",
                            bgcolor: "#fef2f2",
                            color: COLORS.titleDark,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          }}
                        >
                          <Typography variant="body2" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                            Câu chuyện này chưa có bộ câu hỏi demo hoặc dữ liệu chưa tải được.
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {messages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          display: "flex",
                          justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                          animation: "msgFadeIn 0.25s ease",
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: "80%",
                            px: 2,
                            py: 1.25,
                            borderRadius:
                              msg.role === "user"
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",
                            bgcolor:
                              msg.role === "user"
                                ? COLORS.accent
                                : "#f1f5f9",
                            color: msg.role === "user" ? "#fff" : COLORS.titleDark,
                            boxShadow:
                              msg.role === "user"
                                ? "0 4px 12px rgba(168,50,50,0.25)"
                                : "0 2px 8px rgba(0,0,0,0.06)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ lineHeight: 1.6, fontWeight: msg.role === "ai" ? 500 : 400 }}
                          >
                            {msg.content}
                          </Typography>
                        </Box>
                      </Box>
                    ))}

                    {/* Typing indicator */}
                    {isAwaitingUserText && (
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
                          <TypingDots role="user" />
                          <Typography
                            variant="caption"
                            sx={{ color: COLORS.mutedDark, pr: 1, fontWeight: 600, textAlign: "right" }}
                          >
                            Chíp Bông đã nhận giọng nói của cậu...
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {isProcessing && !isAwaitingUserText && (
                      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <TypingDots />
                          <Typography
                            variant="caption"
                            sx={{ color: COLORS.mutedDark, pl: 1, fontWeight: 600 }}
                          >
                            Chíp Bông đang suy nghĩ...
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Scroll anchor */}
                    <div ref={chatEndRef} />
                  </Box>

                  {/* Voice input area */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      px: { xs: 2, sm: 2.5 },
                      py: 2,
                      borderTop: "1px solid rgba(15,23,42,0.08)",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      bgcolor: "rgba(248,250,252,0.9)",
                    }}
                  >
                    {/* Mic button */}
                    <Box
                      component="button"
                      onMouseDown={canRecord ? startRecording : undefined}
                      onMouseUp={isRecording ? stopRecording : undefined}
                      onTouchStart={canRecord ? startRecording : undefined}
                      onTouchEnd={isRecording ? stopRecording : undefined}
                      sx={{
                        flexShrink: 0,
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        border: "none",
                        cursor: canRecord || isRecording ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isRecording
                          ? "#ef4444"
                          : canRecord
                            ? COLORS.accent
                            : "rgba(168,50,50,0.4)",
                        color: "#fff",
                        boxShadow: isRecording
                          ? "0 0 0 8px rgba(239,68,68,0.2), 0 4px 16px rgba(239,68,68,0.4)"
                          : canRecord
                            ? "0 4px 14px rgba(168,50,50,0.35)"
                            : "none",
                        transform: isRecording ? "scale(1.12)" : "scale(1)",
                        transition: "transform 0.2s ease, background-color 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease",
                        outline: "none",
                        opacity: canRecord || isRecording ? 1 : 0.6,
                        "&:active": canRecord || isRecording ? { transform: "scale(0.96)" } : {},
                      }}
                    >
                      {isRecording ? (
                        <GraphicEqIcon sx={{ fontSize: 28 }} />
                      ) : (
                        <MicIcon sx={{ fontSize: 28 }} />
                      )}
                    </Box>

                    {/* Status hint */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isRecording ? "#ef4444" : COLORS.titleDark,
                          fontWeight: 700,
                          transition: "color 0.2s",
                        }}
                      >
                        {status.primary}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.mutedDark }}>
                        {status.secondary}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Footer actions */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: "flex",
                      gap: 1,
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      px: { xs: 2, sm: 2.5 },
                      pb: { xs: 2, sm: 2.5 },
                      pt: 0,
                    }}
                  >
                    <Button
                      fullWidth
                      startIcon={<ReplayIcon sx={{ fontSize: 18 }} />}
                      onClick={handleReplay}
                      size="small"
                      sx={{
                        color: COLORS.mutedDark,
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 3,
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": { bgcolor: "#f1f5f9" },
                      }}
                    >
                      Xem lại
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<PlayArrowIcon sx={{ fontSize: 18 }} />}
                      onClick={closeOverlayAndResume}
                      size="small"
                      sx={{
                        bgcolor: COLORS.accent,
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 3,
                        boxShadow: "0 4px 14px rgba(168,50,50,0.35)",
                        "&:hover": { bgcolor: "#8a2828" },
                      }}
                    >
                      Đóng
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Fade>
        </Portal>
      )}
    </Box>
  );
}
