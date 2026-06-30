import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BookOpen, HeartHandshake, Puzzle, ScanLine, Sparkles } from "lucide-react";

import { HOME_IMAGES, HOME_PRODUCT } from "../data/home";
const BOX_IMAGES = "https://storage.googleapis.com/chamviet-media-bucket-2026/fullbox.webp";

const ABOUT_VALUES = [
  {
    icon: BookOpen,
    title: "Một câu chuyện được ghi nhớ",
    description: "Kiến thức không chỉ nằm ở phần đúng sai, mà ở cảm giác trẻ từng tự mình mở ra một câu chuyện.",
  },
  {
    icon: HeartHandshake,
    title: "Một cuộc trò chuyện trong gia đình",
    description: "Mỗi lần chơi là một cơ hội để cha mẹ và con cùng hỏi, cùng kể, cùng nối lại ký ức Việt.",
  },
  {
    icon: Sparkles,
    title: "Một tình yêu nhỏ được vun đắp",
    description: "Sự tò mò hôm nay có thể trở thành niềm yêu thích văn hóa Việt theo cách tự nhiên nhất.",
  },
];

const ABOUT_STEPS = [
  { title: "Ghép tranh", description: "Hoàn thiện bức tranh gỗ bằng đôi tay và sự quan sát.", icon: Puzzle },
  { title: "Quét sản phẩm", description: "Truy cập website và quét sản phẩm để mở khóa nội dung.", icon: ScanLine },
  { title: "Khám phá hologram", description: "Mô hình phản chiếu 3D đưa câu chuyện hiện lên trước mắt.", icon: Sparkles },
  { title: "Trò chuyện với AI Chíp Bông", description: "Đặt câu hỏi, nghe gợi mở và tìm hiểu sâu hơn theo nhịp riêng.", icon: BookOpen },
];

const DIFFERENCE_POINTS = [
  "Kết hợp trải nghiệm vật lý và công nghệ.",
  "Biến trẻ từ người nghe thành người khám phá.",
  "Khơi gợi sự tò mò thay vì học thuộc.",
  "Tăng thời gian tương tác giữa cha mẹ và con.",
  "Giúp văn hóa Việt trở nên gần gũi và dễ nhớ hơn.",
];

