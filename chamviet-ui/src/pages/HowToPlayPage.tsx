import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const COLORS = {
  bg: "#fdfbf7",
  surface: "#ffffff",
  surfaceAlt: "#f8f6f6",
  title: "#7a5230",
  body: "#475569",
  muted: "#a17954",
  primary: "#a83232",
  primaryHover: "#8a2828",
};

function HeroSection() {
  return (
    <Box
      sx={{
        backgroundColor: COLORS.bg,
        position: "relative",
        overflow: "hidden",
        py: { xs: 7, md: 10 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -64,
          right: -64,
          width: 240,
          height: 240,
          borderRadius: "24px",
          backgroundColor: "rgba(217, 164, 65, 0.18)",
          filter: "blur(22px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -72,
          left: -72,
          width: 320,
          height: 320,
          borderRadius: "24px",
          backgroundColor: "rgba(168, 50, 50, 0.16)",
          filter: "blur(22px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ maxWidth: 920, mx: "auto", textAlign: "center" }}>
          <Typography
            sx={{
              color: COLORS.primary,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
            }}
          >
            Hành Trình
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: "#0f172a",
              fontWeight: 900,
              fontSize: { xs: 34, md: 56 },
              lineHeight: { xs: "40px", md: "62px" },
              letterSpacing: "-0.8px",
            }}
          >
            Mang Văn Hóa Việt Nam Vào Đời Sống
          </Typography>

          <Typography
            sx={{
              color: COLORS.muted,
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.7,
              maxWidth: 760,
              mx: "auto",
            }}
          >
            Trải nghiệm sự kết hợp kỳ diệu giữa nghề thủ công truyền thống và công nghệ hiện
            đại. Khám phá cách bốn bước đơn giản có thể đưa bạn đến thế giới của những câu
            chuyện dân gian Việt Nam xưa.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function StepsSection() {
  const steps = [
    {
      number: "1",
      title: "Lắp Ghép Puzzle",
      description:
        "Chơi vật lý: Xây dựng thế giới của bạn với những mảnh ghép gỗ thủ công lấy cảm hứng từ đời sống làng quê.",
      accent: "rgba(217, 164, 65, 0.18)",
      glyph: "🧩",
    },
    {
      number: "2",
      title: "Quét Mã QR",
      description:
        "Kết nối số: Khai mở bản sắc kỹ thuật số ẩn chứa của những nhân vật huyền thoại.",
      accent: "rgba(168, 50, 50, 0.12)",
      glyph: "📱",
    },
    {
      number: "3",
      title: "Đặt và Phản Chiếu",
      description:
        "Tương tác kỳ diệu: Trải nghiệm trình chiếu ảnh ba chiều (hologram) bên trong chiếc hộp đặc biệt của chúng tôi.",
      accent: "rgba(34, 197, 94, 0.12)",
      glyph: "🔮",
    },
    {
      number: "4",
      title: "Xem và Lắng Nghe",
      description:
        "Câu chuyện sống động: Đắm mình vào những câu chuyện dân gian Việt Nam được kể lại với hình ảnh đầy ấn tượng.",
      accent: "rgba(59, 130, 246, 0.12)",
      glyph: "🎧",
    },
  ];

  return (
    <Box sx={{ backgroundColor: COLORS.surfaceAlt, py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Stack spacing={1.5} sx={{ textAlign: "center", mx: "auto", maxWidth: 760 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", justifyContent: "center", color: COLORS.title }}
            >
              <Box component="span" sx={{ fontSize: 18, opacity: 0.8 }}>
                ✿
              </Box>
              <Box component="span" sx={{ fontSize: 18, opacity: 0.8 }}>
                ☁
              </Box>
            </Stack>
            <Typography
              variant="h4"
              sx={{
                color: COLORS.title,
                fontWeight: 900,
                fontSize: { xs: 26, md: 36 },
                lineHeight: { xs: "32px", md: "40px" },
              }}
            >
              4 Steps to Magic
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 3,
            }}
          >
            {steps.map((step) => (
              <Card
                key={step.number}
                sx={{
                  borderRadius: 2,
                  backgroundColor: COLORS.surface,
                  border: "1px solid rgba(15, 23, 42, 0.06)",
                  boxShadow: "0px 1px 2px rgba(15, 23, 42, 0.06)",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          backgroundColor: step.accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                        }}
                        aria-hidden
                      >
                        {step.glyph}
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: COLORS.primary,
                            fontWeight: 900,
                            fontSize: 12,
                            letterSpacing: "1.2px",
                            textTransform: "uppercase",
                            lineHeight: "18px",
                          }}
                        >
                          Step {step.number}
                        </Typography>
                        <Typography
                          sx={{
                            color: COLORS.title,
                            fontWeight: 800,
                            fontSize: 18,
                            lineHeight: "26px",
                          }}
                        >
                          {step.title}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography sx={{ color: COLORS.body, fontSize: 14, lineHeight: 1.7 }}>
                      {step.description}
                    </Typography>
                  </Stack>
                </Box>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function TipsForParentsSection() {
  const tips = [
    {
      title: "Cùng nhau tương tác",
      description:
        "Hãy ngồi cùng con và đặt câu hỏi về các nhân vật trong câu chuyện. Nhân vật nào là yêu thích của con? Con đã học được bài học gì?",
      glyph: "🤝",
    },
    {
      title: "Tạo bầu không khí",
      description:
        "Để có trải nghiệm hình ảnh hologram tốt nhất, hãy giảm ánh sáng xung quanh một chút. Điều này sẽ giúp việc kể chuyện trở nên kỳ diệu và tập trung hơn.",
      glyph: "💡",
    },
    {
      title: "Mở rộng câu chuyện",
      description:
        "Hãy khuyến khích con bạn vẽ lại các nhân vật hoặc tái hiện những cảnh trong câu chuyện bằng các mảnh ghép gỗ sau khi video kết thúc.",
      glyph: "🎨",
    },
  ];

  return (
    <Box sx={{ backgroundColor: COLORS.bg, py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <Stack spacing={5}>
          <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
            <Typography
              variant="h4"
              sx={{
                color: COLORS.title,
                fontWeight: 900,
                fontSize: { xs: 24, md: 32 },
                lineHeight: { xs: "30px", md: "38px" },
              }}
            >
              Gợi ý dành cho phụ huynh
            </Typography>
            <Typography sx={{ color: COLORS.muted, fontSize: 16, lineHeight: 1.7 }}>
              Một vài gợi ý nhỏ để buổi chơi cùng con trở nên trọn vẹn và đáng nhớ hơn.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {tips.map((tip) => (
              <Card
                key={tip.title}
                sx={{
                  borderRadius: 2,
                  border: "1px solid rgba(168, 50, 50, 0.08)",
                  boxShadow: "0px 1px 2px rgba(15, 23, 42, 0.06)",
                  backgroundColor: COLORS.surface,
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          backgroundColor: "rgba(168, 50, 50, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                        }}
                        aria-hidden
                      >
                        {tip.glyph}
                      </Box>
                      <Typography sx={{ color: COLORS.title, fontWeight: 800, fontSize: 18 }}>
                        {tip.title}
                      </Typography>
                    </Stack>

                    <Typography sx={{ color: COLORS.body, fontSize: 14, lineHeight: 1.7 }}>
                      {tip.description}
                    </Typography>
                  </Stack>
                </Box>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function FinalCtaSection() {
  return (
    <Box
      sx={{
        backgroundColor: COLORS.primary,
        py: { xs: 7, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack
          spacing={3}
          sx={{
            maxWidth: 840,
            mx: "auto",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              fontSize: { xs: 26, md: 36 },
              lineHeight: { xs: "32px", md: "42px" },
            }}
          >
            Bạn đã sẵn sàng bắt đầu hành trình của mình chưa?
          </Typography>
          <Typography sx={{ opacity: 0.92, fontSize: { xs: 15, md: 18 }, lineHeight: 1.7 }}>
            Hãy chọn truyền thuyết đầu tiên của bạn và chứng kiến lịch sử sống dậy ngay trong
            phòng khách của bạn.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ alignItems: "center", justifyContent: "center", pt: 1 }}
          >
            <Button
              component={RouterLink}
              to="/products"
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: "#ffffff",
                color: COLORS.primary,
                borderRadius: 2,
                px: 3.5,
                py: 1.5,
                fontWeight: 800,
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.92)" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Khám Phá Câu Chuyện
            </Button>

            <Button
              component={RouterLink}
              to="/products"
              variant="outlined"
              sx={{
                borderColor: "rgba(255,255,255,0.4)",
                color: "#ffffff",
                borderRadius: 2,
                px: 3.5,
                py: 1.5,
                fontWeight: 800,
                textTransform: "none",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.6)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Mua Hàng
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default function HowToPlayPage() {
  return (
    <Box sx={{ backgroundColor: COLORS.bg }}>
      <HeroSection />
      <StepsSection />
      <TipsForParentsSection />
      <FinalCtaSection />
    </Box>
  );
}

