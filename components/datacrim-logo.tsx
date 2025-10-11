import Image from "next/image"

interface DataCrimLogoProps {
  size?: "small" | "medium" | "large"
}

export function DataCrimLogo({ size = "medium" }: DataCrimLogoProps) {
  const dimensions = {
    small: { width: 80, height: 80 },
    medium: { width: 140, height: 140 },
    large: { width: 220, height: 220 },
  }

  const { width, height } = dimensions[size]

  return (
    <div className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="DataCrim - Plataforma de Segurança e Denúncias"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  )
}
