"use client"

import { useState } from "react"
import { ArrowLeft, Phone, Info, HelpCircle, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export default function PoliciaMilitarPage() {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()

  const handleCall = () => {
    if (typeof window !== "undefined" && window.navigator.userAgent.match(/Mobile/)) {
      window.location.href = "tel:190"
    } else {
      setShowModal(true)
    }
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
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-12">{t("policiaMilitarTitle")}</h1>

        {/* Call Button */}
        <button
          onClick={handleCall}
          className="w-full gradient-primary rounded-2xl p-6 btn-touch flex items-center justify-center gap-3 mb-8 hover:opacity-90 transition-opacity"
        >
          <Phone className="w-6 h-6 text-white" />
          <span className="text-xl font-semibold text-white">{t("call190")}</span>
        </button>

        {/* Menu Options */}
        <div className="space-y-3">
          <Link href="/sobre">
            <div className="bg-[#1a1625] rounded-2xl p-5 border border-[#2b2438] hover:border-[#4aa3ff] transition-colors flex items-center gap-4">
              <Info className="w-5 h-5 text-[#4aa3ff]" />
              <span className="text-white">{t("aboutPolice")}</span>
            </div>
          </Link>

          <Link href="/ajuda">
            <div className="bg-[#1a1625] rounded-2xl p-5 border border-[#2b2438] hover:border-[#4aa3ff] transition-colors flex items-center gap-4">
              <HelpCircle className="w-5 h-5 text-[#4aa3ff]" />
              <span className="text-white">{t("help")}</span>
            </div>
          </Link>

          <Link href="/configuracoes">
            <div className="bg-[#1a1625] rounded-2xl p-5 border border-[#2b2438] hover:border-[#4aa3ff] transition-colors flex items-center gap-4">
              <Settings className="w-5 h-5 text-[#4aa3ff]" />
              <span className="text-white">{t("settings")}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Modal for desktop */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-[#1a1625] rounded-3xl p-8 max-w-sm w-full border border-[#2b2438]">
            <h3 className="text-xl font-bold text-white mb-4">{t("policiaMilitarTitle")}</h3>
            <p className="text-muted-foreground mb-6">
              Disque <span className="text-[#4aa3ff] font-bold text-2xl">190</span> no seu telefone para contatar a
              Polícia Militar.
            </p>
            <Button onClick={() => setShowModal(false)} className="w-full gradient-primary text-white btn-touch">
              Entendi
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
