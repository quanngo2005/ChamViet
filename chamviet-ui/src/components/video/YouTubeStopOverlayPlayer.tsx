import { useState, useRef, useEffect } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Portal from "@mui/material/Portal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

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

const DEFAULT_VIDEO_REGISTRY: VideoRegistry = {
  Mb0RWyh3sqQ: {
    stopTime: 8, // Set to 8s for demonstration
    mascotAvatar: "/assets/be-go.png",
    dialogue: [
      {
        id: 0,
        text: "Hi! I'm Bé Gỗ. Do you like this craft?",
        options: [
          { label: "It's amazing!", nextStep: 1 },
          { label: "Tell me more", nextStep: 2 },
        ],
      },
      {
        id: 1,
        text: "I'm glad you like it! Should we continue exploring?",
        options: [{ label: "Yes, continue", nextStep: -1, isCta: true }],
      },
      {
        id: 2,
        text: "This craft has a long history in our culture. Ready to see how it's made?",
        options: [{ label: "Let's go!", nextStep: -1, isCta: true }],
      },
    ],
  },
};

interface YouTubeStopOverlayPlayerProps {
  videoId: string;
  autoplay?: boolean;
  registry?: VideoRegistry;
  onCtaClick?: (videoId: string, config: VideoStopConfig) => void;
  colors?: any; // Allow passing custom colors
}

export default function YouTubeStopOverlayPlayer({
  videoId,
  autoplay = false,
  registry,
  onCtaClick,
  colors: customColors,
}: YouTubeStopOverlayPlayerProps) {
  const activeColors = customColors || COLORS;
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<number | string>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const triggeredRef = useRef(false);

  const activeRegistry = registry || DEFAULT_VIDEO_REGISTRY;
  const config = activeRegistry[videoId];

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

      // Re-arm logic if user scrubs back
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

  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    // YT.PlayerState.PLAYING = 1
    if (event.data === 1) {
      startPolling();
    } else {
      clearPolling();
    }
  };

  const handleContinue = () => {
    setOverlayOpen(false);
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
    // reset dialogue step
    setTimeout(() => setCurrentStepId(config?.startDialogueId || 0), 500);

    if (onCtaClick && config) {
      onCtaClick(videoId, config);
    }
  };

  const handleReplay = () => {
    setOverlayOpen(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    }
    setTimeout(() => setCurrentStepId(config?.startDialogueId || 0), 500);
  };

  const handleOptionClick = (nextStep: number | string) => {
    if (nextStep === -1 || nextStep === "-1") {
      handleContinue();
    } else {
      setCurrentStepId(nextStep);
    }
  };

  const handleSkip = () => {
    setOverlayOpen(false);
    if (playerRef.current) {
      playerRef.current.playVideo();
      // Ensure we don't trigger again immediately
      triggeredRef.current = true;
    }
    setTimeout(() => setCurrentStepId(config?.startDialogueId || 0), 500);
  };

  const currentStep = config?.dialogues
    ? config.dialogues[currentStepId as string]
    : config?.dialogue?.find((s) => s.id === currentStepId);

  const mascotSrc = config?.mascotAvatarUrl || config?.mascotAvatar || "";

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            rel: 0,
            modestbranding: 1,
            controls: 1,
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      />

      {config && (
        <Portal>
          <Fade in={overlayOpen}>
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                p: { xs: 2.5, md: 6 },
                bgcolor: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Skip Dialog Button container */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 16, md: 32 },
                  right: { xs: 16, md: 32 },
                }}
              >
                <Button
                  onClick={handleSkip}
                  variant="outlined"
                  size="small"
                  endIcon={<CloseIcon fontSize="small" />}
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    textTransform: "none",
                    borderRadius: 8,
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.8)",
                      color: "#fff",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Skip Dialogue
                </Button>
              </Box>

              {/* Dialogue Container */}
              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={{ xs: 2, sm: 3 }}
                alignItems={{ xs: "flex-start", sm: "flex-end" }}
                sx={{ maxWidth: 800 }}
              >
                {/* Mascot Wrapper */}
                <Box
                  sx={{
                    width: { xs: 80, sm: 120, md: 160 },
                    height: { xs: 80, sm: 120, md: 160 },
                    flexShrink: 0,
                    animation: "bounceMascot 3s infinite ease-in-out",
                    transformOrigin: "bottom",
                    "@keyframes bounceMascot": {
                      "0%, 100%": { transform: "translateY(0) scaleY(1)" },
                      "50%": { transform: "translateY(-15px) scaleY(1.02)" },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={mascotSrc}
                    alt="Bé Gỗ Mascot"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.5))",
                    }}
                    onError={(e: any) => {
                      // Fallback if image doesn't exist locally yet
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<div style="width: 100%; height: 100%; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px;">🪵</div>`;
                    }}
                  />
                </Box>

                {/* Chat Bubble Options */}
                <Paper
                  elevation={8}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 4,
                    borderBottomLeftRadius: { sm: 4 },
                    backgroundColor: activeColors.surface,
                    width: "100%",
                    maxWidth: 480,
                    mb: { sm: 2 },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: COLORS.titleDark,
                      mb: 2,
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                      lineHeight: 1.4,
                    }}
                  >
                    {currentStep?.text || "..."}
                  </Typography>

                  <Stack spacing={1.5}>
                    {currentStep?.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant={option.isCta ? "contained" : "outlined"}
                        fullWidth
                        onClick={() => handleOptionClick(option.nextStep)}
                        sx={{
                          py: 1.25,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                          fontWeight: option.isCta ? 700 : 500,
                          justifyContent: "flex-start",
                          textAlign: "left",
                          ...(option.isCta
                            ? {
                                backgroundColor: COLORS.accent,
                                color: "#fff",
                                "&:hover": { backgroundColor: "#8a2828" },
                              }
                            : {
                                borderColor: "rgba(0,0,0,0.12)",
                                color: COLORS.bodyDark,
                                "&:hover": {
                                  borderColor: COLORS.accent,
                                  backgroundColor: "rgba(168, 50, 50, 0.04)",
                                  color: COLORS.accent,
                                },
                              }),
                        }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </Stack>

                  {/* Secondary Actions */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 3, pt: 2, borderTop: "1px solid rgba(0,0,0,0.06)", justifyContent: "space-between" }}
                  >
                    <Button
                      size="small"
                      startIcon={<ReplayIcon />}
                      onClick={handleReplay}
                      sx={{
                        color: COLORS.mutedDark,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { color: COLORS.accent },
                      }}
                    >
                      Replay Video
                    </Button>
                    <Button
                      size="small"
                      endIcon={<PlayArrowIcon />}
                      onClick={handleContinue}
                      sx={{
                        color: COLORS.mutedDark,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { color: COLORS.accent },
                      }}
                    >
                      Continue
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Fade>
        </Portal>
      )}
    </Box>
  );
}
