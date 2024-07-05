import type { ManifestOptions } from "vite-plugin-pwa"

export const manifest: Partial<ManifestOptions> = {
	name: "Completed frontend mentor challenges",
	short_name: "Mentor challenges",
	description: "Completed frontend mentor challenges that improve real-life development skills",
	theme_color: "#ffffff",
	background_color: "#ffffff",
	start_url: "/",
	display: "fullscreen",
	icons: [
		{
			src: "favicon/favicon-16x16.png",
			sizes: "16x16",
			type: "image/png",
		},
		{
			src: "favicon/favicon-32x32.png",
			sizes: "32x32",
			type: "image/png",
		},
		{
			src: "favicon/apple-touch-icon.png",
			sizes: "any",
			type: "image/png",
		},
		{
			src: "favicon/mstile-150x150.png",
			sizes: "150x150",
			type: "image/png",
		},
		{
			src: "favicon/favicon.ico",
			sizes: "any",
			type: "image/x-icon",
		},
		{
			src: "favicon/safari-pinned-tab.svg",
			sizes: "any",
			type: "image/svg+xml",
		},
	],
}
