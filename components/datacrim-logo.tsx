import Image from "next/image"

interface DataCrimLogoProps {
  size?: "small" | "medium" | "large"
  useIconLogo?: boolean
}

export function DataCrimLogo({ size = "medium", useIconLogo = false }: DataCrimLogoProps) {
  const dimensions = {
    small: { width: 80, height: 80 },
    medium: { width: 140, height: 140 },
    large: { width: 220, height: 220 },
  }

  const { width, height } = dimensions[size]

  const logoSrc = useIconLogo ? "/icon-logo.png" : "/logo.png"
  const borderRadiusClass = useIconLogo ? "rounded-lg" : ""

  return (
    <div className="flex items-center justify-center">
      <Image
        src={logoSrc || "/placeholder.svg"}
        alt="DataCrim - Plataforma de Segurança e Denúncias"
        width={width}
        height={height}
        priority
        className={`object-contain ${borderRadiusClass}`}
      />
    </div>
  )
}
