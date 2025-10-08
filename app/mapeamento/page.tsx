"use client"

import { useState } from "react"
import { ArrowLeft, Maximize2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function MapeamentoPage() {
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showStations, setShowStations] = useState(false)

  return (
    <div className="min-h-screen bg-[#0f0b1a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2b2438]">
        <div className="flex items-center gap-3">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-white">
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
          <span className="text-white text-sm">Localização Deleagaias</span>
          <Switch checked={showStations} onCheckedChange={setShowStations} />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-[#1a1625]">
        {/* Placeholder for map - in production, integrate Leaflet here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[#4aa3ff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#4aa3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-sm">Mapa de calor de criminalidade</p>
            <p className="text-xs text-muted-foreground mt-2">Integração com Leaflet será implementada aqui</p>
          </div>
        </div>

        {/* Fullscreen Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-[#1a1625] border border-[#2b2438] rounded-lg flex items-center justify-center hover:border-[#4aa3ff] transition-colors">
          <Maximize2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-[#2b2438]">
        <p className="text-xs text-muted-foreground mb-2">Baixo</p>
        <div
          className="h-3 rounded-full"
          style={{
            background: "linear-gradient(90deg, #3b82f6 0%, #22c55e 25%, #eab308 50%, #f97316 75%, #ef4444 100%)",
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">Baixo</span>
          <span className="text-xs text-muted-foreground">Alto</span>
          <span className="text-xs text-muted-foreground">Alto</span>
        </div>
      </div>
    </div>
  )
}
