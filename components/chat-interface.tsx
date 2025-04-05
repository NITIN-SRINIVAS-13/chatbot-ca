"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getGameRecommendations } from "@/lib/game-service"
import type { Message, GameResponse } from "@/lib/types"
import GameCard from "./game-card"

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content:
        'Hi! I can recommend games based on your preferences. Try asking me something like "Recommend some action games" or "What are some good RPG games?"',
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Check if the message is game-related
      const gameKeywords = [
        "game",
        "games",
        "play",
        "genre",
        "recommend",
        "recommendation",
        "gaming",
        "rpg",
        "action",
        "adventure",
        "strategy",
        "shooter",
        "puzzle",
        "racing",
        "sports",
        "simulation",
        "indie",
      ]

      const isGameRelated = gameKeywords.some((keyword) => input.toLowerCase().includes(keyword))

      if (!isGameRelated) {
        // If not game-related, respond with a message about only handling game recommendations
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "I'm sorry, I can only help with game recommendations. Try asking about games or specific genres!",
          },
        ])
      } else {
        // Get game recommendations
        const response: GameResponse = await getGameRecommendations(input)

        if (response.type === "games" && response.games) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "bot",
              content: response.message,
              games: response.games,
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "bot",
              content: response.message,
            },
          ])
        }
      }
    } catch (error) {
      console.error("Error getting response:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="flex flex-col h-[70vh] border rounded-lg overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`${message.role === "user" ? "bg-blue-500 text-white rounded-lg p-3 max-w-[80%]" : "w-full"}`}
            >
              {message.role === "user" ? (
                message.content
              ) : (
                <div>
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3 mb-2 max-w-[80%]">{message.content}</div>

                  {message.games && message.games.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {message.games.map((game) => (
                        <GameCard key={game.id} game={game} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => handleQuickPrompt("Recommend some action games")}>
            Action games
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickPrompt("What are some good RPG games?")}>
            RPG games
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickPrompt("Show me popular indie games")}>
            Indie games
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickPrompt("Best strategy games")}>
            Strategy games
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about game recommendations..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  )
}

