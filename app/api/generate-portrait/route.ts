import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt, formData } = await request.json()

    console.log("[v0] Generating portrait with prompt:", prompt)
    console.log("[v0] Form data:", formData)

    await new Promise((resolve) => setTimeout(resolve, 2500))

    const portraitQuery = buildPortraitQuery(formData)

    const imageUrl = `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(portraitQuery)}`

    console.log("[v0] Generated portrait URL:", imageUrl)

    return NextResponse.json({
      imageUrl: imageUrl,
      prompt: prompt,
      success: true,
      metadata: {
        generatedAt: new Date().toISOString(),
        characteristics: formData,
      },
    })
  } catch (error) {
    console.error("[v0] Error generating portrait:", error)
    return NextResponse.json(
      {
        error: "Não foi possível gerar o retrato. Por favor, verifique os dados e tente novamente.",
        success: false,
      },
      { status: 500 },
    )
  }
}

function buildPortraitQuery(formData: any): string {
  const parts: string[] = ["professional police sketch portrait"]

  // Add sex and age
  if (formData.sex) {
    parts.push(formData.sex === "masculino" ? "male face" : "female face")
  }
  if (formData.age) {
    parts.push(`age ${formData.age}`)
  }

  // Add facial features
  if (formData.skinTone) parts.push(`${formData.skinTone} skin`)
  if (formData.faceShape) parts.push(`${formData.faceShape} face shape`)

  // Hair details
  if (formData.hairColor && formData.hairLength) {
    parts.push(`${formData.hairLength} ${formData.hairColor} hair`)
  }
  if (formData.hairStyle) parts.push(formData.hairStyle)

  // Eyes
  if (formData.eyeColor) parts.push(`${formData.eyeColor} eyes`)
  if (formData.eyeShape) parts.push(`${formData.eyeShape} shaped eyes`)

  // Other features
  if (formData.noseShape) parts.push(`${formData.noseShape} nose`)
  if (formData.facialHair && formData.sex === "masculino") parts.push(formData.facialHair)

  // Add style descriptors
  parts.push("front facing")
  parts.push("neutral expression")
  parts.push("realistic detailed portrait")
  parts.push("high quality")

  return parts.join(", ")
}
