import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import storyVideo from "../data/story-data.json";
import YouTubeStopOverlayPlayer, {
  type VideoRegistry,
  type VideoStopConfig,
} from "../components/video/YouTubeStopOverlayPlayer";
import mascotHac from "../assets/be-hac.png";
import { HOME_PRODUCT } from "../data/home";
import {
  findStoryVideoEntryBySlug,
  getDefaultStoryVideoEntry,
  resolveStoryVideoId,
} from "../data/storyVideoRegistry";

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

type StoryVideoContent = {
  story: {
    category: string;
    title: string;
    paragraphs: string[];
  };
  cta: { buttonLabel: string; to: string };
};

const CONTENT = storyVideo as StoryVideoContent;

const VIDEO_REGISTRY: VideoRegistry = {
  Mb0RWyh3sqQ: {
    stopTime: 30,
    mascotAvatar: mascotHac,
    dialogue: [],
  },
};

function DemoIntro({ storyTitle }: { storyTitle: string }) {
  return (
    <Box sx={{ pt: { xs: 5, md: 8 }, pb: { xs: 2.5, md: 3 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2.25} sx={{ maxWidth: 840 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignSelf: "flex-start",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: 999,
              color: "#fff7df",
              backgroundColor: "rgba(212, 175, 55, 0.12)",
              border: "1px solid rgba(212, 175, 55, 0.30)",
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
            Pepper's Ghost Demo
          </Box>

          <Stack spacing={1.5}>
            <Typography
              component="h1"
              sx={{
                color: COLORS.title,
                fontSize: { xs: 34, sm: 44, md: 68 },
                fontWeight: 950,
                lineHeight: { xs: 1.05, md: 0.98 },
                letterSpacing: 0,
                maxWidth: 760,
              }}
            >
              Xem demo kể chuyện tương tác
            </Typography>
            <Typography
              sx={{
                color: COLORS.body,
                fontSize: { xs: 15.5, md: 18 },
                lineHeight: { xs: 1.75, md: 1.7 },
                maxWidth: 680,
              }}
            >
              Đặt điện thoại lên hộp phản chiếu để xem {storyTitle || CONTENT.story.title} hiện lên như một
              sân khấu nhỏ. Video có thể được lấy từ backend bằng <Box component="span" sx={{ fontWeight: 800 }}>videoUrl</Box> khi dữ liệu sẵn sàng.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function CinemaHero({
  videoId,
  onCtaClick,
}: {
  videoId: string;
  onCtaClick?: (videoId: string, config: VideoStopConfig) => void;
}) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const isLandscapePhone = useMediaQuery("(orientation: landscape) and (max-height: 500px)", {
    noSsr: true,
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isHeroFullscreen = document.fullscreenElement === heroRef.current;
      setIsNativeFullscreen(isHeroFullscreen);
      setIsVideoExpanded(isHeroFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isVideoExpanded || isNativeFullscreen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isNativeFullscreen, isVideoExpanded]);

  const handleToggleFullscreen = async () => {
    const target = heroRef.current;
    if (!target) return;

    if (isVideoExpanded) {
      if (document.fullscreenElement === target) {
        await document.exitFullscreen();
      } else {
        setIsVideoExpanded(false);
      }
      return;
    }

    if (target.requestFullscreen) {
      try {
        await target.requestFullscreen();
        return;
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
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "none",
                  "@supports (height: 100dvh)": {
                    height: "100dvh",
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
              colors={COLORS}
              onCtaClick={onCtaClick}
            />
          </Box>
          <Tooltip title={fullscreenButtonLabel}>
            <IconButton
              aria-label={fullscreenButtonLabel}
              onClick={handleToggleFullscreen}
              sx={{
                position: "absolute",
                right: { xs: 10, sm: 14 },
                top: { xs: 10, sm: 14 },
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

function DemoActions() {
  return (
    <Box sx={{ pt: { xs: 2.5, md: 3 }, pb: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            backgroundColor: COLORS.surfaceAlt,
            border: `1px solid ${COLORS.borderSoft}`,
          }}
        >
          <Typography sx={{ color: COLORS.muted, fontSize: { xs: 14.5, md: 15.5 }, lineHeight: 1.65 }}>
            Demo hiện dùng video mặc định khi backend chưa trả <Box component="span" sx={{ fontWeight: 800 }}>videoUrl</Box>.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              component={RouterLink}
              to="/scan"
              variant="outlined"
              sx={{
                borderRadius: 999,
                px: 2.4,
                py: 1.1,
                textTransform: "none",
                fontWeight: 850,
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.24)",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.46)",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                },
              }}
            >
              Mở scan
            </Button>
            <Button
              component={RouterLink}
              to={CONTENT.cta.to}
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 999,
                px: 2.6,
                py: 1.1,
                textTransform: "none",
                fontWeight: 900,
                backgroundColor: COLORS.accent,
                "&:hover": { backgroundColor: "#8a2828" },
              }}
            >
              {HOME_PRODUCT.ctaLabel || CONTENT.cta.buttonLabel}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default function StoryPage() {
  const { storySlug } = useParams<{ storySlug?: string }>();
  const [toastOpen, setToastOpen] = useState(false);
  const storyEntry = storySlug ? findStoryVideoEntryBySlug(storySlug) : getDefaultStoryVideoEntry();
  const videoId = storySlug ? resolveStoryVideoId(storySlug) : getDefaultStoryVideoEntry().videoId;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 10%, rgba(212, 175, 55, 0.16), transparent 30%), linear-gradient(180deg, #2b1715 0%, #1f1313 42%, #120b0b 100%)",
      }}
    >
      <DemoIntro storyTitle={storyEntry?.title ?? CONTENT.story.title} />
      <CinemaHero
        videoId={videoId}
        onCtaClick={() => {
          setToastOpen(true);
        }}
      />
      <DemoActions />
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        message="Demo hỏi đáp đang mở trong video."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
