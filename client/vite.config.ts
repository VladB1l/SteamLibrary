import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      input: {
        index: "index.html",
        genre: "pages/genre/genre.html",
        game: "pages/game/game.html",
      },
    },
  },
  base: "/",
});
