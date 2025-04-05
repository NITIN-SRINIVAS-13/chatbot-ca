import ChatInterface from "@/components/chat-interface"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex-1 container max-w-6xl mx-auto p-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Game Recommendation Chatbot</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
          By: Nitin Srinivas 20 12308380 | Aryajeet Kumar 19 12306006 | Sonam Biswas 18 12306944 | K23PS
          </p>
        </div>
        <ChatInterface />
      </div>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>By: Nitin Srinivas 20 12308380 | Aryajeet Kumar 19 12306006 | Sonam Biswas 18 12306944 | K23PS</p>
        </div>
      </footer>
    </main>
  )
}

