import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"
import fs from "fs"
import path from "path"
import { ProfileForPrompt, Itinerary } from "@/lib/schema"
import { buildItineraryPrompt } from "@/lib/prompts/itinerary"

// dotenvx doesn't override existing process.env values — if the parent shell
// has ANTHROPIC_API_KEY="" (e.g. from Claude Code), we read .env.local directly.
function getApiKey(): string {
  const fromEnv = process.env.ANTHROPIC_API_KEY
  if (fromEnv) return fromEnv
  try {
    const envPath = path.join(process.cwd(), ".env.local")
    const content = fs.readFileSync(envPath, "utf8")
    const match = content.match(/^ANTHROPIC_API_KEY=(.+)$/m)
    return match?.[1]?.trim() ?? ""
  } catch {
    return ""
  }
}

const RequestBody = z.object({
  profile: ProfileForPrompt,
  locale: z.enum(["fr", "en"]),
})

const itineraryToolSchema = {
  name: "submit_itinerary",
  description: "Submit the generated itinerary as structured JSON.",
  input_schema: {
    type: "object" as const,
    properties: {
      destination: { type: "string" },
      tripLengthDays: { type: "number" },
      days: {
        type: "array",
        items: {
          type: "object",
          properties: {
            dayNumber: { type: "number" },
            theme: { type: "string", description: "One-line theme for the day, e.g. 'Alfama and fado'" },
            activities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  time: { type: "string", description: "Start time, e.g. '09:00'" },
                  name: { type: "string" },
                  type: { type: "string", description: "Category: food | museum | outdoor | transport | neighborhood | experience | rest" },
                  durationMinutes: { type: "number" },
                  estimatedCostCAD: { type: "number", description: "Estimated cost in CAD, 0 if free" },
                  reasoning: { type: "string", description: "User-facing explanation of why this was chosen, citing a specific profile field" },
                },
                required: ["time", "name", "type", "durationMinutes", "reasoning"],
              },
            },
          },
          required: ["dayNumber", "theme", "activities"],
        },
      },
    },
    required: ["destination", "tripLengthDays", "days"],
  },
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = RequestBody.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { profile, locale } = parsed.data
  const apiKey = getApiKey()

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    )
  }

  const client = new Anthropic({ apiKey })
  const systemPrompt = buildItineraryPrompt(profile, locale)

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: systemPrompt,
      tools: [itineraryToolSchema],
      tool_choice: { type: "any" },
      messages: [{ role: "user", content: "Generate the itinerary now." }],
    })

    const toolUse = response.content.find((b) => b.type === "tool_use")
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "Model did not call submit_itinerary" }, { status: 502 })
    }

    const rawItinerary = toolUse.input as Record<string, unknown>

    // Add required fields not in the tool schema
    const itineraryWithMeta = {
      id: crypto.randomUUID(),
      promptUsed: systemPrompt,
      ...rawItinerary,
    }

    const validated = Itinerary.safeParse(itineraryWithMeta)
    if (!validated.success) {
      console.error("Itinerary validation failed", validated.error.flatten())
      return NextResponse.json({ error: "Invalid itinerary structure from model" }, { status: 502 })
    }

    return NextResponse.json(validated.data)
  } catch (err) {
    console.error("Anthropic API error", err)
    return NextResponse.json({ error: "Generation failed" }, { status: 502 })
  }
}
