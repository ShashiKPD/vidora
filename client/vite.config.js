import path from "path"
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow access from all devices on the network
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
