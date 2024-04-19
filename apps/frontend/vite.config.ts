import path from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    base: "/frontend",
    plugins: [solid()],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          nested: path.resolve(__dirname, "timer/index.html"),
        },
      },
    },
  };
});
