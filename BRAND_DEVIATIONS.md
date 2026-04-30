# BRAND_DEVIATIONS.md

Deviations from the BYCo Figma Foundations. All items must be confirmed or corrected before production.

---

## Font substitution — SegmentAlt → Inter

**Status:** ✅ RESOLVED (2026-04-29)

**Resolution:** SegmentAlt WOFF2 files were already present in the BYCo kit at `public/byc-2.0-master/src/fonts/segment-{regular,medium,semibold,bold}.woff2`. Updated `app/styles/tokens.css` `@font-face` declarations to point to these files, and updated `--font-sans` in `app/globals.css` to use SegmentAlt. Inter has been removed from `app/layout.tsx`. All 4 weights load with HTTP 200.

---

## Color values — derived, not confirmed

**Status:** TODO: confirm with BYCo or via Figma token export

**Problem:** Figma MCP returns semantic token names (e.g. `Surfaces/Background/Default`) but does not resolve alias chains to raw hex values. The Foundations BYCo file stores colors as aliases pointing to primitive collections that were not accessible via MCP variable resolution.

**What was confirmed:**
- `Primary/500` = `#2d39f7` (observed directly from Figma thumbnail frame background)
- `--keyline-light` = `rgba(255, 255, 255, 0.5)` (observed in Figma-generated component code)
- `--text-body-inverse` = `rgba(255, 255, 255, 0.7)` (observed in Figma-generated component code)
- Font weight: Bold = 700

**What was derived (defensible, based on editorial B2B pattern + thumbnail + live site):**

| Token | Value | Confidence |
|---|---|---|
| Background/Default | `#ffffff` | High |
| Background/Secondary | `#f8f8f8` | Medium |
| Text/Header | `#0a0a0a` | High |
| Text/Body | `#1a1a1a` | High |
| Text/Captions | `#737373` | Medium |
| Text/Disabled | `#a3a3a3` | Medium |
| Borders/Default | `#e5e5e5` | Medium |
| Error | `#dc2626` | Low — standard red, needs confirmation |
| Warning | `#d97706` | Low — standard amber, needs confirmation |
| Success | `#16a34a` | Low — standard green, needs confirmation |

**To fix:** Request Figma token export (JSON or CSS) from BYCo, or ask for edit access to the Foundations file to resolve primitive values.

---

## Motion tokens — not in Figma file

**Status:** TODO: confirm with BYCo

**Problem:** No motion tokens found in the Foundations BYCo library via MCP search.

**Derivation:** Standard Material-adjacent easing curves, conservative durations.

```
--duration-fast:     100ms
--duration-base:     200ms
--duration-slow:     350ms
--easing-standard:   cubic-bezier(0.4, 0, 0.2, 1)
--easing-emphasized: cubic-bezier(0.2, 0, 0, 1)
```

---

## Radius — derived from site observation

**Status:** TODO: confirm with BYCo

**Problem:** No explicit radius tokens in the Foundations BYCo library.

**Derivation:** BYCo live site (`blacheyong.com`) uses minimal/flat radii. Base set to 4px.

---

## Spacing — derived from Scale primitives

**Status:** Reasonable, no confirmation needed

The Scale/* tokens in Figma are 1:1px (Scale/8 = 8px, Scale/16 = 16px, etc.) on a 4px grid. This is consistent with a standard spacing system and has been implemented as-is.
