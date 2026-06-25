import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import YouTubeStopOverlayPlayer, {
  type VideoRegistry,
} from "../components/video/YouTubeStopOverlayPlayer";
import mascot from "@assets/masotknen.webp";
import {
  getDefaultFeaturedStoryEntry,
  findStoryVideoEntryBySlug,
  resolveStoryVideoId,
} from "../data/storyVideoRegistry";
import {
  fetchStoryConfigBySlug,
  extractYouTubeVideoId,
  type StoryConfig,
} from "../data/video-story-qa";
import type { VoiceSessionState } from "../types/voice";

const COLORS = {
  bg: "#1f1313",
  surfaceAlt: "rgba(255, 255, 255, 0.06)",
  title: "#ffffff",
  body: "rgba(255, 255, 255, 0.78)",
  muted: "rgba(255, 255, 255, 0.60)",
  accent: "#a83232",
  accentWarm: "#d4af37",
  borderSoft: "rgba(255, 255, 255, 0.14)",
};

const VIDEO_REGISTRY: VideoRegistry = {
  Mb0RWyh3sqQ: {
    stopTime: 30,
    mascotAvatar: mascot,
    dialogue: [],
  },
};

type WebkitFullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

function isMobileSafariBrowser() {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const vendor = navigator.vendor ?? "";
  const isAppleMobileDevice =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari =
    /Safari/i.test(ua) &&
    /Apple/i.test(vendor) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|OPT\//i.test(ua);

  return isAppleMobileDevice && isSafari;
}

function CinemaHero({
  videoId,
  storyConfig,
  voiceState = "ready",
}: {
  videoId: string;
  storyConfig?: StoryConfig;
  voiceState?: VoiceSessionState;
}) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const prefersViewportFullscreen = useMemo(() => isMobileSafariBrowser(), []);
  const isLandscapePhone = useMediaQuery("(orientation: landscape) and (max-height: 500px)", {
    noSsr: true,
  });

  useEffect(() => {
    const fullscreenDocument = document as WebkitFullscreenDocument;

    const handleFullscreenChange = () => {
      const activeFullscreenElement =
        document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null;
      const isHeroFullscreen = activeFullscreenElement === heroRef.current;
      setIsNativeFullscreen(isHeroFullscreen);
      setIsVideoExpanded(isHeroFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isVideoExpanded || isNativeFullscreen) return undefined;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;
    const originalRootOverflow = document.documentElement.style.overflow;
    const originalRootOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      document.documentElement.style.overflow = originalRootOverflow;
      document.documentElement.style.overscrollBehavior = originalRootOverscroll;
    };
  }, [isNativeFullscreen, isVideoExpanded]);

  const handleToggleFullscreen = async () => {
    const target = heroRef.current;
    if (!target) return;
    const fullscreenDocument = document as WebkitFullscreenDocument;
    const activeFullscreenElement =
      document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null;

    if (isVideoExpanded) {
      if (activeFullscreenElement === target && document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (activeFullscreenElement === target && fullscreenDocument.webkitExitFullscreen) {
        await fullscreenDocument.webkitExitFullscreen();
      } else {
        setIsVideoExpanded(false);
      }
      return;
    }

    if (!prefersViewportFullscreen) {
      try {
        if (target.requestFullscreen) {
          await target.requestFullscreen();
          return;
        } else if ((target as any).webkitRequestFullscreen) {
          await (target as any).webkitRequestFullscreen();
          return;
        }
      } catch {
        // Some mobile browsers reject wrapper fullscreen; fixed viewport mode keeps the demo usable.
      }
    }

    setIsVideoExpanded(true);
  };

  const fullscreenButtonLabel = isVideoExpanded ? "Thu nhỏ video" : "Xem video toàn màn hình";

  return (
    <Box sx={{ py: isLandscapePhone ? 0 : { xs: 2, md: 3 } }}>
      <Container
        maxWidth={isLandscapePhone ? false : "lg"}
        disableGutters={isLandscapePhone}
        sx={isLandscapePhone ? { height: "100vh" } : undefined}
      >
        <Box
          ref={heroRef}
          sx={{
            position: "relative",
            borderRadius: isLandscapePhone ? 0 : { xs: 2.5, md: 4 },
            overflow: "hidden",
            border: isLandscapePhone ? "none" : `1px solid ${COLORS.borderSoft}`,
            boxShadow: isLandscapePhone ? "none" : "0px 28px 70px rgba(0, 0, 0, 0.46)",
            height: isLandscapePhone ? "100vh" : "auto",
            width: "100%",
            backgroundColor: "#000000",
            ...(isVideoExpanded && !isNativeFullscreen
              ? {
                position: "fixed",
                inset: 0,
                zIndex: 1300,
                width: "100vw",
                height: "100vh",
                minHeight: "100svh",
                border: "none",
                borderRadius: 0,
                boxShadow: "none",
                "@supports (height: 100dvh)": {
                  height: "100dvh",
                  minHeight: "100dvh",
                },
              }
              : {}),
            ...(isVideoExpanded
              ? {
                ".story-video-frame": {
                  height: "100%",
                  width: "100%",
                },
              }
              : {}),
            "&:fullscreen": {
              border: "none",
              borderRadius: 0,
              boxShadow: "none",
              height: "100vh",
              width: "100vw",
            },
            "&:fullscreen .story-video-frame": {
              height: "100%",
              width: "100%",
            },
          }}
        >
          <Box
            className="story-video-frame"
            sx={{
              ...(isLandscapePhone
                ? { width: "100%", height: "100%" }
                : { aspectRatio: "16 / 9", width: "100%" }),
              position: "relative",
            }}
          >
            <YouTubeStopOverlayPlayer
              videoId={videoId}
              registry={VIDEO_REGISTRY}
              storyConfig={storyConfig ?? undefined}
              colors={COLORS}
              voiceState={voiceState}
            />
          </Box>
          <Tooltip title={fullscreenButtonLabel}>
            <IconButton
              aria-label={fullscreenButtonLabel}
              onClick={handleToggleFullscreen}
              sx={{
                position: "absolute",
                right: {
                  xs: "calc(env(safe-area-inset-right, 0px) + 10px)",
                  sm: 14,
                },
                top: {
                  xs: "calc(env(safe-area-inset-top, 0px) + 10px)",
                  sm: 14,
                },
                zIndex: 2,
                width: 44,
                height: 44,
                color: "#ffffff",
                backgroundColor: "rgba(15, 23, 42, 0.62)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: "rgba(15, 23, 42, 0.82)",
                },
              }}
            >
              {isVideoExpanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Container>
    </Box>
  );
}

