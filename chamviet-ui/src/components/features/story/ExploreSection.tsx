import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { COLORS, CONTENT } from "./constants";

interface ExploreSectionProps {
  onSelect: () => void;
}

export function ExploreSection({ onSelect }: ExploreSectionProps) {
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
