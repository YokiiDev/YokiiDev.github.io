import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fulgur from "fulgur/vite";

export default defineConfig({
  plugins: [fulgur(), react(), tailwindcss()],
});
