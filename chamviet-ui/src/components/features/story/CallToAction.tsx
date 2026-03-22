import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { COLORS, CONTENT } from "./constants";

export function CallToAction() {
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
