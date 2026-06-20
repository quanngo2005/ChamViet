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
    description:
      "Kiến thức không chỉ nằm ở phần đúng sai, mà ở cảm giác trẻ từng tự mình mở ra một câu chuyện.",
  },
  {
    icon: HeartHandshake,
    title: "Một cuộc trò chuyện trong gia đình",
    description:
      "Mỗi lần chơi là một cơ hội để cha mẹ và con cùng hỏi, cùng kể, cùng nối lại ký ức Việt.",
  },
  {
    icon: Sparkles,
    title: "Một tình yêu nhỏ được vun đắp",
    description:
      "Sự tò mò hôm nay có thể trở thành niềm yêu thích văn hóa Việt theo cách tự nhiên nhất.",
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

/* ─────────────────────────────────────────────
   Shared: Gold eyebrow rule — the brand rhythm marker
   Appears before every major section heading.
───────────────────────────────────────────── */
function GoldRule({ light = false }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 3,
        borderRadius: 999,
        backgroundColor: light ? "var(--accent)" : "var(--accent)",
        flexShrink: 0,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   HeroSection
───────────────────────────────────────────── */
function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(140deg, rgba(245,239,230,0.97) 0%, rgba(253,251,247,1) 55%, rgba(255,248,226,0.85) 100%)",
        pt: { xs: 8, md: 12 },
        pb: { xs: 9, md: 15 },
      }}
    >
      {/* Ambient gold glow */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          width: { xs: 280, md: 560 },
          height: { xs: 280, md: 560 },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.11), transparent 68%)",
          top: "-18%",
          right: { xs: "-20%", md: "5%" },
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 5, md: 8 }}
          alignItems="center"
        >
          {/* ── Left: Text ── */}
          <Stack spacing={3} sx={{ flex: 1, maxWidth: 660 }}>
            {/* Category chip */}
            <Box
              sx={{
                display: "inline-flex",
                alignSelf: "flex-start",
                alignItems: "center",
                gap: 1,
                px: 1.75,
                py: 0.65,
                borderRadius: 999,
                border: "1.5px solid rgba(212,175,55,0.4)",
                backgroundColor: "rgba(212,175,55,0.08)",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  color: "var(--secondary)",
                  fontSize: 12.5,
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Đồ chơi giáo dục · Văn hóa Việt
              </Typography>
            </Box>

            {/* Heading */}
            <Typography
              component="h1"
              sx={{
                color: "var(--text-h)",
                fontSize: { xs: 40, sm: 52, md: 72 },
                fontWeight: 950,
                lineHeight: { xs: 1.06, md: 1.0 },
                letterSpacing: "-0.01em",
              }}
            >
              Để mỗi lần chơi là một lần{" "}
              <Box component="span" sx={{ color: "var(--primary)" }}>
                chạm vào văn hóa Việt Nam
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "var(--text-sub)",
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.85,
                maxWidth: 560,
              }}
            >
              Chúng mình tin rằng lịch sử và truyền thuyết Việt không chỉ nên được
              đọc trong sách, mà còn có thể được khám phá bằng đôi tay, trí tò mò
              và những cuộc trò chuyện giữa cha mẹ và con.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                component={RouterLink}
                to={`/products/${HOME_PRODUCT.id}`}
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 999,
                  px: 3.5,
                  py: 1.45,
                  textTransform: "none",
                  fontWeight: 900,
                  fontSize: 15,
                  backgroundColor: "var(--primary)",
                  boxShadow: "0 4px 20px rgba(198,40,40,0.28)",
                  "&:hover": {
                    backgroundColor: "var(--primary-hover)",
                    boxShadow: "0 6px 28px rgba(198,40,40,0.38)",
                  },
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
                  px: 3.5,
                  py: 1.45,
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: 15,
                  color: "var(--text-h)",
                  borderColor: "rgba(78,52,46,0.22)",
                  "&:hover": {
                    borderColor: "rgba(78,52,46,0.40)",
                    backgroundColor: "rgba(78,52,46,0.04)",
                  },
                }}
              >
                Xem trải nghiệm mẫu
              </Button>
            </Stack>
          </Stack>

          {/* ── Right: Image with gold corner brackets ── */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: 540,
              position: "relative",
            }}
          >
            {/* Top-right gold bracket */}
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                top: -14,
                right: -14,
                width: 64,
                height: 64,
                borderTop: "3px solid var(--accent)",
                borderRight: "3px solid var(--accent)",
                borderTopRightRadius: 3,
                opacity: 0.65,
                zIndex: 0,
              }}
            />
            {/* Bottom-left gold bracket */}
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                bottom: -14,
                left: -14,
                width: 64,
                height: 64,
                borderBottom: "3px solid var(--accent)",
                borderLeft: "3px solid var(--accent)",
                borderBottomLeftRadius: 3,
                opacity: 0.65,
                zIndex: 0,
              }}
            />
            <Box
              component="img"
              src={HOME_IMAGES.heroChildArWebp}
              alt="Bé trải nghiệm câu chuyện tương tác Chạm Việt"
              loading="eager"
              decoding="async"
              sx={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                borderRadius: { xs: 3, md: 3 },
                border: "1px solid rgba(78,52,46,0.12)",
                boxShadow: "0 28px 64px rgba(78,52,46,0.18)",
              }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   MissionSection
