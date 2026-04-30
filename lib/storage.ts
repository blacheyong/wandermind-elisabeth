import { z } from "zod"
import { TripDraft, Itinerary } from "@/lib/schema"

const DRAFT_KEY = "wandermind:draft"
const ITINERARY_PREFIX = "wandermind:itinerary:"

function safeLocalStorage() {
  if (typeof window === "undefined") return null
  return window.localStorage
}

function parse<T>(schema: z.ZodType<T>, raw: string | null): T | null {
  if (raw === null) return null
  try {
    return schema.parse(JSON.parse(raw))
  } catch {
    return null
  }
}

export function getDraft(): TripDraft | null {
  const ls = safeLocalStorage()
  return ls ? parse(TripDraft, ls.getItem(DRAFT_KEY)) : null
}

export function saveDraft(draft: TripDraft): void {
  const ls = safeLocalStorage()
  if (!ls) return
  ls.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function clearDraft(): void {
  const ls = safeLocalStorage()
  if (!ls) return
  ls.removeItem(DRAFT_KEY)
}

export function getItinerary(id: string): Itinerary | null {
  const ls = safeLocalStorage()
  return ls ? parse(Itinerary, ls.getItem(`${ITINERARY_PREFIX}${id}`)) : null
}

export function saveItinerary(itinerary: Itinerary): void {
  const ls = safeLocalStorage()
  if (!ls) return
  ls.setItem(`${ITINERARY_PREFIX}${itinerary.id}`, JSON.stringify(itinerary))
}
