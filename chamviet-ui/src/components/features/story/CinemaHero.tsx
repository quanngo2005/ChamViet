import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { COLORS } from "./constants";

interface CinemaHeroProps {
  onPlay?: () => void;
}

export function CinemaHero({ onPlay }: CinemaHeroProps) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    } else {
      setPlaying(true);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: "relative",
            borderRadius: 3.5,
            overflow: "hidden",
            border: `1px solid ${COLORS.borderSoft}`,
            boxShadow: "0px 26px 56px rgba(0, 0, 0, 0.38)",
          }}
        >
          <Box sx={{ aspectRatio: "16 / 9", width: "100%" }}>
            {!playing ? (
              // Thumbnail + Play button
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundImage:
                    "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.70) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={handlePlay}
              >
                <Typography sx={{ fontSize: 48, color: "#fff" }}>
                  ▶
                </Typography>
              </Box>
            ) : (
              // YouTube iframe
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
        </Box>
      </Container>
    </Box>
  );
}
