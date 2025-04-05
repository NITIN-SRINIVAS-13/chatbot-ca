"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, GamepadIcon as GameController } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <GameController className="h-8 w-8 text-blue-400 mr-2" />
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              GameBot
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
                Home
              </Link>
              <Link
                href="https://rawg.io/"
                target="_blank"
                className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                RAWG API
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="https://rawg.io/"
              target="_blank"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              RAWG API
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="block px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              GitHub
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

