import Link from "next/link"
import { Phone, FileText, User, MapPin } from "lucide-react"
import { DataCrimLogo } from "@/components/datacrim-logo"

export default function HomePage() {
  const menuItems = [
    {
      title: "Ligação Polícia Civil",
      icon: Phone,
      href: "/policia-civil",
      description: "Contato direto com autoridades",
    },
    {
      title: "Boletim de Ocorrência",
      icon: FileText,
      href: "/boletim",
      description: "Registre uma ocorrência",
    },
    {
      title: "Retrato Falado (IA)",
      icon: User,
      href: "/retrato-falado",
      description: "Gere retrato com IA",
    },
    {
      title: "Mapeamento do Local",
      icon: MapPin,
      href: "/mapeamento",
      description: "Visualize crimes na região",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0f0b1a] p-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12 mt-8">
          <DataCrimLogo size="medium" />
        </div>

        {/* Menu Cards */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-[#1a1625] rounded-3xl p-6 border border-[#2b2438] hover:border-[#4aa3ff] transition-all duration-300 btn-touch flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#4aa3ff] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
