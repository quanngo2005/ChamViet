import { useEffect, useState } from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";

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
import { Sprout, User } from "lucide-react";

const navItems = [
  { label: "Giới thiệu", to: "/about" },
  // { label: "Sản Phẩm", to: "/products" },
  { label: "Câu Chuyện", to: "/story" },
  { label: "Cách Chơi", to: "/how-to-play" },
  { label: "Mở câu chuyện", to: "/scan" },
  // { label: "Giỏ Hàng", to: "/cart" },
  // { label: "Đăng Nhập", to: "/login" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        backgroundColor: scrolled ? "rgba(253, 251, 247, 0.94)" : "rgba(245, 239, 230, 0.78)",
        backdropFilter: scrolled ? "blur(18px)" : "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(78, 52, 46, 0.14)" : "1px solid transparent",
        color: "var(--text-sub)",
        transition: "background-color 180ms ease, backdrop-filter 180ms ease, border-color 180ms ease",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: scrolled ? 68 : 76 },
            gap: 2,
            transition: "min-height 180ms ease",
          }}
        >
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
                backgroundColor: "var(--primary)",
                borderRadius: "8px",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <Sprout size={22} strokeWidth={2.4} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "var(--primary)",
                display: { xs: "none", sm: "block" },
                letterSpacing: 0,
                textTransform: "uppercase",
              }}
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
              mr: 4
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                color="inherit"
                disableRipple
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  color: "var(--text-sub)",
                  px: 1.75,
                  py: 1,
                  borderRadius: "999px",
                  position: "relative",
                  transition: "color 160ms ease, background-color 160ms ease, transform 160ms ease",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 7,
                    height: 2,
                    borderRadius: "999px",
                    background: "linear-gradient(90deg, var(--primary), var(--accent))",
                    transform: "scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform 180ms ease",
                  },
                  "&.active": {
                    color: "var(--primary)",
                    backgroundColor: "rgba(198, 40, 40, 0.08)",
                  },
                  "&.active::after": {
                    transform: "scaleX(1)",
                  },
                  "&:hover": {
                    color: "var(--primary)",
                    backgroundColor: "rgba(198, 40, 40, 0.05)",
                    transform: "translateY(-1px)",
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Action Icons matching Global Design */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
            <Box
              component={RouterLink}
              to="/login"
              sx={{
                width: 44,
                height: 44,
                backgroundColor: "var(--bg)",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s",
                border: "1px solid rgba(78, 52, 46, 0.1)",
                "&:hover": {
                  backgroundColor: "white",
                  borderColor: "rgba(198, 40, 40, 0.18)",
                  color: "var(--primary)",
                }
              }}
            >
              <User size={20} />
            </Box>
          </Stack>

          {/* Mobile Hamburger Menu Button - Visible only on mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleMobileMenuToggle}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "var(--primary)",
              width: 44,
              height: 44,
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
            borderLeft: "1px solid var(--border)"
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
              sx={{ color: "var(--primary)" }}
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
                component={NavLink}
                to={item.to}
                onClick={handleMobileMenuClose}
                fullWidth
                color="inherit"
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  color: "var(--text-sub)",
                  justifyContent: "flex-start",
                  fontSize: "1rem",
                  py: 1.5,
                  borderRadius: '12px',
                  "&.active": {
                    backgroundColor: "rgba(198, 40, 40, 0.08)",
                    color: "var(--primary)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(198, 40, 40, 0.05)",
                    color: "var(--primary)"
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
