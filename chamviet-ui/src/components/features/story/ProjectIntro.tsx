import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { COLORS, CONTENT } from "./constants";

export function ProjectIntro() {
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
