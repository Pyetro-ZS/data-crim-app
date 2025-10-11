"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Sparkles, Download, Share2, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface PortraitData {
  sex: "masculino" | "feminino" | ""
  age: string
  skinTone: string
  faceShape: string
  hairColor: string
  hairLength: string
  hairStyle: string
  eyeColor: string
  eyeShape: string
  noseShape: string
  mouthShape: string
  facialHair: string
  build: string
  height: string
  distinctiveFeatures: string
  clothing: string
  location: string
}

export default function RetratoFaladoPage() {
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<PortraitData>({
    sex: "",
    age: "",
    skinTone: "",
    faceShape: "",
    hairColor: "",
    hairLength: "",
    hairStyle: "",
    eyeColor: "",
    eyeShape: "",
    noseShape: "",
    mouthShape: "",
    facialHair: "",
    build: "",
    height: "",
    distinctiveFeatures: "",
    clothing: "",
    location: "",
  })

  const handleInputChange = (field: keyof PortraitData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const buildPrompt = (): string => {
    const parts: string[] = []

    if (formData.sex) parts.push(`${formData.sex} person`)
    if (formData.age) parts.push(`approximately ${formData.age} years old`)
    if (formData.skinTone) parts.push(`${formData.skinTone} skin tone`)
    if (formData.faceShape) parts.push(`${formData.faceShape} face shape`)
    if (formData.hairColor && formData.hairLength) {
      parts.push(`${formData.hairLength} ${formData.hairColor} hair`)
    }
    if (formData.hairStyle) parts.push(`${formData.hairStyle} hairstyle`)
    if (formData.eyeColor) parts.push(`${formData.eyeColor} eyes`)
    if (formData.eyeShape) parts.push(`${formData.eyeShape} eye shape`)
    if (formData.noseShape) parts.push(`${formData.noseShape} nose`)
    if (formData.mouthShape) parts.push(`${formData.mouthShape} mouth`)
    if (formData.facialHair && formData.sex === "masculino") parts.push(formData.facialHair)
    if (formData.build) parts.push(`${formData.build} build`)
    if (formData.height) parts.push(`${formData.height} height`)
    if (formData.distinctiveFeatures) parts.push(formData.distinctiveFeatures)
    if (formData.clothing) parts.push(`wearing ${formData.clothing}`)

    return `Professional police sketch portrait, realistic facial features, front-facing view, neutral expression, high detail, ${parts.join(", ")}, photorealistic style, clear facial details`
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setGenerating(true)

    // Validate required fields
    if (!formData.sex) {
      setError("Por favor, selecione o sexo")
      setGenerating(false)
      return
    }

    try {
      const prompt = buildPrompt()
      console.log("[v0] Generated prompt:", prompt)

      // Call API to generate image
      const response = await fetch("/api/generate-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, formData }),
      })

      if (!response.ok) {
        throw new Error("Falha ao gerar retrato")
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
    } catch (err) {
      console.error("[v0] Error generating portrait:", err)
      setError("Não foi possível gerar o retrato. Por favor, tente novamente.")
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return

    const link = document.createElement("a")
    link.href = generatedImage
    link.download = `retrato-falado-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!generatedImage) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Retrato Falado - DataCrim",
          text: "Retrato gerado pelo sistema DataCrim",
          url: generatedImage,
        })
      } catch (err) {
        console.log("[v0] Share cancelled or failed:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(generatedImage)
      alert("Link copiado para a área de transferência!")
    }
  }

  const handleReset = () => {
    setGeneratedImage(null)
    setError(null)
  }

  if (generatedImage) {
    return (
      <div className="min-h-screen bg-[#0f0b1a] p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleReset}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold text-white">Retrato Gerado</h1>
          </div>

          {/* Generated Image */}
          <div className="bg-[#1a1625] border border-[#2b2438] rounded-2xl p-6 mb-6">
            <div className="relative aspect-square w-full mb-4 rounded-xl overflow-hidden bg-[#0f0b1a]">
              <Image
                src={generatedImage || "/placeholder.svg"}
                alt="Retrato Falado Gerado"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-sm text-muted-foreground text-center mb-4">
              Retrato gerado com base nas características fornecidas
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDownload}
                className="bg-[#2b2438] hover:bg-[#3a3147] text-white flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar
              </Button>
              <Button
                onClick={handleShare}
                className="bg-[#2b2438] hover:bg-[#3a3147] text-white flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Generate Another */}
          <Button
            onClick={handleReset}
            className="w-full gradient-primary text-white btn-touch text-lg font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Gerar Novo Retrato
          </Button>

          <Link href="/home">
            <Button variant="ghost" className="w-full mt-4 text-white">
              Voltar ao Menu
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0b1a] p-6 pb-20">
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Sex - Required */}
          <div>
            <Label className="text-sm text-white mb-3 block">
              Sexo <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange("sex", "masculino")}
                className={`bg-[#1a1625] border rounded-xl p-4 text-white transition-colors ${
                  formData.sex === "masculino"
                    ? "border-[#4aa3ff] bg-[#4aa3ff]/10"
                    : "border-[#2b2438] hover:border-[#4aa3ff]/50"
                }`}
              >
                Masculino
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("sex", "feminino")}
                className={`bg-[#1a1625] border rounded-xl p-4 text-white transition-colors ${
                  formData.sex === "feminino"
                    ? "border-[#4aa3ff] bg-[#4aa3ff]/10"
                    : "border-[#2b2438] hover:border-[#4aa3ff]/50"
                }`}
              >
                Feminino
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <Label htmlFor="age" className="text-sm text-white mb-2 block">
              Idade Aproximada
            </Label>
            <Input
              id="age"
              type="text"
              placeholder="Ex: 25-30 anos"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              className="bg-[#1a1625] border-[#2b2438] text-white placeholder:text-muted-foreground"
            />
          </div>

          {/* Skin Tone */}
          <div>
            <Label htmlFor="skinTone" className="text-sm text-white mb-2 block">
              Tom de Pele
            </Label>
            <select
              id="skinTone"
              value={formData.skinTone}
              onChange={(e) => handleInputChange("skinTone", e.target.value)}
              className="w-full bg-[#1a1625] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
            >
              <option value="">Selecione...</option>
              <option value="muito clara">Muito Clara</option>
              <option value="clara">Clara</option>
              <option value="média">Média</option>
              <option value="morena">Morena</option>
              <option value="escura">Escura</option>
              <option value="muito escura">Muito Escura</option>
            </select>
          </div>

          {/* Face Shape */}
          <div>
            <Label htmlFor="faceShape" className="text-sm text-white mb-2 block">
              Formato do Rosto
            </Label>
            <select
              id="faceShape"
              value={formData.faceShape}
              onChange={(e) => handleInputChange("faceShape", e.target.value)}
              className="w-full bg-[#1a1625] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
            >
              <option value="">Selecione...</option>
              <option value="oval">Oval</option>
              <option value="redondo">Redondo</option>
              <option value="quadrado">Quadrado</option>
              <option value="triangular">Triangular</option>
              <option value="alongado">Alongado</option>
              <option value="coração">Coração</option>
            </select>
          </div>

          {/* Hair Section */}
          <div className="space-y-4 bg-[#1a1625] border border-[#2b2438] rounded-xl p-4">
            <h3 className="text-white font-semibold">Cabelo</h3>

            <div>
              <Label htmlFor="hairColor" className="text-sm text-white mb-2 block">
                Cor do Cabelo
              </Label>
              <select
                id="hairColor"
                value={formData.hairColor}
                onChange={(e) => handleInputChange("hairColor", e.target.value)}
                className="w-full bg-[#0f0b1a] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
              >
                <option value="">Selecione...</option>
                <option value="preto">Preto</option>
                <option value="castanho escuro">Castanho Escuro</option>
                <option value="castanho">Castanho</option>
                <option value="castanho claro">Castanho Claro</option>
                <option value="loiro">Loiro</option>
                <option value="ruivo">Ruivo</option>
                <option value="grisalho">Grisalho</option>
                <option value="branco">Branco</option>
                <option value="colorido">Colorido (tingido)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="hairLength" className="text-sm text-white mb-2 block">
                Comprimento
              </Label>
              <select
                id="hairLength"
                value={formData.hairLength}
                onChange={(e) => handleInputChange("hairLength", e.target.value)}
                className="w-full bg-[#0f0b1a] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
              >
                <option value="">Selecione...</option>
                <option value="careca">Careca</option>
                <option value="muito curto">Muito Curto</option>
                <option value="curto">Curto</option>
                <option value="médio">Médio</option>
                <option value="longo">Longo</option>
                <option value="muito longo">Muito Longo</option>
              </select>
            </div>

            <div>
              <Label htmlFor="hairStyle" className="text-sm text-white mb-2 block">
                Estilo
              </Label>
              <Input
                id="hairStyle"
                type="text"
                placeholder="Ex: liso, ondulado, cacheado, crespo, raspado"
                value={formData.hairStyle}
                onChange={(e) => handleInputChange("hairStyle", e.target.value)}
                className="bg-[#0f0b1a] border-[#2b2438] text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Eyes Section */}
          <div className="space-y-4 bg-[#1a1625] border border-[#2b2438] rounded-xl p-4">
            <h3 className="text-white font-semibold">Olhos</h3>

            <div>
              <Label htmlFor="eyeColor" className="text-sm text-white mb-2 block">
                Cor dos Olhos
              </Label>
              <select
                id="eyeColor"
                value={formData.eyeColor}
                onChange={(e) => handleInputChange("eyeColor", e.target.value)}
                className="w-full bg-[#0f0b1a] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
              >
                <option value="">Selecione...</option>
                <option value="castanhos escuros">Castanhos Escuros</option>
                <option value="castanhos">Castanhos</option>
                <option value="castanhos claros">Castanhos Claros</option>
                <option value="verdes">Verdes</option>
                <option value="azuis">Azuis</option>
                <option value="cinzas">Cinzas</option>
                <option value="mel">Mel</option>
              </select>
            </div>

            <div>
              <Label htmlFor="eyeShape" className="text-sm text-white mb-2 block">
                Formato dos Olhos
              </Label>
              <select
                id="eyeShape"
                value={formData.eyeShape}
                onChange={(e) => handleInputChange("eyeShape", e.target.value)}
                className="w-full bg-[#0f0b1a] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
              >
                <option value="">Selecione...</option>
                <option value="amendoados">Amendoados</option>
                <option value="redondos">Redondos</option>
                <option value="puxados">Puxados</option>
                <option value="caídos">Caídos</option>
                <option value="encapuzados">Encapuzados</option>
              </select>
            </div>
          </div>

          {/* Nose */}
          <div>
            <Label htmlFor="noseShape" className="text-sm text-white mb-2 block">
              Formato do Nariz
            </Label>
            <select
              id="noseShape"
              value={formData.noseShape}
              onChange={(e) => handleInputChange("noseShape", e.target.value)}
              className="w-full bg-[#1a1625] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
            >
              <option value="">Selecione...</option>
              <option value="fino">Fino</option>
              <option value="médio">Médio</option>
              <option value="largo">Largo</option>
              <option value="aquilino">Aquilino</option>
              <option value="arrebitado">Arrebitado</option>
              <option value="achatado">Achatado</option>
            </select>
          </div>

          {/* Mouth */}
          <div>
            <Label htmlFor="mouthShape" className="text-sm text-white mb-2 block">
              Formato da Boca
            </Label>
            <select
              id="mouthShape"
              value={formData.mouthShape}
              onChange={(e) => handleInputChange("mouthShape", e.target.value)}
              className="w-full bg-[#1a1625] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
            >
              <option value="">Selecione...</option>
              <option value="lábios finos">Lábios Finos</option>
              <option value="lábios médios">Lábios Médios</option>
              <option value="lábios carnudos">Lábios Carnudos</option>
              <option value="boca pequena">Boca Pequena</option>
              <option value="boca grande">Boca Grande</option>
            </select>
          </div>

          {/* Facial Hair (only for males) */}
          {formData.sex === "masculino" && (
            <div>
              <Label htmlFor="facialHair" className="text-sm text-white mb-2 block">
                Barba/Bigode
              </Label>
              <select
                id="facialHair"
                value={formData.facialHair}
                onChange={(e) => handleInputChange("facialHair", e.target.value)}
                className="w-full bg-[#1a1625] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
              >
                <option value="">Selecione...</option>
                <option value="sem barba">Sem Barba</option>
                <option value="barba por fazer">Barba por Fazer</option>
                <option value="barba curta">Barba Curta</option>
                <option value="barba média">Barba Média</option>
                <option value="barba longa">Barba Longa</option>
                <option value="cavanhaque">Cavanhaque</option>
                <option value="bigode">Bigode</option>
                <option value="barba e bigode">Barba e Bigode</option>
              </select>
            </div>
          )}

          {/* Build */}
          <div>
            <Label htmlFor="build" className="text-sm text-white mb-2 block">
              Estrutura Corporal
            </Label>
            <select
              id="build"
              value={formData.build}
              onChange={(e) => handleInputChange("build", e.target.value)}
              className="w-full bg-[#1a1625] border border-[#2b2438] text-white rounded-xl p-3 focus:outline-none focus:border-[#4aa3ff]"
            >
              <option value="">Selecione...</option>
              <option value="magro">Magro</option>
              <option value="esbelto">Esbelto</option>
              <option value="atlético">Atlético</option>
              <option value="médio">Médio</option>
              <option value="robusto">Robusto</option>
              <option value="forte">Forte</option>
              <option value="acima do peso">Acima do Peso</option>
            </select>
          </div>

          {/* Height */}
          <div>
            <Label htmlFor="height" className="text-sm text-white mb-2 block">
              Altura Aproximada
            </Label>
            <Input
              id="height"
              type="text"
              placeholder="Ex: 1,75m ou baixo/médio/alto"
              value={formData.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              className="bg-[#1a1625] border-[#2b2438] text-white placeholder:text-muted-foreground"
            />
          </div>

          {/* Distinctive Features */}
          <div>
            <Label htmlFor="distinctiveFeatures" className="text-sm text-white mb-2 block">
              Características Distintivas
            </Label>
            <Textarea
              id="distinctiveFeatures"
              placeholder="Cicatrizes, tatuagens, piercings, marcas de nascença, óculos, etc."
              value={formData.distinctiveFeatures}
              onChange={(e) => handleInputChange("distinctiveFeatures", e.target.value)}
              className="bg-[#1a1625] border-[#2b2438] text-white placeholder:text-muted-foreground min-h-24"
            />
          </div>

          {/* Clothing */}
          <div>
            <Label htmlFor="clothing" className="text-sm text-white mb-2 block">
              Vestimenta
            </Label>
            <Input
              id="clothing"
              type="text"
              placeholder="Ex: camiseta preta, jaqueta jeans"
              value={formData.clothing}
              onChange={(e) => handleInputChange("clothing", e.target.value)}
              className="bg-[#1a1625] border-[#2b2438] text-white placeholder:text-muted-foreground"
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm text-white mb-2 block">
              Local do Incidente
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Onde a pessoa foi vista?"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-[#1a1625] border-[#2b2438] text-white placeholder:text-muted-foreground"
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
          <div className="bg-[#1a1625] border border-[#2b2438] rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-white">Dica:</strong> Quanto mais detalhes você fornecer, mais preciso será o
              retrato gerado pela IA. Preencha o máximo de campos possível para obter o melhor resultado.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
