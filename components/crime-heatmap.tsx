"use client"

import { useEffect, useRef, useState } from "react"
import { useLeaflet } from "@/hooks/use-leaflet"

interface CrimeData {
  lat: number
  lng: number
  intensity: number
}

interface PoliceStation {
  name: string
  lat: number
  lng: number
}

interface CrimeHeatmapProps {
  center: [number, number]
  zoom?: number
  crimeData: CrimeData[]
  policeStations: PoliceStation[]
  showHeatmap: boolean
  showStations: boolean
  className?: string
}

export function CrimeHeatmap({
  center,
  zoom = 13,
  crimeData,
  policeStations,
  showHeatmap,
  showStations,
  className = "",
}: CrimeHeatmapProps) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const heatLayerRef = useRef<any>(null)
  const stationLayerRef = useRef<any>(null)
  const { leaflet: L, isLoading: isLeafletLoading, error } = useLeaflet()
  const [heatPluginLoaded, setHeatPluginLoaded] = useState(false)
  const [containerReady, setContainerReady] = useState(false)

  useEffect(() => {
    if (!L || heatPluginLoaded) return

    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"
    script.async = true
    script.onload = () => setHeatPluginLoaded(true)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [L, heatPluginLoaded])

  useEffect(() => {
    if (!containerRef.current) return

    const checkDimensions = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect && rect.width > 0 && rect.height > 0) {
        console.log("[v0] Container dimensions ready:", rect.width, "x", rect.height)
        setContainerReady(true)
        return true
      }
      return false
    }

    if (checkDimensions()) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          console.log("[v0] Container resized to:", entry.contentRect.width, "x", entry.contentRect.height)
          setContainerReady(true)
        }
      }
    })

    resizeObserver.observe(containerRef.current)

    const timeout = setTimeout(() => {
      if (checkDimensions()) {
        console.log("[v0] Container ready via timeout")
      }
    }, 100)

    return () => {
      resizeObserver.disconnect()
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!L || !heatPluginLoaded || !containerRef.current || mapRef.current || !containerReady) return

    const rect = containerRef.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      console.log("[v0] Container not ready, dimensions:", rect.width, "x", rect.height)
      return
    }

    console.log("[v0] Initializing map with dimensions:", rect.width, "x", rect.height)

    let map: any

    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      map = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map)

      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map)

      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: `
          <div class="relative">
            <div class="w-4 h-4 bg-[#4aa3ff] rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div class="absolute inset-0 w-4 h-4 bg-[#4aa3ff] rounded-full animate-ping opacity-75"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker(center, { icon: userIcon }).addTo(map)

      mapRef.current = map

      setTimeout(() => {
        if (map) {
          map.invalidateSize()
          console.log("[v0] Map size invalidated")
        }
      }, 100)
    } catch (err) {
      console.error("[v0] Error initializing map:", err)
    }

    return () => {
      if (map) {
        map.remove()
        mapRef.current = null
      }
    }
  }, [L, heatPluginLoaded, center, zoom, containerReady])

  useEffect(() => {
    if (!mapRef.current || !L || !heatPluginLoaded) return

    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    if (showHeatmap && crimeData.length > 0) {
      try {
        const heatData: [number, number, number][] = crimeData.map((crime) => [crime.lat, crime.lng, crime.intensity])

        console.log("[v0] Creating heatmap with", heatData.length, "points")

        const heatLayer = (L as any).heatLayer(heatData, {
          radius: 40,
          blur: 50,
          maxZoom: 17,
          max: 1.0,
          gradient: {
            0.0: "#3b82f6",
            0.25: "#22c55e",
            0.5: "#eab308",
            0.75: "#f97316",
            1.0: "#ef4444",
          },
        })

        heatLayer.addTo(mapRef.current)
        heatLayerRef.current = heatLayer
        console.log("[v0] Heatmap added successfully")
      } catch (err) {
        console.error("[v0] Error creating heatmap:", err)
      }
    }
  }, [showHeatmap, crimeData, L, heatPluginLoaded])

  useEffect(() => {
    if (!mapRef.current || !L || !heatPluginLoaded) return

    if (stationLayerRef.current) {
      mapRef.current.removeLayer(stationLayerRef.current)
      stationLayerRef.current = null
    }

    if (showStations && policeStations.length > 0) {
      const stationLayer = L.layerGroup()

      policeStations.forEach((station: PoliceStation) => {
        const icon = L.divIcon({
          className: "police-station-marker",
          html: `
            <div class="w-12 h-12 bg-[#4aa3ff] rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-8-5z" />
              </svg>
            </div>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 24],
        })

        const marker = L.marker([station.lat, station.lng], { icon })
        marker.bindPopup(
          `<div class="text-center p-2">
            <p class="font-semibold text-sm">${station.name}</p>
          </div>`,
          {
            className: "custom-popup",
          },
        )
        marker.addTo(stationLayer)
      })

      stationLayer.addTo(mapRef.current)
      stationLayerRef.current = stationLayer
    }
  }, [showStations, policeStations, L, heatPluginLoaded])

  if (error) {
    return (
      <div className="w-full h-full bg-[#1a1625] flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-sm">Erro ao carregar o mapa</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative w-full h-full min-h-[400px]">
        <div ref={containerRef} className={`w-full h-full min-h-[400px] ${className}`} />
        {(isLeafletLoading || !heatPluginLoaded || !containerReady) && (
          <div className="absolute inset-0 bg-[#1a1625] flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#4aa3ff] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .leaflet-container {
          background: #1a1625;
        }
        .user-location-marker,
        .police-station-marker {
          background: transparent;
          border: none;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #1a1625;
          color: white;
          border: 1px solid #4aa3ff;
          border-radius: 8px;
        }
        .custom-popup .leaflet-popup-tip {
          background: #1a1625;
          border: 1px solid #4aa3ff;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-control-zoom a {
          background: #1a1625 !important;
          border: 1px solid #2b2438 !important;
          color: white !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          border-radius: 8px !important;
          margin-bottom: 8px !important;
        }
        .leaflet-control-zoom a:hover {
          border-color: #4aa3ff !important;
        }
      `}</style>
    </>
  )
}
