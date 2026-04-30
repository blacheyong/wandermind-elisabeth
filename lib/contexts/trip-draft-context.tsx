"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { TripDraft } from "@/lib/schema"
import { getDraft, saveDraft } from "@/lib/storage"

type Action =
  | { type: "SET_DRAFT"; payload: Partial<TripDraft> }
  | { type: "HYDRATE"; payload: TripDraft }
  | { type: "RESET" }

const INITIAL: TripDraft = {
  currentStep: "trip-context",
  lastUpdated: new Date().toISOString(),
}

function reducer(state: TripDraft, action: Action): TripDraft {
  switch (action.type) {
    case "HYDRATE":
      return action.payload
    case "SET_DRAFT":
      return {
        ...state,
        ...action.payload,
        lastUpdated: new Date().toISOString(),
      }
    case "RESET":
      return { ...INITIAL, lastUpdated: new Date().toISOString() }
    default:
      return state
  }
}

type TripDraftContextValue = {
  draft: TripDraft
  setDraft: (patch: Partial<TripDraft>) => void
  reset: () => void
}

const TripDraftContext = createContext<TripDraftContextValue | null>(null)

export function TripDraftProvider({ children }: { children: ReactNode }) {
  const [draft, dispatch] = useReducer(reducer, INITIAL)

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const saved = getDraft()
    if (saved) {
      dispatch({ type: "HYDRATE", payload: saved })
    }
  }, [])

  // Persist to localStorage on every state change
  useEffect(() => {
    saveDraft(draft)
  }, [draft])

  const setDraft = useCallback((patch: Partial<TripDraft>) => {
    dispatch({ type: "SET_DRAFT", payload: patch })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: "RESET" })
  }, [])

  return (
    <TripDraftContext.Provider value={{ draft, setDraft, reset }}>
      {children}
    </TripDraftContext.Provider>
  )
}

export function useTripDraft(): TripDraftContextValue {
  const ctx = useContext(TripDraftContext)
  if (!ctx) throw new Error("useTripDraft must be used inside TripDraftProvider")
  return ctx
}