interface BootstrapState {
  fallbackUsed?: boolean;
  storySlug?: string;
  videoId?: string;
}

export default function StoryPage() {
  const { storySlug } = useParams<{ storySlug?: string }>();
  const location = useLocation();
  const bootstrap: BootstrapState = (location.state as BootstrapState | null) ?? {};

  const [storyConfig, setStoryConfig] = useState<StoryConfig | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceSessionState>("initializing");
  const defaultStoryEntry = getDefaultFeaturedStoryEntry();

  const slug = storySlug ?? defaultStoryEntry.slug;

  // ── Phase 1: fetch story content ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    fetchStoryConfigBySlug(slug)
      .then((config) => {
        if (!cancelled) {
          setStoryConfig(config);
          if (!config) {
            setVoiceState("fallback");
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStoryConfig(null);
          setVoiceState("fallback");
        }
      });

    return () => { cancelled = true; };
  }, [slug]);

  // ── Phase 2: voice state is managed by YouTubeStopOverlayPlayer ─────
  useEffect(() => {
    if (storyConfig) {
      setVoiceState("ready");
    }
  }, [storyConfig]);

  // ── Video ID resolution ───────────────────────────────────────────────
  const backendVideoId = storyConfig?.videoUrl
    ? extractYouTubeVideoId(storyConfig.videoUrl)
    : null;
  const storyEntry = storySlug
    ? findStoryVideoEntryBySlug(storySlug)
    : defaultStoryEntry;
  const fallbackVideoId = storySlug
    ? resolveStoryVideoId(storySlug)
    : defaultStoryEntry.videoId;
  const videoId = backendVideoId ?? bootstrap.videoId ?? fallbackVideoId;
  const storyTitle = storyConfig?.storyTitle ?? storyEntry?.title ?? "";

  // ── Banner config ─────────────────────────────────────────────────────
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const showFallbackBanner = voiceState === "fallback" && !bannerDismissed;
  const showUnavailableBanner = voiceState === "unavailable";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 10%, rgba(212, 175, 55, 0.16), transparent 30%), linear-gradient(180deg, #2b1715 0%, #1f1313 42%, #120b0b 100%)",
      }}
    >
      {showFallbackBanner && (
        <Alert
          severity="warning"
          onClose={() => setBannerDismissed(true)}
          sx={{ borderRadius: 0, justifyContent: "center" }}
        >
          Đang dùng nội dung dự phòng. Tính năng giọng nói tạm thời không khả dụng.
        </Alert>
      )}
      {showUnavailableBanner && (
        <Alert
          severity="error"
          sx={{ borderRadius: 0, justifyContent: "center" }}
        >
          Không thể tải nội dung câu chuyện. Vui lòng thử lại sau.
        </Alert>
      )}
      <Box sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 1, md: 1 } }}>
        <Container maxWidth="lg">
          <Typography
            component="h1"
            sx={{
              color: COLORS.title,
              fontSize: { xs: 24, md: 36 },
              fontWeight: 950,
              lineHeight: 1.06,
            }}
          >
            {storyTitle}
          </Typography>
        </Container>
      </Box>
      <CinemaHero
        videoId={videoId}
        storyConfig={storyConfig ?? undefined}
        voiceState={voiceState}
      />
    </Box>
  );
}
