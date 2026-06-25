import { Navigate, Route, Routes } from "react-router-dom";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { GuestRoute } from "./guards/GuestRoute";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { ThemeProvider } from "./theme/theme-provider";
import AppScrollProvider from "./components/common/AppScrollProvider";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import HowToPlayPage from "./pages/HowToPlayPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import StoryPage from "./pages/StoryPage";
import ScanPage from "./pages/ScanPage";
import { HOME_PRODUCT } from "./data/home";

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
    <AppScrollProvider>
      <ThemeProvider>
        <Routes>
          <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="aboutus" element={<Navigate to="/about" replace />} />
          <Route path="story" element={<StoryPage />} />
          <Route path="how-to-play" element={<HowToPlayPage />} />
          <Route path="products" element={<Navigate to={`/products/${HOME_PRODUCT.id}`} replace />} />
          <Route path="products/:productId" element={<ProductDetailPage />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="story/:storySlug" element={<StoryPage />} />

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
    </AppScrollProvider>
  );
}
