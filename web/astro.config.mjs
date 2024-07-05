import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import react from "@astrojs/react"
import vercel from "@astrojs/vercel/serverless"
import { VitePWA } from "vite-plugin-pwa"

import { manifest } from "./src/utils/seoConfig"

export default defineConfig({
	build: {
		inlineStylesheets: "always",
	},
	compressHTML: true,
	prefetch: true,
	integrations: [tailwind(), react()],
	devToolbar: {
		enabled: false,
	},
	output: "server",
	adapter: vercel(),
	output: "server",
	vite: {
		build: {
			cssMinify: "lightningcss",
		},
		ssr: {
			noExternal: ["path-to-regexp"],
		},
		plugins: [
			VitePWA({
				registerType: "autoUpdate",
				manifest,
				workbox: {
					globDirectory: ".vercel/output/static",
					globPatterns: ["**/*.{html,js,css,woff,woff2,ttf,eot,ico}"],
					runtimeCaching: [
						{
							urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
							handler: "CacheFirst",
							options: {
								cacheName: "images",
								expiration: {
									maxEntries: 100,
									maxAgeSeconds: 30 * 24 * 60 * 60,
								},
							},
						},
						{
							urlPattern: /\.(?:woff|woff2|ttf|eot|ico)$/,
							handler: "CacheFirst",
							options: {
								cacheName: "fonts",
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 30 * 24 * 60 * 60,
								},
							},
						},
					],
					navigateFallback: null,
				},
			}),
		],
	},
})
