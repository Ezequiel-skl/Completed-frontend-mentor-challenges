export type Difficulty = "Newbie" | "Junior" | "Intermediário" | "Advanced"
export type Languages = "HTML" | "CSS" | "JS" | "API"
export type Tags = "HTML&CSS" | "JS" | "API" | Difficulty

export interface Challenge {
	slug: string
	title: string
	description: string
	difficulty: [Difficulty, number]
	languages: Languages[]
	tags: Tags[]
	isNew?: boolean
}
