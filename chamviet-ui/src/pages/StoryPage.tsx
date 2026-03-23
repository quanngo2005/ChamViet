import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import storyVideo from "../data/story-data.json";

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

type StoryVideoContent = {
  hero: { currentTime: string; separator: string; totalTime: string };
  story: {
    category: string;
    title: string;
    meta: string[];
    paragraphs: string[];
    closing: string;
  };
  cta: { title: string; description: string; buttonLabel: string; to: string };
  explore: { title: string; items: Array<{ title: string; meta: string }> };
  projectIntro: { title: string; subtitle: string; buttonLabel: string; to: string };
};

const CONTENT = storyVideo as StoryVideoContent;

function CinemaHero() {
  const [playing, setPlaying] = useState(false);
  const isLandscapePhone = useMediaQuery("(orientation: landscape) and (max-height: 500px)", {
    noSsr: true,
  });

  return (
    <Box sx={{ py: isLandscapePhone ? 0 : { xs: 4, md: 6 } }}>
      <Container
        maxWidth={isLandscapePhone ? false : "lg"}
        disableGutters={isLandscapePhone}
        sx={isLandscapePhone ? { height: "100vh" } : undefined}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: isLandscapePhone ? 0 : 3.5,
            overflow: "hidden",
            border: isLandscapePhone ? "none" : `1px solid ${COLORS.borderSoft}`,
            boxShadow: isLandscapePhone ? "none" : "0px 26px 56px rgba(0, 0, 0, 0.38)",
            height: isLandscapePhone ? "100vh" : "auto",
            width: "100%",
          }}
        >
          <Box
            sx={{
              ...(isLandscapePhone
                ? { width: "100%", height: "100%" }
                : { aspectRatio: "16 / 9", width: "100%" }),
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.70) 100%), radial-gradient(circle at 18% 22%, rgba(168, 50, 50, 0.55) 0%, rgba(168, 50, 50, 0.00) 55%), radial-gradient(circle at 85% 18%, rgba(217, 164, 65, 0.28) 0%, rgba(217, 164, 65, 0.00) 60%)",
              backgroundColor: "#0b0b0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!playing ? (
              <Box
                sx={{
                  width: { xs: 76, md: 96 },
                  height: { xs: 76, md: 96 },
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(168, 50, 50, 0.80)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.25)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                role="button"
                tabIndex={0}
                aria-label="Play story video"
                onClick={() => setPlaying(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setPlaying(true);
                  }
                }}
              >
                <Typography sx={{ color: "#ffffff", fontSize: { xs: 34, md: 42 }, pl: 0.5 }}>
                  ▶
                </Typography>
              </Box>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/Mb0RWyh3sqQ?autoplay=1"
                title="Story Video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </Box>

          {/* <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              px: { xs: 2, md: 3 },
              py: { xs: 1.75, md: 2.25 },
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.80) 100%)",
            }}
          >
            <Stack spacing={1.25}>
              <Slider
                size="small"
                value={28}
                aria-label="Story video progress"
                sx={{
                  color: "#ffffff",
                  "& .MuiSlider-rail": { opacity: 0.28 },
                  "& .MuiSlider-track": { border: "none" },
                  "& .MuiSlider-thumb": {
                    width: 12,
                    height: 12,
                    boxShadow: "0 0 0 4px rgba(255,255,255,0.16)",
                  },
                }}
              />
              <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: 13 }}>
                  {CONTENT.hero.currentTime}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.50)", fontWeight: 700, fontSize: 13 }}>
                  {CONTENT.hero.separator}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: 13 }}>
                  {CONTENT.hero.totalTime}
                </Typography>
              </Stack>
            </Stack>
          </Box> */}
        </Box>
      </Container>
    </Box>
  );
}

