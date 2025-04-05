"use client"

import { useState } from "react"
import Image from "next/image"
import type { Game } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Star } from "lucide-react"

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Format release date
  const releaseDate = game.released ? new Date(game.released).toLocaleDateString() : "Unknown"

  // Truncate description
  const shortDescription =
    game.description && game.description.length > 150 ? `${game.description.substring(0, 150)}...` : game.description

  // Get platforms as string
  const platforms = game.platforms ? game.platforms.map((p) => p.platform.name).join(", ") : "Unknown"

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {game.background_image ? (
          <Image
            src={game.background_image || "/placeholder.svg"}
            alt={`${game.name} cover`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span>{game.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{game.name}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {game.genres &&
            game.genres.map((genre) => (
              <span key={genre.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {genre.name}
              </span>
            ))}
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <p>
            <strong>Released:</strong> {releaseDate}
          </p>
          <p>
            <strong>Metacritic:</strong> {game.metacritic || "N/A"}
          </p>
          <p>
            <strong>ESRB Rating:</strong> {game.esrb_rating || "Not rated"}
          </p>
        </div>

        {!expanded ? (
          <p className="text-sm text-gray-700 mb-3">{shortDescription || "No description available"}</p>
        ) : (
          <p className="text-sm text-gray-700 mb-3">{game.description || "No description available"}</p>
        )}

        <div className="text-sm text-gray-600 mb-3">
          <p>
            <strong>Platforms:</strong> {platforms}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" /> Show More
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

