import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { GuestRoute, ProtectedRoute } from "./guards";
import { ThemeProvider } from "./theme";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import HowToPlayPage from "./pages/HowToPlayPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import StoryPage from "./pages/StoryPage";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function DashboardPage() {
  return (
    <Stack spacing={1.5} sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Dashboard
      </Typography>
      <Typography color="text.secondary">
        Protected route placeholder. Add real pages under `src/pages/` and wire them here.
      </Typography>
    </Stack>
  );
}

function LoginPage() {
  return (
    <Stack spacing={1.5} sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Login
      </Typography>
      <Typography color="text.secondary">
        Login UI not implemented yet. `ProtectedRoute` currently checks for a JWT token in localStorage.
      </Typography>
    </Stack>
  );
}

function UnauthorizedPage() {
  return (
    <Stack spacing={1.5} sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        401
      </Typography>
      <Typography color="text.secondary">You don&apos;t have permission to access this page.</Typography>
    </Stack>
  );
}

function NotFoundPage() {
  return (
    <Stack spacing={1.5} sx={{ px: 2, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        404
      </Typography>
      <Typography color="text.secondary">Page not found.</Typography>
    </Stack>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="story" element={<StoryPage />} />
        <Route path="how-to-play" element={<HowToPlayPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="login"
            element={
              <GuestRoute redirectTo="/dashboard">
                <LoginPage />
              </GuestRoute>
            }
          />

          <Route path="401" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