const COMMITMENT_POINTS = [
  "Tấm ghép tranh gỗ chắc chắn, có thể sử dụng nhiều lần.",
  "Công nghệ chỉ đóng vai trò hỗ trợ, không thay thế việc chơi trực tiếp.",
  "Khuyến khích sử dụng cùng phụ huynh để tăng hiệu quả học tập và gắn kết gia đình.",
];

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
              Để mỗi lần chơi là một lần chạm vào văn hóa Việt Nam
            </Typography>
            <Typography
              sx={{
                color: "var(--text-sub)",
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.8,
                maxWidth: 580,
              }}
            >
              Chúng mình tin rằng lịch sử và truyền thuyết Việt không chỉ nên được đọc trong sách, mà còn có thể được khám phá bằng đôi tay, trí tò mò và những cuộc trò chuyện giữa cha mẹ và con.
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
                Xem trải nghiệm mẫu
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
    <Box sx={{ backgroundColor: "var(--bg)", py: { xs: 9, md: 16 } }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 4, md: 7 }}>
          <Stack spacing={2.5} sx={{ maxWidth: 1120 }}>
            <Typography
              component="h2"
              sx={{
                color: "var(--text-h)",
                fontSize: { xs: 34, sm: 46, md: 68 },
                fontWeight: 950,
                lineHeight: 1.02,
                letterSpacing: 0,
              }}
            >
              Có một câu hỏi đã thôi thúc chúng mình
            </Typography>
            <Typography
              sx={{
                color: "var(--text-h)",
                fontSize: { xs: 22, md: 34 },
                fontWeight: 850,
                lineHeight: 1.25,
                maxWidth: 980,
              }}
            >
              “Làm sao để trẻ em ngày nay có thể hiểu và yêu văn hóa Việt theo một cách thú vị hơn?”
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.15fr 0.85fr" },
              gap: { xs: 3, md: 4 },
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.74)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Stack spacing={2.5}>
                {[
                  "Chúng mình không muốn những truyền thuyết và câu chuyện lịch sử chỉ dừng lại trên những trang sách. Chúng mình muốn mỗi câu chuyện trở thành một trải nghiệm mà trẻ có thể tự tay lắp ghép, tự mình khám phá và hào hứng tìm hiểu theo cách riêng của mình.",
                  "Từ những mảnh ghép tranh bằng gỗ, công nghệ AI Vision đến hộp phản chiếu 3D, mọi chi tiết đều được tạo ra để biến việc học thành một hành trình đầy tò mò và bất ngờ.",
                  "Thay vì chỉ lắng nghe, các em được nhìn, được chạm, được tương tác và tự mình kết nối những mảnh ghép của câu chuyện.",
                  "Bởi chúng mình tin rằng, khi một đứa trẻ thực sự được trải nghiệm, kiến thức sẽ không chỉ dừng lại ở việc ghi nhớ. Nó sẽ trở thành một ký ức đẹp, một niềm yêu thích và là sợi dây kết nối các em với văn hóa Việt theo cách tự nhiên nhất.",
                ].map((paragraph) => (
                  <Typography
                    key={paragraph}
                    sx={{ color: "var(--text-sub)", fontSize: { xs: 16, md: 18 }, lineHeight: 1.85 }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                minHeight: { xs: 340, md: "auto" },
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                backgroundImage: `linear-gradient(180deg, rgba(47, 29, 23, 0.08), rgba(47, 29, 23, 0.42)), url(${BOX_IMAGES})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(78, 52, 46, 0.14)",
                boxShadow: "0 28px 70px rgba(78, 52, 46, 0.16)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: "auto 20px 20px 20px",
                  p: 2.25,
                  borderRadius: 2,
                  color: "#ffffff",
                  backgroundColor: "rgba(47, 29, 23, 0.72)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <Typography sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 950, lineHeight: 1.2 }}>
                  Học bằng mắt, bằng tay, bằng câu hỏi và bằng sự háo hức.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function StorySection() {
  return (
    <Box sx={{ backgroundColor: "#fffaf0", py: { xs: 9, md: 16 } }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 5, md: 8 }}>
          <Stack spacing={1.5} sx={{ maxWidth: 920 }}>
            <Typography
              component="h2"
              sx={{
                color: "var(--text-h)",
                fontSize: { xs: 38, md: 64 },
                fontWeight: 950,
                lineHeight: 1.04,
                letterSpacing: 0,
              }}
            >
              Hành trình trải nghiệm
            </Typography>
            <Typography
              sx={{
                color: "var(--text-sub)",
                fontSize: { xs: 19, md: 28 },
                fontWeight: 800,
                lineHeight: 1.28,
                maxWidth: 760,
              }}
            >
              4 bước để một câu chuyện Việt trở nên sống động
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
              gridAutoFlow: "dense",
              gap: 1.5,
            }}
          >
            {ABOUT_STEPS.map(({ title, description, icon: Icon }, index) => (
              <Box
                key={title}
                sx={{
                  minHeight: { xs: 210, md: index === 1 ? 300 : 250 },
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 2,
                  backgroundColor: index === 2 ? "rgba(255, 247, 223, 0.84)" : "rgba(255, 255, 255, 0.78)",
                  color: "var(--text-h)",
                  border: index === 2 ? "1px solid rgba(139, 94, 60, 0.16)" : "1px solid rgba(78, 52, 46, 0.10)",
                  boxShadow: index === 2 ? "0 22px 52px rgba(78, 52, 46, 0.12)" : "var(--shadow-sm)",
                }}
              >
                <Stack spacing={2.5} sx={{ height: "100%", justifyContent: "space-between" }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        color: index === 2 ? "var(--secondary)" : "var(--primary)",
                        backgroundColor: index === 2 ? "rgba(139, 94, 60, 0.10)" : "rgba(198, 40, 40, 0.08)",
                      }}
                    >
                      <Icon size={24} strokeWidth={2.2} />
                    </Box>
                    <Typography sx={{ color: "var(--text-sub)", fontWeight: 950 }}>
                      {String(index + 1).padStart(2, "0")}
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography sx={{ fontSize: { xs: 22, md: 24 }, fontWeight: 950, lineHeight: 1.15 }}>{title}</Typography>
                    <Typography
                      sx={{
                        color: "var(--text-sub)",
                        fontSize: 15,
                        lineHeight: 1.75,
                      }}
                    >
                      {description}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "0.9fr 1.1fr" },
              gap: { xs: 3, md: 5 },
              alignItems: "start",
            }}
          >
            <Stack spacing={1.5} sx={{ position: { lg: "sticky" }, top: { lg: 96 } }}>
              <Typography
                component="h2"
                sx={{
                  color: "var(--text-h)",
                  fontSize: { xs: 34, md: 52 },
                  fontWeight: 950,
                  lineHeight: 1.08,
                  letterSpacing: 0,
                }}
              >
                Điều khiến Chạm Việt khác biệt
              </Typography>
              <Typography
                sx={{
                  color: "var(--text-sub)",
                  fontSize: { xs: 17, md: 22 },
                  fontWeight: 750,
                  lineHeight: 1.45,
                }}
              >
                Trẻ không chỉ nghe kể. Trẻ được tự mình bước vào câu chuyện.
              </Typography>
            </Stack>

            <Stack spacing={1.25}>
              {DIFFERENCE_POINTS.map((point) => (
                <Box
                  key={point}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: { xs: 2, md: 2.25 },
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.76)",
                    border: "1px solid rgba(78, 52, 46, 0.10)",
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "var(--primary)",
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ color: "var(--text-h)", fontSize: { xs: 16, md: 18 }, fontWeight: 800 }}>
                    {point}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function FinalCta() {
  return (
    <Box sx={{ backgroundColor: "var(--bg)", py: { xs: 9, md: 15 } }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 4, md: 6 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "0.92fr 1.08fr" },
              gap: { xs: 3, md: 4 },
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.76)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Stack spacing={2.5}>
                <Stack spacing={1.25}>
                  <Typography
                    component="h2"
                    sx={{
                      color: "var(--text-h)",
                      fontSize: { xs: 34, md: 52 },
                      fontWeight: 950,
                      lineHeight: 1.08,
                    }}
                  >
                    Cam kết của Chạm Việt
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--text-sub)",
                      fontSize: { xs: 17, md: 22 },
                      fontWeight: 750,
                      lineHeight: 1.45,
                    }}
                  >
                    Công nghệ hỗ trợ trải nghiệm, còn việc chơi vẫn thuộc về đôi tay của trẻ.
                  </Typography>
                </Stack>
                <Stack spacing={1.25}>
                  {COMMITMENT_POINTS.map((point) => (
                    <Typography key={point} sx={{ color: "var(--text-sub)", fontSize: { xs: 15.5, md: 17 }, lineHeight: 1.8 }}>
                      {point}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: 2,
                backgroundColor: "#2f1d17",
                color: "#ffffff",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 12% 20%, rgba(255, 214, 128, 0.22), transparent 34%), radial-gradient(circle at 86% 78%, rgba(198, 40, 40, 0.26), transparent 36%)",
                },
              }}
            >
              <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
                <Stack spacing={1.25}>
                  <Typography
                    component="h2"
                    sx={{ fontSize: { xs: 34, md: 52 }, fontWeight: 950, lineHeight: 1.08, letterSpacing: 0 }}
                  >
                    Giá trị sau mỗi lần chơi
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.78)",
                      fontSize: { xs: 17, md: 22 },
                      fontWeight: 750,
                      lineHeight: 1.45,
                    }}
                  >
                  Sau mỗi mảnh ghép được hoàn thành, điều còn lại không chỉ là một bức tranh.
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                    gap: 1,
                  }}
                >
                  {ABOUT_VALUES.map(({ icon: Icon, title, description }) => (
                    <Box
                      key={title}
                      sx={{
                        minHeight: 210,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.10)",
                        border: "1px solid rgba(255, 255, 255, 0.14)",
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Icon size={24} strokeWidth={2.2} />
                        <Typography sx={{ fontSize: 18, fontWeight: 950, lineHeight: 1.2 }}>{title}</Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.76)", fontSize: 14.5, lineHeight: 1.65 }}>
                          {description}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ xs: "stretch", md: "center" }}>
              <Stack spacing={1.25} sx={{ flex: 1, maxWidth: 760 }}>
                <Typography sx={{ fontSize: { xs: 28, md: 44 }, fontWeight: 950, lineHeight: 1.08, letterSpacing: 0 }}>
                  Chúng mình tin rằng, trẻ sẽ yêu văn hóa Việt khi được tự mình khám phá.
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: { xs: 15, md: 17 }, lineHeight: 1.75 }}>
                  Khám phá bộ sưu tập Chạm Việt và bắt đầu hành trình cùng con ngay hôm nay.
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
                Khám phá bộ sưu tập
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default function AboutUsPage() {
  return (
    <Box sx={{ width: "100%", backgroundColor: "var(--bg)", "& p": { textAlign: "justify" } }}>
      <HeroSection />
      <MissionSection />
      <StorySection />
      <FinalCta />
    </Box>
  );
}
