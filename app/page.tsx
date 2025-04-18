import { MissionList } from "@/components/mission-list"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Mission Quest
          </h1>
          <p className="text-gray-400 mt-2">Complete missions to earn shiny stars!</p>
        </header>
        <MissionList />
      </div>
    </main>
  )
}
