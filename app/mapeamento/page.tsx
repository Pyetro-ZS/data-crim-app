"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Maximize2 } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

const CrimeHeatmap = dynamic(
  () => import("@/components/crime-heatmap").then((mod) => ({ default: mod.CrimeHeatmap })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#1a1625]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4aa3ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-sm">Carregando mapa...</p>
        </div>
      </div>
    ),
  },
)

export default function MapeamentoPage() {
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showStations, setShowStations] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log("[v0] Geolocation error:", error)
          // Default to São Paulo coordinates
          setUserLocation([-23.5505, -46.6333])
        },
      )
    } else {
      setUserLocation([-23.5505, -46.6333])
    }
  }, [])

  const crimeData = userLocation
    ? [
        { lat: userLocation[0] + 0.005, lng: userLocation[1] + 0.005, intensity: 0.8 },
        { lat: userLocation[0] - 0.003, lng: userLocation[1] + 0.007, intensity: 0.9 },
        { lat: userLocation[0] + 0.008, lng: userLocation[1] - 0.004, intensity: 0.7 },
        { lat: userLocation[0] - 0.006, lng: userLocation[1] - 0.006, intensity: 0.6 },
        { lat: userLocation[0] + 0.002, lng: userLocation[1] + 0.009, intensity: 0.85 },
        { lat: userLocation[0] - 0.009, lng: userLocation[1] + 0.002, intensity: 0.75 },
        { lat: userLocation[0] + 0.007, lng: userLocation[1] + 0.008, intensity: 0.65 },
        { lat: userLocation[0] - 0.004, lng: userLocation[1] - 0.008, intensity: 0.95 },
      ]
    : []

  const policeStations = userLocation
    ? [
        { name: "Delegacia Central", lat: userLocation[0], lng: userLocation[1] },
        { name: "Delegacia Norte", lat: userLocation[0] + 0.015, lng: userLocation[1] - 0.01 },
        { name: "Delegacia Sul", lat: userLocation[0] - 0.015, lng: userLocation[1] + 0.01 },
        { name: "Delegacia Leste", lat: userLocation[0] - 0.005, lng: userLocation[1] + 0.02 },
        { name: "Delegacia Oeste", lat: userLocation[0] + 0.005, lng: userLocation[1] - 0.02 },
      ]
    : []

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0b1a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2b2438]">
        <div className="flex items-center gap-3">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#1a1625]">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-white">Mapeamento do Local</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-3 border-b border-[#2b2438]">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Maior Indíce de Criminalidade</span>
          <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Localização Delegacias</span>
          <Switch checked={showStations} onCheckedChange={setShowStations} />
        </div>
      </div>

      {/* Map Area */}
      <div
        className="flex-1 relative bg-[#1a1625] overflow-hidden"
        style={{ minHeight: "500px", height: "calc(100vh - 250px)" }}
      >
        {userLocation ? (
          <>
            <CrimeHeatmap
              center={userLocation}
              zoom={13}
              crimeData={crimeData}
              policeStations={policeStations}
              showHeatmap={showHeatmap}
              showStations={showStations}
              className="absolute inset-0"
            />

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 w-10 h-10 bg-[#1a1625] border border-[#2b2438] rounded-lg flex items-center justify-center hover:border-[#4aa3ff] transition-colors z-[1000]"
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#4aa3ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white text-sm">Obtendo localização...</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-[#2b2438]">
        <p className="text-xs text-muted-foreground mb-2">Intensidade de Criminalidade</p>
        <div
          className="h-3 rounded-full"
          style={{
            background: "linear-gradient(90deg, #3b82f6 0%, #22c55e 25%, #eab308 50%, #f97316 75%, #ef4444 100%)",
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Baixo</span>
          <span className="text-xs text-muted-foreground">Médio</span>
          <span className="text-xs text-muted-foreground">Alto</span>
        </div>
      </div>
    </div>
  )
}
