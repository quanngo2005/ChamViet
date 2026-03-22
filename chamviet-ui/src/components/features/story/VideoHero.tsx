import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type VideoHeroProps = {
  videoId: string;
  thumbnail?: string;
};

export default function VideoHero({ videoId, thumbnail }: VideoHeroProps) {
  const [playing, setPlaying] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const thumbnailUrl =
    thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3.5,
        overflow: "hidden",
      }}
    >
      <Box sx={{ aspectRatio: "16 / 9", width: "100%" }}>
        {!playing ? (
          <Box
            onClick={() => setPlaying(true)}
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: 36 }}>▶</Typography>
            </Box>
          </Box>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="Story Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </Box>
    </Box>
  );
}