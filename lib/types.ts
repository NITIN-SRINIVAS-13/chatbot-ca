export interface Message {
  id: string
  role: "user" | "bot"
  content: string
  games?: Game[]
}

export interface Game {
  id: number
  name: string
  released: string
  background_image: string
  rating: number
  genres: { id: number; name: string }[]
  description?: string
  platforms?: { platform: { id: number; name: string } }[]
  metacritic?: string | number
  esrb_rating?: string
}

export interface GameResponse {
  type: "games" | "message" | "error"
  message: string
  games?: Game[]
}

