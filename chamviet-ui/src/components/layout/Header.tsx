import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navItems = [
    { label: "Giới thiệu", to: "/about" },
  { label: "Sản Phẩm", to: "/products" },
  { label: "Câu Chuyện", to: "/story" },
  { label: "Cách Chơi", to: "/how-to-play" },
  { label: "Quét Thẻ", to: "/scan" },
  { label :"Giỏ Hàng", to: "/cart" },
  { label: "Đăng Nhập", to: "/login" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(253, 251, 247, 0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(168, 50, 50, 0.08)",
        color: "#7a5230",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 2 }}>
          {/* Logo - Always visible */}
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            color="inherit"
            sx={{ display: "inline-flex", alignItems: "center", gap: 1.25, flexShrink: 0 }}
          >
            <Box
              sx={{
                backgroundColor: "#a83232",
                borderRadius: "6px",
                width: 40,
                height: 40,
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
              variant="h6"
              sx={{ fontWeight: 800, color: "#a83232", display: { xs: "none", sm: "block" } }}
            >
              Chạm Việt
            </Typography>
          </Link>

          <Box sx={{ flex: 1 }} />

          {/* Desktop Navigation - Hidden on mobile */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={RouterLink}
                to={item.to}
                color="inherit"
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#7a5230",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Mobile Hamburger Menu Button - Visible only on mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleMobileMenuToggle}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#a83232",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(253, 251, 247, 0.98)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Box
          sx={{
            width: 280,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <IconButton
              onClick={handleMobileMenuClose}
              sx={{ color: "#a83232" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Mobile Navigation Items */}
          <Stack
            spacing={1}
            sx={{
              px: 2,
              py: 2,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={RouterLink}
                to={item.to}
                onClick={handleMobileMenuClose}
                fullWidth
                color="inherit"
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#7a5230",
                  justifyContent: "flex-start",
                  fontSize: "1rem",
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(168, 50, 50, 0.08)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}
