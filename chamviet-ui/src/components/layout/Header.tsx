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
import { Search, Home, User } from "lucide-react";

const navItems = [
  { label: "Giới thiệu", to: "/about" },
  // { label: "Sản Phẩm", to: "/products" },
  { label: "Câu Chuyện", to: "/story" },
  { label: "Cách Chơi", to: "/how-to-play" },
  { label: "Quét Thẻ", to: "/scan" },
  // { label: "Giỏ Hàng", to: "/cart" },
  // { label: "Đăng Nhập", to: "/login" },
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
        backgroundColor: "rgba(245, 239, 230, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        color: "var(--text-sub)",
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
                backgroundColor: "var(--primary)",
                borderRadius: "8px",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "18px",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              🌿
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "var(--primary)", display: { xs: "none", sm: "block" }, letterSpacing: '-0.5px', textTransform: 'uppercase' }}
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
                component={RouterLink}
                to={item.to}
                color="inherit"
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  color: "var(--text-sub)",
                  "&:hover": {
                    color: "var(--primary)",
                    backgroundColor: "transparent"
                  }
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
              to="/"
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s",
                "&:hover": { backgroundColor: "var(--primary-hover)" }
              }}
            >
              <Home size={20} />
            </Box>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "var(--bg)",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { backgroundColor: "var(--bg-container)" }
              }}
            >
              <Search size={20} />
            </Box>
            <Box
              component={RouterLink}
              to="/login"
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "var(--bg)",
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s",
                "&:hover": { backgroundColor: "var(--bg-container)" }
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
                component={RouterLink}
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
