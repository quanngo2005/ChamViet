import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink, NavLink, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { HOME_PRODUCT } from "../../data/home";
import { getFeaturedStoryVideoEntries } from "../../data/storyVideoRegistry";

const productPath = `/products/${HOME_PRODUCT.id}`;

const storyMenuItems = getFeaturedStoryVideoEntries().map((entry) => ({
  label: entry.title,
  to: `/story/${entry.slug}`,
}));

const primaryNavItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Về Chúng Mình", to: "/about" },
  { label: "Sản phẩm", to: productPath },
  { label: "Cách chơi", to: "/how-to-play" },
  { label: "Quét tranh", to: "/scan" },
];

const desktopNavButtonSx = {
  fontWeight: 600,
  textTransform: "none",
  color: "var(--text-sub)",
  px: 1.75,
  py: 1,
  borderRadius: "999px",
  position: "relative",
  WebkitTapHighlightColor: "transparent",
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
  "&:hover": {
    color: "var(--primary)",
    backgroundColor: "rgba(198, 40, 40, 0.05)",
    transform: "translateY(-1px)",
  },
  "&:hover::after": {
    transform: "scaleX(1)",
  },
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [storyMenuAnchorEl, setStoryMenuAnchorEl] = useState<HTMLElement | null>(null);
  const location = useLocation();
  const storyMenuOpen = Boolean(storyMenuAnchorEl);
  const isStoryRoute = location.pathname === "/story" || location.pathname.startsWith("/story/");

  const isActiveRoute = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

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

  const handleStoryMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setStoryMenuAnchorEl(event.currentTarget);
  };

  const handleStoryMenuClose = () => {
    setStoryMenuAnchorEl(null);
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
            sx={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}
          >
            <Box
              component="img"
              src="https://storage.googleapis.com/chamviet-media-bucket-2026/cham_viet_logo_red_transparent.png" // Đường dẫn tới file ảnh của bạn
              alt="Chạm Việt"
              sx={{
                height: { xs: 36, sm: 44 }, // Tự động co giãn chiều cao theo màn hình
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Link>


          <Box sx={{ flex: 1 }} />

          {/* Desktop Navigation - Hidden on mobile */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              mr: 2
            }}
          >
            {primaryNavItems.map((item) => {
              const active = isActiveRoute(item.to);
              return (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  color="inherit"
                  disableRipple
                  sx={{
                    ...desktopNavButtonSx,
                    fontWeight: active ? 700 : 600,
                    color: active ? "var(--primary)" : desktopNavButtonSx.color,
                    "&::after": {
                      ...desktopNavButtonSx["&::after"],
                      transform: active ? "scaleX(1)" : "scaleX(0)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            <Button
              id="story-menu-button"
              color="inherit"
              disableRipple
              aria-controls={storyMenuOpen ? "story-menu" : undefined}
              aria-expanded={storyMenuOpen ? "true" : undefined}
              aria-haspopup="menu"
              onClick={handleStoryMenuOpen}
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
              sx={{
                ...desktopNavButtonSx,
                fontWeight: isStoryRoute ? 700 : 600,
                color: isStoryRoute ? "var(--primary)" : desktopNavButtonSx.color,
                "&::after": {
                  ...desktopNavButtonSx["&::after"],
                  transform: isStoryRoute ? "scaleX(1)" : "scaleX(0)",
                },
              }}
            >
              Câu chuyện
            </Button>
          </Stack>

          <Button
            component={RouterLink}
            to={productPath}
            variant="contained"
            disableElevation
            endIcon={<ArrowForwardIcon sx={{ fontSize: 17 }} />}
            sx={{
              display: { xs: "none", md: "inline-flex" },
              minHeight: 46,
              borderRadius: "999px",
              px: 2.4,
              color: "#ffffff",
              backgroundColor: "var(--primary)",
              fontWeight: 850,
              textTransform: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 12px 26px rgba(198, 40, 40, 0.20)",
              WebkitTapHighlightColor: "transparent",
              "&:hover": {
                backgroundColor: "var(--primary-hover)",
                transform: "translateY(-1px)",
              },
            }}
          >
            {HOME_PRODUCT.ctaLabel}
          </Button>

          <Button
            component={RouterLink}
            to={productPath}
            variant="contained"
            disableElevation
            sx={{
              display: { xs: "inline-flex", md: "none" },
              minWidth: 0,
              minHeight: 44,
              borderRadius: "999px",
              px: { xs: 1.6, sm: 2 },
              color: "#ffffff",
              backgroundColor: "var(--primary)",
              fontWeight: 850,
              fontSize: 13,
              textTransform: "none",
              whiteSpace: "nowrap",
              WebkitTapHighlightColor: "transparent",
              "&:hover": {
                backgroundColor: "var(--primary-hover)",
              },
            }}
          >
            Mua ngay
          </Button>

          {/* Mobile Hamburger Menu Button - Visible only on mobile */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleMobileMenuToggle}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "var(--primary)",
              width: 48,
              height: 48,
              WebkitTapHighlightColor: "transparent",
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, pb: 1 }}>
            <Typography
              sx={{
                color: "var(--primary)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 0,
              }}
            >
              {"Chạm Việt"}
            </Typography>
            <IconButton
              onClick={handleMobileMenuClose}
              sx={{ color: "var(--primary)", width: 48, height: 48, WebkitTapHighlightColor: "transparent" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ px: 2, pb: 1.5 }}>
            <Button
              component={RouterLink}
              to={productPath}
              onClick={handleMobileMenuClose}
              fullWidth
              variant="contained"
              disableElevation
              endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
              sx={{
                minHeight: 52,
                borderRadius: "12px",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontWeight: 900,
                textTransform: "none",
                WebkitTapHighlightColor: "transparent",
                "&:hover": { backgroundColor: "var(--primary-hover)" },
              }}
            >
              {HOME_PRODUCT.ctaLabel}
            </Button>
          </Box>

          {/* Mobile Navigation Items */}
          <Stack
            spacing={1}
            sx={{
              px: 2,
              py: 2,
            }}
          >
            {primaryNavItems.map((item) => {
              const active = isActiveRoute(item.to);
              return (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  onClick={handleMobileMenuClose}
                  fullWidth
                  color="inherit"
                  sx={{
                    fontWeight: active ? 700 : 600,
                    textTransform: "none",
                    color: active ? "var(--primary)" : "var(--text-sub)",
                    justifyContent: "flex-start",
                    fontSize: "1rem",
                    minHeight: 48,
                    py: 1.35,
                    borderRadius: '12px',
                    WebkitTapHighlightColor: "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(198, 40, 40, 0.05)",
                      color: "var(--primary)"
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            <Box
              sx={{
                borderRadius: "12px",
                backgroundColor: "rgba(198, 40, 40, 0.03)",
                border: "1px solid rgba(198, 40, 40, 0.08)",
                px: 1,
                py: 1,
              }}
            >
              <Typography
                sx={{
                  px: 1,
                  pb: 0.75,
                  color: "var(--primary)",
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 0.2,
                  textTransform: "uppercase",
                }}
              >
                Câu chuyện
              </Typography>
              <Stack spacing={0.5}>
                {storyMenuItems.map((item) => {
                  const active = isActiveRoute(item.to);
                  return (
                    <Button
                      key={item.to}
                      component={NavLink}
                      to={item.to}
                      onClick={handleMobileMenuClose}
                      fullWidth
                      color="inherit"
                      sx={{
                        fontWeight: active ? 700 : 600,
                        textTransform: "none",
                        color: active ? "var(--primary)" : "var(--text-sub)",
                        justifyContent: "flex-start",
                        fontSize: "0.96rem",
                        minHeight: 44,
                        px: 1.25,
                        borderRadius: "10px",
                        WebkitTapHighlightColor: "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(198, 40, 40, 0.05)",
                          color: "var(--primary)",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Drawer>
      <Menu
        id="story-menu"
        anchorEl={storyMenuAnchorEl}
        open={storyMenuOpen}
        onClose={handleStoryMenuClose}
        MenuListProps={{ "aria-labelledby": "story-menu-button" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 240,
            borderRadius: "18px",
            border: "1px solid rgba(78, 52, 46, 0.10)",
            boxShadow: "0 20px 44px rgba(24, 14, 13, 0.18)",
            overflow: "hidden",
          },
        }}
      >
        {storyMenuItems.map((item) => {
          const active = isActiveRoute(item.to);
          return (
            <MenuItem
              key={item.to}
              component={RouterLink}
              to={item.to}
              onClick={handleStoryMenuClose}
              sx={{
                minHeight: 48,
                fontSize: "0.98rem",
                fontWeight: active ? 700 : 600,
                color: active ? "var(--primary)" : "var(--text-sub)",
                "&:hover": {
                  color: "var(--primary)",
                  backgroundColor: "rgba(198, 40, 40, 0.05)",
                },
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </AppBar>
  );
}