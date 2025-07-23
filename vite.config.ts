import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		react(), cloudflare(), tailwindcss(),
		VitePWA({ registerType: 'autoUpdate' })
	],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src/frontend"),
			"@shared": path.resolve(__dirname, "./src/shared"),
		},
	},
	optimizeDeps: {
		exclude: ["@evolu/common", "@evolu/react", "@evolu/react-web"],
	},
});
