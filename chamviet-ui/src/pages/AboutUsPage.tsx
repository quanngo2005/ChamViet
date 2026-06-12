import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BookOpen, HeartHandshake, Puzzle, ScanLine, Sparkles } from "lucide-react";

import { HOME_IMAGES, HOME_PRODUCT } from "../data/home";

const ABOUT_VALUES = [
  {
    icon: Puzzle,
    title: "Chạm vào văn hóa",
    description: "Bé bắt đầu bằng việc lắp ghép, cầm nắm và quan sát thay vì chỉ xem trên màn hình.",
  },
  {
    icon: Sparkles,
    title: "Công nghệ vừa đủ",
    description: "QR, video phản chiếu và AI hỏi đáp hỗ trợ câu chuyện mà không lấn át trải nghiệm chơi.",
  },
  {
    icon: HeartHandshake,
    title: "Gia đình cùng kể",
    description: "Mỗi box tạo một khoảnh khắc để cha mẹ và bé cùng nói về nhân vật, địa danh và ký ức Việt.",
  },
];

const ABOUT_STEPS = [
  { label: "Puzzle gỗ", icon: Puzzle },
  { label: "Quét tranh", icon: ScanLine },
  { label: "Xem demo", icon: BookOpen },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        color: "var(--primary)",
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: 1.4,
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  );
}

