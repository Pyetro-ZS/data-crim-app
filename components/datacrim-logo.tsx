interface DataCrimLogoProps {
  size?: "small" | "medium" | "large"
}

export function DataCrimLogo({ size = "medium" }: DataCrimLogoProps) {
  const dimensions = {
    small: { icon: 40, text: "text-xl" },
    medium: { icon: 64, text: "text-3xl" },
    large: { icon: 96, text: "text-5xl" },
  }

  const { icon, text } = dimensions[size]

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Shield Icon with Brain/Circuit Pattern */}
      <div className="relative flex items-center justify-center" style={{ width: icon, height: icon }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Shield Shape */}
          <path
            d="M50 5 L85 20 L85 45 Q85 75 50 95 Q15 75 15 45 L15 20 Z"
            fill="url(#gradient)"
            stroke="url(#gradient)"
            strokeWidth="2"
          />

          {/* Brain/Circuit Pattern - Left Side */}
          <path d="M35 35 Q30 40 30 45 Q30 50 35 55" stroke="white" strokeWidth="2" fill="none" opacity="0.8" />
          <circle cx="35" cy="35" r="2" fill="white" opacity="0.8" />
          <circle cx="35" cy="55" r="2" fill="white" opacity="0.8" />

          {/* Circuit Pattern - Right Side */}
          <path d="M65 30 L65 45 M65 45 L70 45 M65 45 L65 60" stroke="white" strokeWidth="2" opacity="0.8" />
          <circle cx="65" cy="30" r="2" fill="white" opacity="0.8" />
          <circle cx="70" cy="45" r="2" fill="white" opacity="0.8" />
          <circle cx="65" cy="60" r="2" fill="white" opacity="0.8" />

          {/* Center Connection */}
          <path d="M35 45 L50 45 L65 45" stroke="white" strokeWidth="2" opacity="0.8" />
          <circle cx="50" cy="45" r="3" fill="white" opacity="0.9" />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4aa3ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* DataCrim Text */}
      <h1 className={`${text} font-bold gradient-logo bg-clip-text text-transparent`}>DataCrim</h1>
    </div>
  )
}
