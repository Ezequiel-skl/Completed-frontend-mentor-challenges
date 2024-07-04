/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				web: "var(--web)",
				main: "var(--border-main)",
				darkgray: "var(--dark-gray)",
				lightgray: "var(--light-gray)",
				purple: "var(--purple)",
				cyan: "var(--cyan)",
				pink: "var(--pink)",
				lime: "var(--lime)",
				red: "var(--red)",
			},
			maxHeight: {
				"calc-menu": "calc(100vh - 10rem)",
			},
			borderWidth: {
				3: "3px",
			},
			borderRadius: {
				3: "3px",
			},
			fontFamily: {
				heebo: ["Heebo", "sans-serif"],
			},
		},
	},
	plugins: [],
}
