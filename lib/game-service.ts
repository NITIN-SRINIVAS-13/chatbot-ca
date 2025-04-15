"use server"

const RAWG_API_KEY = "fd11a676d83a40edb7b71e6595c9abda"
const API_BASE_URL = "https://api.rawg.io/api"

// List of common game genres
const GAME_GENRES = [
  "action",
  "adventure",
  "rpg",
  "strategy",
  "shooter",
  "puzzle",
  "racing",
  "sports",
  "simulation",
  "indie",
  "platformer",
  "fighting",
  "stealth",
  "survival",
  "horror",
  "mmo",
  "open-world",
  "sandbox",
  "battle-royale",
  "moba",
  "card",
  "roguelike",
  "roguelite",
]

export async function getGameRecommendations(query: string): Promise<any> {
  try {
    const queryLower = query.toLowerCase()

    // Check if query contains genre-related terms
    if (queryLower.includes("genre") || queryLower.includes("games like") || queryLower.includes("similar to")) {
      // Try to extract genre or game name for "games like X" queries
      return await searchGamesByQuery(queryLower)
    } else {
      // General search
      const searchTerms = queryLower
        .replace(/recommend|games|game|some|good|best|popular|top|for|me|please|what|are|show/g, "")
        .trim()

      if (searchTerms) {
        return await searchGames(searchTerms)
      } else {
        // If no specific search terms, get popular games
        return await getPopularGames()
      }
    }
  } catch (error) {
    console.error("Error in getGameRecommendations:", error)
    return {
      type: "error",
      message: "Sorry, I encountered an error while fetching game recommendations. Please try again.",
    }
  }
}

async function searchGamesByQuery(query: string): Promise<any> {
  try {
    // First, try to get genres from RAWG
    const genresResponse = await fetch(
      `${API_BASE_URL}/genres?key=${RAWG_API_KEY}`,
      { next: { revalidate: 86400 } }, // Cache for a day
    )

    if (!genresResponse.ok) {
      throw new Error(`Genres API request failed with status ${genresResponse.status}`)
    }

    const genresData = await genresResponse.json()
    const availableGenres = genresData.results.map((genre: any) => genre.name.toLowerCase())

    // Try to find a genre in the query
    let detectedGenre = null
    for (const genre of availableGenres) {
      if (query.includes(genre.toLowerCase())) {
        detectedGenre = genre
        break
      }
    }

    if (detectedGenre) {
      // If genre detected, get games by that genre
      const genreId = genresData.results.find((g: any) => g.name.toLowerCase() === detectedGenre)?.id

      if (genreId) {
        return await getGamesByGenre(detectedGenre, genreId)
      }
    }

    // If no genre detected or genre not found, try general search
    const searchTerms = query
      .replace(
        /genre|games like|similar to|recommend|games|game|some|good|best|popular|top|for|me|please|what|are|show/g,
        "",
      )
      .trim()

    if (searchTerms) {
      return await searchGames(searchTerms)
    } else {
      return await getPopularGames()
    }
  } catch (error) {
    console.error("Error in searchGamesByQuery:", error)
    return {
      type: "error",
      message: "Sorry, I encountered an error while searching for games. Please try again.",
    }
  }
}

async function searchGames(searchTerm: string): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(searchTerm)}&page_size=10`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.results.length === 0) {
      return {
        type: "message",
        message: `I couldn't find any games matching "${searchTerm}". Try a different search term.`,
      }
    }

    return {
      type: "games",
      message: `Here are some games matching "${searchTerm}":`,
      games: await enrichGamesData(data.results),
    }
  } catch (error) {
    console.error("Error in searchGames:", error)
    return {
      type: "error",
      message: "Sorry, I encountered an error while searching for games. Please try again.",
    }
  }
}

async function getGamesByGenre(genreName: string, genreId: number): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/games?key=${RAWG_API_KEY}&genres=${genreId}&ordering=-rating&page_size=10`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.results.length === 0) {
      return {
        type: "message",
        message: `I couldn't find any ${genreName} games. Try a different genre.`,
      }
    }

    return {
      type: "games",
      message: `Here are some top-rated ${genreName} games:`,
      games: await enrichGamesData(data.results),
    }
  } catch (error) {
    console.error("Error in getGamesByGenre:", error)
    return {
      type: "error",
      message: `Sorry, I encountered an error while fetching ${genreName} games. Please try again.`,
    }
  }
}

async function getPopularGames(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=10`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return {
      type: "games",
      message: "Here are some popular games you might enjoy:",
      games: await enrichGamesData(data.results),
    }
  } catch (error) {
    console.error("Error in getPopularGames:", error)
    return {
      type: "error",
      message: "Sorry, I encountered an error while fetching popular games. Please try again.",
    }
  }
}

// Function to get additional details for each game
async function enrichGamesData(games: any[]): Promise<any[]> {
  const enrichedGames = await Promise.all(
    games.map(async (game) => {
      try {
        // Get detailed game info
        const detailsResponse = await fetch(
          `${API_BASE_URL}/games/${game.id}?key=${RAWG_API_KEY}`,
          { next: { revalidate: 86400 } }, // Cache for a day
        )

        if (!detailsResponse.ok) {
          return {
            ...game,
            description: "No description available",
            size: "Unknown",
            platforms: game.platforms || [],
          }
        }

        const details = await detailsResponse.json()

        return {
          id: game.id,
          name: game.name,
          released: game.released,
          background_image: game.background_image,
          rating: game.rating,
          genres: game.genres || [],
          description: details.description_raw || "No description available",
          platforms: game.platforms || [],
          metacritic: game.metacritic || "N/A",
          esrb_rating: game.esrb_rating?.name || "Not rated",
        }
      } catch (error) {
        console.error(`Error enriching game ${game.id}:`, error)
        return {
          ...game,
          description: "No description available",
          size: "Unknown",
          platforms: game.platforms || [],
        }
      }
    }),
  )

  return enrichedGames
}

