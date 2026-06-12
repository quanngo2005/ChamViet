import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        ViteImageOptimizer({
            png: { quality: 80 },
            jpeg: { quality: 80 },
            jpg: { quality: 80 },
            webp: { quality: 80 },
        })
    ],
    server: {
        port: 5173,
        proxy: {
            "/api/v1": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false
            }
        }
    },

    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                  if (id.includes('node_modules/@mui')) return 'mui';
                  if (id.includes('node_modules/motion')) return 'motion';
                  if (id.includes('apexcharts') || id.includes('react-apexcharts')) return 'charts';
                  if (id.includes('node_modules/react')) return 'vendor';
                  return undefined;
                },
            }
        }
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@assets': path.resolve(__dirname, './src/assets'),
            'src': path.resolve(__dirname, './src')
        }
    },

    define: {
        global: 'globalThis',
    }
});