function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, rgba(245, 239, 230, 0.96) 0%, rgba(253, 251, 247, 1) 52%, rgba(255, 248, 226, 0.88) 100%)",
        pt: { xs: 6, md: 9 },
        pb: { xs: 7, md: 10 },
      }}
    >
      <Container maxWidth="xl">
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Stack spacing={2.25} sx={{ flex: 1, maxWidth: 660 }}>
            <SectionLabel>Về Chạm Việt</SectionLabel>
            <Typography
              component="h1"
              sx={{
                color: "var(--text-h)",
                fontSize: { xs: 40, sm: 52, md: 76 },
                fontWeight: 950,
                lineHeight: { xs: 1.04, md: 0.98 },
                letterSpacing: 0,
              }}
            >
              Để câu chuyện Việt được bé tự tay mở ra
            </Typography>
            <Typography
              sx={{
                color: "var(--text-sub)",
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.8,
                maxWidth: 580,
              }}
            >
              Chạm Việt kết hợp puzzle gỗ, hộp Pepper's Ghost và AI hỏi đáp để biến những truyền thuyết
              quen thuộc thành một trải nghiệm chơi, xem và kể lại.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ pt: 1 }}>
              <Button
                component={RouterLink}
                to={`/products/${HOME_PRODUCT.id}`}
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.35,
                  textTransform: "none",
                  fontWeight: 900,
                  backgroundColor: "var(--primary)",
                  "&:hover": { backgroundColor: "var(--primary-dark)" },
                }}
              >
                {HOME_PRODUCT.ctaLabel}
              </Button>
              <Button
                component={RouterLink}
                to="/story"
                variant="outlined"
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.35,
                  textTransform: "none",
                  fontWeight: 850,
                  color: "var(--primary)",
                  borderColor: "rgba(198, 40, 40, 0.24)",
                  "&:hover": {
                    borderColor: "rgba(198, 40, 40, 0.42)",
                    backgroundColor: "rgba(198, 40, 40, 0.05)",
                  },
                }}
              >
                Xem demo
              </Button>
            </Stack>
          </Stack>

          <Box
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: 560,
              position: "relative",
            }}
          >
            <Box
              component="img"
              src={HOME_IMAGES.heroChildArWebp}
              alt="Bé trải nghiệm câu chuyện tương tác Chạm Việt"
              loading="eager"
              decoding="async"
              sx={{
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                borderRadius: { xs: 3, md: 4 },
                border: "1px solid rgba(78, 52, 46, 0.12)",
                boxShadow: "0 28px 60px rgba(78, 52, 46, 0.18)",
              }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function MissionSection() {
  return (
    <Box sx={{ backgroundColor: "var(--bg)", py: { xs: 7, md: 11 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 4, md: 6 }}>
          <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
            <SectionLabel>Sứ mệnh</SectionLabel>
            <Typography
              component="h2"
              sx={{
                color: "var(--text-h)",
                fontSize: { xs: 30, md: 48 },
                fontWeight: 950,
                lineHeight: 1.08,
                letterSpacing: 0,
              }}
            >
              Làm cho di sản dễ chơi hơn, dễ nhớ hơn
            </Typography>
            <Typography sx={{ color: "var(--text-sub)", fontSize: { xs: 15.5, md: 17 }, lineHeight: 1.85 }}>
              Chúng tôi không muốn văn hóa chỉ nằm trong sách hoặc bảo tàng. Mỗi sản phẩm được thiết kế
              như một cây cầu nhỏ: bé lắp ghép bằng tay, xem câu chuyện hiện lên, rồi hỏi lại để hiểu sâu hơn.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {ABOUT_VALUES.map(({ icon: Icon, title, description }) => (
              <Box
                key={title}
                sx={{
                  minHeight: 220,
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.72)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      color: "var(--primary)",
                      backgroundColor: "rgba(198, 40, 40, 0.08)",
                    }}
                  >
                    <Icon size={25} strokeWidth={2.2} />
                  </Box>
                  <Stack spacing={0.75}>
                    <Typography sx={{ color: "var(--text-h)", fontSize: 20, fontWeight: 900 }}>{title}</Typography>
                    <Typography sx={{ color: "var(--text-sub)", fontSize: 14.5, lineHeight: 1.75 }}>
                      {description}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function StorySection() {
  return (
    <Box sx={{ backgroundColor: "#fffaf0", py: { xs: 7, md: 11 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 4, md: 7 }} alignItems="center">
          <Box sx={{ flex: 1, width: "100%" }}>
            <Box
              component="img"
              src={HOME_IMAGES.unboxingFlatlayWebp}
              alt="Bộ box Chạm Việt gồm puzzle và phụ kiện kể chuyện"
              loading="lazy"
              decoding="async"
              sx={{
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                borderRadius: 3,
                border: "1px solid rgba(78, 52, 46, 0.12)",
                boxShadow: "0 20px 44px rgba(78, 52, 46, 0.14)",
              }}
            />
          </Box>

          <Stack spacing={2.25} sx={{ flex: 1 }}>
            <SectionLabel>Cách chúng tôi thiết kế</SectionLabel>
            <Typography
              component="h2"
              sx={{
                color: "var(--text-h)",
                fontSize: { xs: 30, md: 46 },
                fontWeight: 950,
                lineHeight: 1.08,
                letterSpacing: 0,
              }}
            >
              Một sản phẩm nhỏ, ba lớp trải nghiệm
            </Typography>
            <Typography sx={{ color: "var(--text-sub)", fontSize: { xs: 15.5, md: 17 }, lineHeight: 1.85 }}>
              Phần vật lý tạo sự tập trung. Phần phản chiếu tạo cảm giác kỳ diệu. Phần hỏi đáp giúp bé
              nhớ câu chuyện theo lời của mình.
            </Typography>
            <Stack spacing={1.25} sx={{ pt: 1 }}>
              {ABOUT_STEPS.map(({ label, icon: Icon }) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.68)",
                    border: "1px solid rgba(78, 52, 46, 0.10)",
                  }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 1.5,
                      display: "grid",
                      placeItems: "center",
                      color: "var(--secondary)",
                      backgroundColor: "rgba(139, 94, 60, 0.10)",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={21} strokeWidth={2.2} />
                  </Box>
                  <Typography sx={{ color: "var(--text-h)", fontWeight: 850 }}>{label}</Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function FinalCta() {
  return (
    <Box sx={{ backgroundColor: "var(--bg)", py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ xs: "stretch", md: "center" }}>
            <Stack spacing={1.25} sx={{ flex: 1, maxWidth: 680 }}>
              <Typography sx={{ fontSize: { xs: 28, md: 42 }, fontWeight: 950, lineHeight: 1.08, letterSpacing: 0 }}>
                Bắt đầu bằng một câu chuyện quen thuộc
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.80)", fontSize: { xs: 15, md: 16 }, lineHeight: 1.75 }}>
                Box tương tác kể chuyện giúp bé gặp lại Hồ Gươm, Thánh Gióng và những biểu tượng văn hóa Việt
                bằng cách tự tay khám phá.
              </Typography>
            </Stack>
            <Button
              component={RouterLink}
              to={`/products/${HOME_PRODUCT.id}`}
              variant="contained"
              disableElevation
              sx={{
                alignSelf: { xs: "stretch", md: "center" },
                borderRadius: 999,
                px: 3,
                py: 1.35,
                textTransform: "none",
                fontWeight: 950,
                color: "var(--primary)",
                backgroundColor: "#ffffff",
                "&:hover": { backgroundColor: "#fff7df" },
              }}
            >
              {HOME_PRODUCT.ctaLabel}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default function AboutUsPage() {
  return (
    <Box sx={{ width: "100%", backgroundColor: "var(--bg)" }}>
      <HeroSection />
      <MissionSection />
      <StorySection />
      <FinalCta />
    </Box>
  );
}
