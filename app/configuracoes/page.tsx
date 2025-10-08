"use client"

import { ArrowLeft, Bell, Lock, Globe, Moon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function ConfiguracoesPage() {
  return (
    <div className="min-h-screen bg-[#0f0b1a] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/policia-civil">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-[#1a1625] rounded-3xl p-6 border border-[#2b2438]">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-[#4aa3ff]" />
              <h2 className="text-lg font-semibold text-white">Notificações</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Alertas de Segurança</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Atualizações de Boletim</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Notificações Push</span>
                <Switch />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-[#1a1625] rounded-3xl p-6 border border-[#2b2438]">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-[#4aa3ff]" />
              <h2 className="text-lg font-semibold text-white">Privacidade</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Denúncias Anônimas por Padrão</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Compartilhar Localização</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-[#1a1625] rounded-3xl p-6 border border-[#2b2438]">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-5 h-5 text-[#4aa3ff]" />
              <h2 className="text-lg font-semibold text-white">Aparência</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Modo Escuro</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-[#1a1625] rounded-3xl p-6 border border-[#2b2438]">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#4aa3ff]" />
              <h2 className="text-lg font-semibold text-white">Idioma</h2>
            </div>
            <select className="w-full bg-[#2b2438] border border-[#2b2438] rounded-xl p-3 text-white">
              <option>Português (Brasil)</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>

          {/* About */}
          <div className="bg-[#1a1625] rounded-3xl p-6 border border-[#2b2438] text-center">
            <p className="text-muted-foreground text-sm mb-1">DataCrim v1.0.0</p>
            <p className="text-muted-foreground text-xs">© 2025 DataCrim. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
