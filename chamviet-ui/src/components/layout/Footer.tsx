import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const linkGroups = [
  {
    title: "Liên kết",
    links: [
      { label: "Trang chủ", to: "/" },
      { label: "Giới thiệu", to: "/about" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Login", to: "/login" },
    ],
  },
  {
    title: "Thông tin",
    links: [
      { label: "Về chúng tôi", to: "/about" },
      { label: "Chính sách bảo mật", to: "/401" },
      { label: "Hỗ trợ khách hàng", to: "/login" },
      { label: "Liên hệ", to: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "rgba(168, 50, 50, 0.05)",
        borderTop: "1px solid rgba(168, 50, 50, 0.1)",
        py: { xs: 5, md: 8 },
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 4, md: 6 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
              gap: { xs: 4, md: 6 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Box>
              <Stack spacing={3}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: "center", md: "flex-start" }}>
                  <Box
                    sx={{
                      backgroundColor: "#a83232",
                      borderRadius: "6px",
                      width: { xs: 36, md: 40 },
                      height: { xs: 36, md: 40 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fdfbf7",
                      fontSize: "18px",
                    }}
                  >
                    🌿
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "20px", md: "24px" },
                      color: "#a83232",
                    }}
                  >
                    Chạm Việt
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontSize: { xs: "14.5px", md: "16px" },
                    color: "#475569",
                    lineHeight: 1.5,
                    maxWidth: { xs: "none", md: 384 },
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  Chúng tôi kiến tạo những giá trị giáo dục bền vững thông qua chất liệu gỗ tự
                  nhiên và kho tàng văn hóa dân gian Việt Nam.
                </Typography>
              </Stack>
            </Box>

            {linkGroups.map((group) => (
              <Box key={group.title}>
                <Stack spacing={3}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "14px",
                      color: "#0f172a",
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                    }}
                  >
                    {group.title}
                  </Typography>
                  <Stack spacing={2} sx={{ alignItems: { xs: "center", md: "flex-start" } }}>
                    {group.links.map((link) => (
                      <Link
                        key={link.label}
                        component={RouterLink}
                        to={link.to}
                        underline="hover"
                        sx={{
                          color: "#475569",
                          fontSize: "14px",
                          width: "fit-content",
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              borderTop: "1px solid rgba(168, 50, 50, 0.1)",
              pt: { xs: 3, md: 4 },
            }}
          >
            <Typography sx={{ fontSize: "12px", color: "#64748b", textAlign: { xs: "center", md: "left" } }}>
              © 2024 Chạm Việt. Tất cả quyền được bảo lưu.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
