"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    let io: IntersectionObserver | null = null

    const run = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(".byc-reveal"))
      if (!els.length) return

      // Reset so navigation between steps re-animates
      els.forEach(el => el.classList.remove("is-visible"))

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible")
              io?.unobserve(e.target)
            }
          })
        },
        { threshold: 0.01, rootMargin: "0px" }
      )

      els.forEach(el => io!.observe(el))
    }

    // Give the new page time to render before observing
    const t = setTimeout(run, 80)
    return () => { clearTimeout(t); io?.disconnect() }
  }, [pathname])

  return null
}
