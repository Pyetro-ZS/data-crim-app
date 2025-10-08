"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function RetratoFaladoPage() {
  const [generating, setGenerating] = useState(false)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    setTimeout(() => setGenerating(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0f0b1a] p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Retrato Falado (IA)</h1>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Sex */}
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">Sexo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="bg-[#1a1625] border border-[#2b2438] rounded-xl p-4 text-white hover:border-[#4aa3ff] transition-colors"
              >
                Masculino
              </button>
              <button
                type="button"
                className="bg-[#1a1625] border border-[#2b2438] rounded-xl p-4 text-white hover:border-[#4aa3ff] transition-colors"
              >
                Feminino
              </button>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Local</label>
            <Input placeholder="Onde ocorreu o incidente?" className="bg-[#1a1625] border-[#2b2438] text-white" />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Descrição</label>
            <Textarea
              placeholder="Descreva as características físicas: cor de pele, cabelo, olhos, altura aproximada, roupas, marcas distintivas..."
              className="bg-[#1a1625] border-[#2b2438] text-white min-h-48"
            />
          </div>

          {/* Generate Button */}
          <Button
            type="submit"
            disabled={generating}
            className="w-full gradient-primary text-white btn-touch text-lg font-semibold flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gerando Retrato...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Retrato
              </>
            )}
          </Button>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            A IA gerará um retrato baseado na sua descrição. Quanto mais detalhes, melhor o resultado.
          </p>
        </form>
      </div>
    </div>
  )
}
