const { defineConfig } = require("vite");
const path = require("node:path");

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: path.resolve(process.cwd(), "src/main.js"),
            output: {
                entryFileNames: "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name][extname]",
            },
        },
    },
});