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
import mascotHac from "../../assets/be-hac.png";


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
    mascotAvatar: mascotHac,
    dialogue: [
    ],
  },
};

// ─── Component props ──────────────────────────────────────────────────────────
interface YouTubeStopOverlayPlayerProps {
  videoId: string;
  autoplay?: boolean;
  registry?: VideoRegistry;
  onCtaClick?: (videoId: string, config: VideoStopConfig) => void;
  colors?: any;
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
`;

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        px: 2,
        py: 1.5,
        bgcolor: "#f1f5f9",
        borderRadius: "18px 18px 18px 4px",
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
            bgcolor: COLORS.mutedDark,
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function YouTubeStopOverlayPlayer({
  videoId,
  autoplay = false,
  registry,
  onCtaClick,
  // colors accepted for API compat but theming handled via COLORS constant
}: YouTubeStopOverlayPlayerProps) {
  // ── Voice AI ────────────────────────────────────────────────────────────────
  const {
    isRecording,
    isProcessing,
    aiText,
    startRecording,
    stopRecording,
    resetAiText,
  } = useVoiceAI({
    backendUrl: "http://localhost:8000",
    onResponse: (text, audioUrl) => {
      const audio = new Audio(audioUrl);
      audio.play();
    },
    onError: () => alert("Có lỗi xảy ra với Bé hạc rồi!"),
  });

  // ── State ───────────────────────────────────────────────────────────────────
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<number | string>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ── Refs ────────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const triggeredRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const prevAiText = useRef("");
  const prevIsRecording = useRef(false);

  const activeRegistry = registry || DEFAULT_VIDEO_REGISTRY;
  const config = activeRegistry[videoId];

  // ── Inject global keyframes ─────────────────────────────────────────────────
  useEffect(() => {
    const id = "be-go-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = GLOBAL_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  // ── Auto-scroll chat to bottom ──────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // ── Sync aiText → chat messages ─────────────────────────────────────────────
  useEffect(() => {
    if (aiText && aiText !== prevAiText.current) {
      prevAiText.current = aiText;
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: aiText, id: `ai-${Date.now()}` },
      ]);
    }
  }, [aiText]);

  // ── Push user message when recording stops ──────────────────────────────────
  // We capture the transcript via aiText; user text comes from STT inside hook.
  // We track isRecording falling edge to show a placeholder "Đang nhận diện..."
  useEffect(() => {
    if (prevIsRecording.current && !isRecording && isProcessing) {
      // Recording just stopped and processing starts
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: "🎙️ (đang nhận diện...)",
          id: `user-pending-${Date.now()}`,
        },
      ]);
    }
    prevIsRecording.current = isRecording;
  }, [isRecording, isProcessing]);

  // ── Reset on overlay close ──────────────────────────────────────────────────
  const resetOverlay = useCallback(() => {
    setMessages([]);
    setCurrentStepId(config?.startDialogueId || 0);
    prevAiText.current = "";
    resetAiText?.();
  }, [config, resetAiText]);

  // ── Polling logic (unchanged) ───────────────────────────────────────────────
  const clearPolling = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startPolling = () => {
    if (!config) return;
    clearPolling();
    intervalRef.current = window.setInterval(() => {
      if (!playerRef.current) return;
      const currentTime = playerRef.current.getCurrentTime() || 0;

      if (currentTime < config.stopTime - 2) {
        triggeredRef.current = false;
      }

      if (!triggeredRef.current && currentTime >= config.stopTime) {
        triggeredRef.current = true;
        playerRef.current.pauseVideo();
        setOverlayOpen(true);
      }
    }, 250);
  };

  useEffect(() => {
    return () => clearPolling();
  }, []);

  // ── YouTube event handlers ──────────────────────────────────────────────────
  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    if (event.data === 1) startPolling();
    else clearPolling();
  };

  // ── Dialogue helpers ────────────────────────────────────────────────────────
  const currentStep = config?.dialogues
    ? config.dialogues[currentStepId as string]
    : config?.dialogue?.find((s) => s.id === currentStepId);

  const mascotSrc = config?.mascotAvatarUrl || config?.mascotAvatar || "";

  // ── Action handlers ─────────────────────────────────────────────────────────
  const handleSkip = () => {
    setOverlayOpen(false);
    if (playerRef.current) {
      playerRef.current.playVideo();
      triggeredRef.current = true;
    }
    setTimeout(() => resetOverlay(), 500);
  };

  const closeOverlayAndResume = () => {
    setOverlayOpen(false);
    if (playerRef.current) playerRef.current.playVideo();
    setTimeout(() => resetOverlay(), 500);
  };

  const handleReplay = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(config?.startTime || 0);
      playerRef.current.playVideo();
    }
    setOverlayOpen(false);
    setTimeout(() => resetOverlay(), 500);
  };

  // ── Seeding first AI message from dialogue step ─────────────────────────────
  useEffect(() => {
    if (overlayOpen && currentStep && messages.length === 0) {
      setMessages([
        {
          role: "ai",
          content: currentStep.text,
          id: `ai-init-${Date.now()}`,
        },
      ]);
    }
  }, [overlayOpen]);

  // ── Render ──────────────────────────────────────────────────────────────────
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
      <YouTube
        videoId={videoId}
        onReady={onReady}
        onStateChange={onStateChange}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: { rel: 0, modestbranding: 1, controls: 1, disablekb: 1, fs: 0 },
        }}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      />

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
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 2, md: 4 },
                background:
                  "linear-gradient(135deg, rgba(15,5,5,0.92) 0%, rgba(31,19,19,0.96) 100%)",
                backdropFilter: "blur(18px)",
              }}
            >
              {/* ── Skip button ──────────────────────────────────────────── */}
              <Box sx={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
                <Button
                  onClick={handleSkip}
                  startIcon={<CloseIcon />}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                    borderRadius: 3,
                  }}
                >
                  Bỏ qua
                </Button>
              </Box>

              {/* ── Main content: mascot (L) + chat panel (R) ────────────── */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  gap: { xs: 3, md: 5 },
                  width: "100%",
                  maxWidth: 1000,
                }}
              >
                {/* ── LEFT: Mascot ────────────────────────────────────────── */}
                <Box
                  sx={{
                    flex: "0 0 auto",
                    display: "flex",
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
                    Bé hạc
                  </Typography>
                </Box>

                {/* ── RIGHT: Chat panel ────────────────────────────────────── */}
                <Paper
                  elevation={0}
                  sx={{
                    flex: "1 1 auto",
                    display: "flex",
                    flexDirection: "column",
                    height: { xs: "60vh", md: "72vh" },
                    maxWidth: { xs: "100%", md: 540 },
                    width: "100%",
                    borderRadius: "20px",
                    overflow: "hidden",
                    bgcolor: "rgba(255,255,255,0.93)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(168,50,50,0.12)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  {/* Panel header */}
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      borderBottom: "1px solid rgba(15,23,42,0.08)",
                      background:
                        "linear-gradient(to right, rgba(168,50,50,0.06), rgba(168,50,50,0.02))",
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 800, color: COLORS.titleDark, lineHeight: 1.2 }}
                    >
                      Hỏi đáp cùng Bé hạc
                    </Typography>
                    <Typography variant="caption" sx={{ color: COLORS.mutedDark }}>
                      Nhấn giữ micro để trò chuyện
                    </Typography>
                  </Box>

                  {/* Messages area */}
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      px: 2.5,
                      py: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      "&::-webkit-scrollbar": { width: 5 },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: "rgba(0,0,0,0.15)",
                        borderRadius: 4,
                      },
                    }}
                  >
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
                    {isProcessing && (
                      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <TypingDots />
                          <Typography
                            variant="caption"
                            sx={{ color: COLORS.mutedDark, pl: 1, fontWeight: 600 }}
                          >
                            Bé hạc đang suy nghĩ...
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
                      px: 2.5,
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
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onTouchStart={startRecording}
                      onTouchEnd={stopRecording}
                      sx={{
                        flexShrink: 0,
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isRecording ? "#ef4444" : COLORS.accent,
                        color: "#fff",
                        boxShadow: isRecording
                          ? "0 0 0 8px rgba(239,68,68,0.2), 0 4px 16px rgba(239,68,68,0.4)"
                          : "0 4px 14px rgba(168,50,50,0.35)",
                        transform: isRecording ? "scale(1.12)" : "scale(1)",
                        transition: "all 0.2s ease",
                        outline: "none",
                        "&:active": { transform: "scale(0.96)" },
                      }}
                    >
                      {isRecording ? (
                        <GraphicEqIcon sx={{ fontSize: 28 }} />
                      ) : (
                        <MicIcon sx={{ fontSize: 28 }} />
                      )}
                    </Box>

                    {/* Status hint */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isRecording ? "#ef4444" : COLORS.titleDark,
                          fontWeight: 700,
                          transition: "color 0.2s",
                        }}
                      >
                        {isRecording ? "Đang nghe..." : "Nhấn giữ để trả lời"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.mutedDark }}>
                        {isRecording
                          ? "Thả tay để gửi"
                          : "Bé hạc lắng nghe bạn nói"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Footer actions */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      display: "flex",
                      gap: 1,
                      px: 2.5,
                      pb: 2.5,
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
                      Tiếp tục
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