───────────────────────────────────────────── */
function MissionSection() {
  return (
    <Box sx={{ backgroundColor: "var(--bg-surface)", py: { xs: 10, md: 18 } }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 7, md: 12 }}>

          {/* Heading */}
          <Stack spacing={2} sx={{ maxWidth: 900 }}>
            <GoldRule />
            <Typography
              component="h2"
              sx={{
                color: "var(--text-h)",
                fontSize: { xs: 34, sm: 46, md: 64 },
                fontWeight: 950,
                lineHeight: 1.04,
                letterSpacing: "-0.01em",
              }}
            >
              Có một câu hỏi đã thôi thúc chúng mình
            </Typography>
          </Stack>

          {/* Editorial quote — left border treatment */}
          <Box
            sx={{
              pl: { xs: 3, md: 5 },
              borderLeft: "4px solid var(--primary)",
              position: "relative",
            }}
          >
            {/* Oversized decorative quotation mark */}
            <Typography
              aria-hidden
              sx={{
                position: "absolute",
                top: { xs: -24, md: -40 },
                left: { xs: 12, md: 20 },
                fontSize: { xs: 100, md: 160 },
                fontWeight: 950,
                lineHeight: 1,
                color: "var(--primary)",
                opacity: 0.07,
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              "
            </Typography>
            <Typography
              sx={{
                color: "var(--primary)",
                fontSize: { xs: 21, md: 34 },
                fontWeight: 850,
                lineHeight: 1.32,
                maxWidth: 860,
                position: "relative",
                zIndex: 1,
              }}
            >
              "Làm sao để trẻ em ngày nay có thể hiểu và yêu văn hóa Việt theo một cách thú vị hơn?"
            </Typography>
          </Box>

          {/* Body + image */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "stretch",
            }}
          >
            <Stack spacing={2.75}>
              {[
                "Chúng mình không muốn những truyền thuyết và câu chuyện lịch sử chỉ dừng lại trên những trang sách. Chúng mình muốn mỗi câu chuyện trở thành một trải nghiệm mà trẻ có thể tự tay lắp ghép, tự mình khám phá và hào hứng tìm hiểu theo cách riêng của mình.",
                "Từ những mảnh ghép tranh bằng gỗ, công nghệ AI Vision đến hộp phản chiếu 3D, mọi chi tiết đều được tạo ra để biến việc học thành một hành trình đầy tò mò và bất ngờ.",
                "Thay vì chỉ lắng nghe, các em được nhìn, được chạm, được tương tác và tự mình kết nối những mảnh ghép của câu chuyện.",
                "Bởi chúng mình tin rằng, khi một đứa trẻ thực sự được trải nghiệm, kiến thức sẽ không chỉ dừng lại ở việc ghi nhớ. Nó sẽ trở thành một ký ức đẹp, một niềm yêu thích và là sợi dây kết nối các em với văn hóa Việt theo cách tự nhiên nhất.",
              ].map((text, i) => (
                <Typography
                  key={i}
                  sx={{
                    color: "var(--text-sub)",
                    fontSize: { xs: 16, md: 17.5 },
                    lineHeight: 1.9,
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Stack>

            <Box
              sx={{
                minHeight: { xs: 320, md: "auto" },
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                backgroundImage: `linear-gradient(180deg, rgba(47,29,23,0.05), rgba(47,29,23,0.5)), url(${BOX_IMAGES})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(78,52,46,0.12)",
                boxShadow: "0 24px 60px rgba(78,52,46,0.14)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: "auto 20px 20px 20px",
                  p: 2.5,
                  borderRadius: 2,
                  color: "#ffffff",
                  backgroundColor: "rgba(47,29,23,0.72)",
                  backdropFilter: "blur(16px)",
                  borderTop: "2px solid rgba(212,175,55,0.38)",
                }}
              >
                <Typography
                  sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 950, lineHeight: 1.25 }}
                >
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

/* ─────────────────────────────────────────────
   StorySection  —  two distinct subsections:
   1. DARK: 4 sequential steps
   2. LIGHT: what makes Chạm Việt different
───────────────────────────────────────────── */
function StorySection() {
  return (
    <>
      {/* ── DARK: Steps ── */}
      <Box sx={{ backgroundColor: "#2f1d17", py: { xs: 10, md: 18 } }}>
        <Container maxWidth="xl">
          <Stack spacing={{ xs: 6, md: 9 }}>

            <Stack spacing={2}>
              <GoldRule />
              <Typography
                component="h2"
                sx={{
                  color: "#ffffff",
                  fontSize: { xs: 36, md: 62 },
                  fontWeight: 950,
                  lineHeight: 1.04,
                  letterSpacing: "-0.01em",
                }}
              >
                Hành trình trải nghiệm
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: { xs: 18, md: 24 },
                  fontWeight: 700,
                  lineHeight: 1.3,
                  maxWidth: 620,
                }}
              >
                4 bước để một câu chuyện Việt trở nên sống động
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                gap: { xs: 1.5, md: 2 },
              }}
            >
              {ABOUT_STEPS.map(({ title, description, icon: Icon }, index) => {
                const isAccent = index === 2;
                return (
                  <Box
                    key={title}
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      minHeight: { xs: 230, md: 290 },
                      p: { xs: 2.25, md: 3 },
                      borderRadius: 2.5,
                      backgroundColor: isAccent
                        ? "rgba(212,175,55,0.10)"
                        : "rgba(255,255,255,0.05)",
                      border: isAccent
                        ? "1px solid rgba(212,175,55,0.24)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Large background step number */}
                    <Typography
                      aria-hidden
                      sx={{
                        position: "absolute",
                        bottom: -20,
                        right: -6,
                        fontSize: { xs: 110, md: 130 },
                        fontWeight: 950,
                        lineHeight: 1,
                        color: "#ffffff",
                        opacity: 0.045,
                        userSelect: "none",
                        pointerEvents: "none",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Typography>

                    <Stack
                      spacing={2.5}
                      sx={{
                        height: "100%",
                        justifyContent: "space-between",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1.5,
                          display: "grid",
                          placeItems: "center",
                          color: "var(--accent)",
                          backgroundColor: "rgba(212,175,55,0.14)",
                        }}
                      >
                        <Icon size={22} strokeWidth={2.2} />
                      </Box>

                      {/* Text */}
                      <Stack spacing={0.75}>
                        <Typography
                          sx={{
                            color: "#ffffff",
                            fontSize: { xs: 17, md: 21 },
                            fontWeight: 950,
                            lineHeight: 1.2,
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.55)",
                            fontSize: { xs: 13.5, md: 14.5 },
                            lineHeight: 1.75,
                          }}
                        >
                          {description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ── LIGHT: Difference ── */}
      <Box sx={{ backgroundColor: "var(--bg)", py: { xs: 10, md: 18 } }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "0.85fr 1.15fr" },
              gap: { xs: 5, md: 9 },
              alignItems: "start",
            }}
          >
            <Stack spacing={2} sx={{ position: { lg: "sticky" }, top: { lg: 96 } }}>
              <GoldRule />
              <Typography
                component="h2"
                sx={{
                  color: "var(--text-h)",
                  fontSize: { xs: 34, md: 52 },
                  fontWeight: 950,
                  lineHeight: 1.08,
                  letterSpacing: "-0.01em",
                }}
              >
                Điều khiến Chạm Việt khác biệt
              </Typography>
              <Typography
                sx={{
                  color: "var(--text-sub)",
                  fontSize: { xs: 17, md: 20 },
                  fontWeight: 700,
                  lineHeight: 1.5,
                  maxWidth: 400,
                }}
              >
                Trẻ không chỉ nghe kể. Trẻ được tự mình bước vào câu chuyện.
              </Typography>
            </Stack>

            <Stack spacing={1.25}>
              {DIFFERENCE_POINTS.map((point, i) => (
                <Box
                  key={point}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: { xs: 2, md: 2.5 },
                    borderRadius: 2,
                    backgroundColor: i === 0
                      ? "rgba(198,40,40,0.05)"
                      : "rgba(255,255,255,0.72)",
                    border: i === 0
                      ? "1px solid rgba(198,40,40,0.15)"
                      : "1px solid rgba(78,52,46,0.09)",
                  }}
                >
                  {/* Circle check icon */}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: i === 0
                        ? "var(--primary)"
                        : "rgba(78,52,46,0.08)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="svg"
                      viewBox="0 0 12 12"
                      sx={{ width: 12, height: 12 }}
                    >
                      <polyline
                        points="2,6.5 5,9.5 10,3"
                        fill="none"
                        stroke={i === 0 ? "#ffffff" : "var(--secondary)"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      color: "var(--text-h)",
                      fontSize: { xs: 15.5, md: 17 },
                      fontWeight: i === 0 ? 900 : 750,
                    }}
                  >
                    {point}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}

/* ─────────────────────────────────────────────
   FinalCta
───────────────────────────────────────────── */
function FinalCta() {
  return (
    <Box sx={{ backgroundColor: "var(--bg-surface)", py: { xs: 10, md: 16 } }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 3, md: 4 }}>

          {/* Commitment + Values */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 3, md: 4 },
            }}
          >
            {/* Commitment */}
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                backgroundColor: "#ffffff",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 14px rgba(78,52,46,0.06)",
              }}
            >
              <Stack spacing={3.5}>
                <Stack spacing={1.5}>
                  <GoldRule />
                  <Typography
                    component="h2"
                    sx={{
                      color: "var(--text-h)",
                      fontSize: { xs: 28, md: 42 },
                      fontWeight: 950,
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Cam kết của Chạm Việt
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--text-sub)",
                      fontSize: { xs: 16, md: 19 },
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    Công nghệ hỗ trợ trải nghiệm, còn việc chơi vẫn thuộc về đôi tay của trẻ.
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {COMMITMENT_POINTS.map((point, i) => (
                    <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                      {/* Gold ring bullet */}
                      <Box
                        sx={{
                          mt: 0.55,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: "2px solid var(--accent)",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            backgroundColor: "var(--accent)",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          color: "var(--text-sub)",
                          fontSize: { xs: 15, md: 16.5 },
                          lineHeight: 1.8,
                        }}
                      >
                        {point}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>

            {/* Values — dark panel */}
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                backgroundColor: "#2f1d17",
                color: "#ffffff",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 10% 14%, rgba(212,175,55,0.16), transparent 42%), radial-gradient(circle at 88% 82%, rgba(198,40,40,0.22), transparent 38%)",
                  pointerEvents: "none",
                },
              }}
            >
              <Stack spacing={3.5} sx={{ position: "relative", zIndex: 1 }}>
                <Stack spacing={1.5}>
                  <GoldRule />
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: { xs: 28, md: 42 },
                      fontWeight: 950,
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Giá trị sau mỗi lần chơi
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: { xs: 16, md: 19 },
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    Sau mỗi mảnh ghép được hoàn thành, điều còn lại không chỉ là một bức tranh.
                  </Typography>
                </Stack>

                <Stack spacing={1.25}>
                  {ABOUT_VALUES.map(({ icon: Icon, title, description }) => (
                    <Box
                      key={title}
                      sx={{
                        display: "flex",
                        gap: 2,
                        p: { xs: 2, md: 2.25 },
                        borderRadius: 2,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          mt: 0.2,
                          width: 38,
                          height: 38,
                          borderRadius: 1.5,
                          display: "grid",
                          placeItems: "center",
                          backgroundColor: "rgba(212,175,55,0.14)",
                          color: "var(--accent)",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} strokeWidth={2.2} />
                      </Box>
                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            fontSize: { xs: 15.5, md: 17 },
                            fontWeight: 900,
                            lineHeight: 1.2,
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.58)",
                            fontSize: { xs: 13.5, md: 14.5 },
                            lineHeight: 1.72,
                          }}
                        >
                          {description}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Box>

          {/* Final CTA strip */}
          <Box
            sx={{
              p: { xs: 3.5, md: 6 },
              borderRadius: 3,
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 88% 50%, rgba(255,255,255,0.09), transparent 44%)",
                pointerEvents: "none",
              },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 3, md: 5 }}
              alignItems={{ xs: "flex-start", md: "center" }}
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Stack spacing={1} sx={{ flex: 1, maxWidth: 680 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 26, md: 42 },
                    fontWeight: 950,
                    lineHeight: 1.1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Chúng mình tin rằng, trẻ sẽ yêu văn hóa Việt khi được tự mình khám phá.
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.74)",
                    fontSize: { xs: 15, md: 17 },
                    lineHeight: 1.8,
                  }}
                >
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
                  px: 3.5,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 950,
                  fontSize: 15,
                  color: "var(--primary)",
                  backgroundColor: "#ffffff",
                  whiteSpace: "nowrap",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    backgroundColor: "#fff7df",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 22px rgba(0,0,0,0.14)",
                  },
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

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
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