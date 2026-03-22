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

          {/* YouTube Video Mock */}
          <Box
            sx={{
              mt: { xs: 4, md: 6 },
              position: "relative",
              paddingTop: "56.25%", // 16:9 Aspect Ratio
              width: "100%",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0px 20px 40px rgba(15, 23, 42, 0.08)",
              border: "1px solid rgba(15, 23, 42, 0.06)",
              backgroundColor: "#e2e8f0"
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none"
              }}
              src="https://www.youtube.com/embed/YE7VzlLtp-4?si=placeholder"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </Box>
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
      glyph: "🧩",
    },
    {
      number: "2",
      title: "Quét Mã QR",
      description:
        "Kết nối số: Khai mở bản sắc kỹ thuật số ẩn chứa của những nhân vật huyền thoại.",
      glyph: "📱",
    },
    {
      number: "3",
      title: "Đặt và Phản Chiếu",
      description:
        "Tương tác kỳ diệu: Trải nghiệm trình chiếu ảnh ba chiều (hologram) bên trong chiếc hộp đặc biệt của chúng tôi.",
      glyph: "🔮",
    },
    {
      number: "4",
      title: "Xem và Lắng Nghe",
      description:
        "Câu chuyện sống động: Đắm mình vào những câu chuyện dân gian Việt Nam được kể lại với hình ảnh đầy ấn tượng.",
      glyph: "🎧",
    },
  ];

  return (
    <Box sx={{ position: "relative", backgroundColor: COLORS.surfaceAlt, py: { xs: 7, md: 10 }, overflow: "hidden" }}>
      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 15,
          right: 0,
          opacity: 0.05,
          fontSize: 300,
          fontFamily: "'Material Symbols Outlined', sans-serif",
          pointerEvents: "none",
          transform: "translate(20%, -20%)"
        }}
        aria-hidden
      >
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 15,
          left: 0,
          opacity: 0.05,
          fontSize: 300,
          fontFamily: "'Material Symbols Outlined', sans-serif",
          pointerEvents: "none",
          transform: "translate(-20%, 20%)"
        }}
        aria-hidden
      >
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={6}>
          <Typography
            variant="h2"
            sx={{
              color: "#0f172a",
              fontWeight: 700,
              fontSize: { xs: 26, md: 30 },
              lineHeight: "36px",
              textAlign: "center"
            }}
          >
            4 Bước ma thuật
          </Typography>

          <Box sx={{ position: "relative" }}>
            {/* Connecting Line (Desktop) */}
            <Box
              sx={{
                display: { xs: "none", lg: "block" },
                position: "absolute",
                top: 96,
                left: "12.5%",
                right: "12.5%",
                height: 2,
                borderTop: "2px dashed rgba(168, 50, 50, 0.2)",
                zIndex: 0
              }}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
                columnGap: 6,
                rowGap: 8,
                position: "relative",
                zIndex: 1
              }}
            >
              {steps.map((step) => (
                <Stack key={step.number} alignItems="center" textAlign="center">
                  {/* Image Container */}
                  <Box
                    sx={{
                      width: 192,
                      height: 192,
                      borderRadius: 3,
                      border: "2px solid rgba(168, 50, 50, 0.2)",
                      backgroundColor: COLORS.surfaceAlt,
                      position: "relative",
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "10px",
                        backgroundColor: "rgba(168, 50, 50, 0.05)",
                      }}
                    />
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        p: 2,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 3,
                          backgroundColor: "rgba(168, 50, 50, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 64
                        }}
                      >
                        {step.glyph}
                      </Box>
                    </Box>
                  </Box>

                  {/* Number Badge */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 3,
                      backgroundColor: COLORS.primary,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 16,
                      boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)",
                      mb: 2,
                    }}
                  >
                    {step.number}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h3"
                    sx={{
                      color: "#0f172a",
                      fontWeight: 700,
                      fontSize: 20,
                      lineHeight: "28px",
                      mb: 1
                    }}
                  >
                    {step.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      color: "#475569",
                      fontSize: 14,
                      lineHeight: "20px"
                    }}
                  >
                    {step.description}
                  </Typography>
                </Stack>
              ))}
            </Box>
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

