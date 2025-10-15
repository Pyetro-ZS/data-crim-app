"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Calendar, Upload, User, Phone, Mail, CreditCard } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const LocationPicker = dynamic(
  () => import("@/components/location-picker").then((mod) => ({ default: mod.LocationPicker })),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 bg-[#1a1625] rounded-2xl border border-[#2b2438] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4aa3ff] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    ),
  },
)

export default function BoletimPage() {
  const [anonymous, setAnonymous] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [location, setLocation] = useState("")
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => {
          // Default to São Paulo
          setUserLocation([-23.5505, -46.6333])
        },
      )
    } else {
      setUserLocation([-23.5505, -46.6333])
    }
  }, [])

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedCoords({ lat, lng })
    setLocation(address)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen bg-[#0f0b1a] pb-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 pb-4">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#1a1625]">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Boletim de Occrrência</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-6 space-y-6">
          <div className="relative h-48 rounded-2xl overflow-hidden border border-[#2b2438]">
            {userLocation ? (
              <LocationPicker center={userLocation} zoom={15} onLocationSelect={handleLocationSelect} />
            ) : (
              <div className="h-full bg-[#1a1625] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#4aa3ff] mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-muted-foreground px-4">Obtendo localização...</p>
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço aproximado
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Toque no mapa ou digite o endereço..."
              className="bg-[#1a1625] border-[#2b2438] text-white"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data Completo
            </label>
            <Input type="datetime-local" className="bg-[#1a1625] border-[#2b2438] text-white" />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-white mb-2 block">Descrição Detalalde da Occrrência</label>
            <Textarea
              placeholder="Descreva o que aconteceu com o máximo de detalhes possível..."
              className="bg-[#1a1625] border-[#2b2438] text-white min-h-32"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Fotos (opcional)
            </label>
            <div className="bg-[#1a1625] border-2 border-dashed border-[#2b2438] rounded-xl p-6 text-center hover:border-[#4aa3ff] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Toque para adicionar fotos</p>
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between bg-[#1a1625] rounded-2xl p-4 border border-[#2b2438]">
            <span className="text-white">Nome Dados (Opcional)</span>
            <Switch checked={!anonymous} onCheckedChange={(checked) => setAnonymous(!checked)} />
          </div>

          {!anonymous && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="bg-[#1a1625] rounded-2xl p-4 border border-[#2b2438] space-y-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Dados Pessoais
                </h3>

                {/* Full Name */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Nome Completo</label>
                  <Input
                    type="text"
                    placeholder="Digite seu nome completo"
                    className="bg-[#0f0b1a] border-[#2b2438] text-white"
                    required={!anonymous}
                  />
                </div>

                {/* CPF */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    CPF
                  </label>
                  <Input
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="bg-[#0f0b1a] border-[#2b2438] text-white"
                    required={!anonymous}
                  />
                </div>

                {/* RG */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">RG</label>
                  <Input
                    type="text"
                    placeholder="00.000.000-0"
                    maxLength={12}
                    className="bg-[#0f0b1a] border-[#2b2438] text-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="bg-[#0f0b1a] border-[#2b2438] text-white"
                    required={!anonymous}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="bg-[#0f0b1a] border-[#2b2438] text-white"
                    required={!anonymous}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full gradient-primary text-white btn-touch text-lg font-semibold">
            Registrar Boletim
          </Button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-[#1a1625] rounded-3xl p-8 max-w-sm w-full border border-[#2b2438]">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 text-center">Boletim Registrado</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Protocolo: <span className="text-[#4aa3ff] font-mono">BO-2025-{Math.floor(Math.random() * 10000)}</span>
            </p>
            <Button onClick={() => setShowSuccess(false)} className="w-full gradient-primary text-white">
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
