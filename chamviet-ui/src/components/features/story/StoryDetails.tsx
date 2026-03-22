import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { COLORS, CONTENT } from "./constants";

export function StoryDetails() {
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
