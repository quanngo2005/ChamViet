import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

import Box from "@mui/material/Box";

import Footer from "./Footer";
import Header from "./Header";
import ChatWidget from "../common/ChatWidget";

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" id="content" role="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Analytics />
      <Footer />
      <ChatWidget />
    </Box>
  );
}
