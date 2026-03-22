import { useState, type MouseEvent } from "react";
import { Link as RouterLink } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const navItems = [
  { label: "Giới thiệu", to: "/about" },
  { label: "Sản Phẩm", to: "/products" },
  { label: "Câu Chuyện", to: "/story" },
  { label: "Cách Chơi", to: "/how-to-play" },
];

export default function Header() {
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
  const accountMenuOpen = Boolean(accountAnchorEl);

  const handleAccountClick = (event: MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
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
        <Toolbar disableGutters sx={{ minHeight: 72, gap: 2 }}>
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
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#a83232" }}>
              Chạm Việt
            </Typography>
          </Link>

          <Box sx={{ flex: 1 }} />

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                component={RouterLink}
                to={item.to}
                color="inherit"
                underline="none"
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#7a5230",
                  px: 1.25,
                  py: 1,
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: "rgba(168, 50, 50, 0.06)",
                  },
                }}
              >
                {item.label}
              </Link>
            ))}

            <IconButton
              aria-label="Cart"
              sx={{
                color: "#a83232",
                ml: 0.5,
                backgroundColor: "rgba(168, 50, 50, 0.06)",
                "&:hover": { backgroundColor: "rgba(168, 50, 50, 0.12)" },
              }}
            >
              🛒
            </IconButton>

            <IconButton
              aria-label="Account menu"
              aria-controls={accountMenuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={accountMenuOpen ? "true" : undefined}
              onClick={handleAccountClick}
              sx={{
                color: "#a83232",
                backgroundColor: "rgba(168, 50, 50, 0.06)",
                "&:hover": { backgroundColor: "rgba(168, 50, 50, 0.12)" },
              }}
            >
              👤
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Menu
        id="account-menu"
        anchorEl={accountAnchorEl}
        open={accountMenuOpen}
        onClose={handleAccountClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 180,
              borderRadius: 2,
              border: "1px solid rgba(168, 50, 50, 0.12)",
              boxShadow: "0px 16px 40px rgba(15, 23, 42, 0.12)",
            },
          },
        }}
      >
        <MenuItem component={RouterLink} to="/dashboard" onClick={handleAccountClose}>
          Dashboard
        </MenuItem>
        <MenuItem component={RouterLink} to="/login" onClick={handleAccountClose}>
          Login
        </MenuItem>
        <MenuItem component={RouterLink} to="/about" onClick={handleAccountClose}>
          About
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