function StoryDetails() {
  return (
    <Box sx={{ pb: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            borderRadius: 3.5,
            overflow: "hidden",
            backgroundColor: COLORS.surface,
            border: "1px solid rgba(168, 50, 50, 0.10)",
            boxShadow: "0px 14px 32px rgba(0, 0, 0, 0.18)",
          }}
        >
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5}>
              <Stack spacing={1.25}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 999,
                    backgroundColor: "rgba(168, 50, 50, 0.08)",
                    color: COLORS.accent,
                    fontWeight: 800,
                    letterSpacing: "0.6px",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {CONTENT.story.category}
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    color: COLORS.titleDark,
                    fontWeight: 950,
                    fontSize: { xs: 26, md: 38 },
                    letterSpacing: "-0.6px",
                    lineHeight: 1.15,
                  }}
                >
                  {CONTENT.story.title}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ flexWrap: "wrap", color: COLORS.mutedDark }}
                >
                  {CONTENT.story.meta.map((item) => (
                    <Box
                      key={item}
                      sx={{
                        px: 1.25,
                        py: 0.75,
                        borderRadius: 999,
                        border: "1px solid rgba(148, 163, 184, 0.28)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.mutedDark,
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Stack>
              </Stack>

              <Stack spacing={2}>
                {CONTENT.story.paragraphs.map((paragraph) => (
                  <Typography key={paragraph} sx={{ color: COLORS.bodyDark, fontSize: 16, lineHeight: 1.8 }}>
                    {paragraph}
                  </Typography>
                ))}

                <Divider sx={{ borderColor: "rgba(15, 23, 42, 0.10)" }} />

                <Typography sx={{ color: COLORS.bodyDark, fontSize: 16, lineHeight: 1.8, fontWeight: 650 }}>
                  {CONTENT.story.closing}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

function CallToAction() {
  return (
    <Box sx={{ pb: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            borderRadius: 3.5,
            border: `1px solid ${COLORS.borderSoft}`,
            backgroundColor: COLORS.surfaceAlt,
            boxShadow: "0px 10px 24px rgba(0, 0, 0, 0.20)",
          }}
        >
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={1.25}>
                  <Typography sx={{ color: COLORS.title, fontWeight: 900, fontSize: { xs: 18, md: 22 } }}>
                    {CONTENT.cta.title}
                  </Typography>
                  <Typography sx={{ color: COLORS.body, fontSize: 14.5, lineHeight: 1.7 }}>
                    {CONTENT.cta.description}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Button
                  component={RouterLink}
                  to={CONTENT.cta.to}
                  variant="contained"
                  disableElevation
                  sx={{
                    width: "100%",
                    borderRadius: 2.5,
                    py: 1.4,
                    fontWeight: 900,
                    textTransform: "none",
                    backgroundColor: COLORS.accent,
                    "&:hover": { backgroundColor: "#8a2828" },
                  }}
                >
                  {CONTENT.cta.buttonLabel}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

function ExploreSection({ onSelect }: { onSelect: () => void }) {
  return (
    <Box sx={{ pb: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2.5}>
          <Typography sx={{ color: COLORS.title, fontWeight: 950, fontSize: { xs: 22, md: 28 } }}>
            {CONTENT.explore.title}
          </Typography>

          <Grid container spacing={2.5}>
            {CONTENT.explore.items.map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.22)",
                  }}
                >
                  <CardActionArea
                    sx={{ height: "100%" }}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      onSelect();
                    }}
                  >
                    <Box
                      sx={{
                        aspectRatio: "16 / 9",
                        backgroundImage:
                          "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.68) 100%), radial-gradient(circle at 30% 20%, rgba(168, 50, 50, 0.55) 0%, rgba(168, 50, 50, 0.00) 55%)",
                        backgroundColor: "#0b0b0b",
                      }}
                    />
                    <Box sx={{ p: 2.25 }}>
                      <Stack spacing={0.75}>
                        <Typography sx={{ color: "#ffffff", fontWeight: 900, fontSize: 15, lineHeight: 1.35 }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.70)", fontWeight: 650, fontSize: 13 }}>
                          {item.meta}
                        </Typography>
                      </Stack>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

function ProjectIntro() {
  return (
    <Box sx={{ pb: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <Card
          sx={{
            borderRadius: 3.5,
            overflow: "hidden",
            border: `1px solid ${COLORS.borderSoft}`,
            backgroundColor: "rgba(168, 50, 50, 0.05)",
            boxShadow: "0px 10px 24px rgba(0, 0, 0, 0.18)",
          }}
        >
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={1.75}>
              <Typography sx={{ color: COLORS.title, fontWeight: 950, fontSize: { xs: 20, md: 26 } }}>
                {CONTENT.projectIntro.title}
              </Typography>
              <Typography sx={{ color: COLORS.body, fontSize: 15.5, lineHeight: 1.75, maxWidth: 720 }}>
                {CONTENT.projectIntro.subtitle}
              </Typography>
              <Box>
                <Button
                  component={RouterLink}
                  to={CONTENT.projectIntro.to}
                  variant="outlined"
                  sx={{
                    borderRadius: 2.5,
                    px: 3,
                    py: 1.1,
                    textTransform: "none",
                    fontWeight: 900,
                    borderColor: "rgba(255, 255, 255, 0.22)",
                    color: "#ffffff",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.40)",
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                    },
                  }}
                >
                  {CONTENT.projectIntro.buttonLabel}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

export default function StoryPage() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("Sắp ra mắt");

  return (
    <Box sx={{ backgroundColor: COLORS.bg }}>
      <CinemaHero />
      <StoryDetails />
      <CallToAction />
      <ExploreSection
        onSelect={() => {
          setToastMessage("Danh sách video đang cập nhật.");
          setToastOpen(true);
        }}
      />
      <ProjectIntro />
      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
