"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ============================================================
   AppShell — WanderMind top nav + sidebar shell
   Light mode. All values reference tokens.css custom properties.
   ============================================================ */

type NavSubItem = { href: string; label: string }
type NavItem = { href: string; label: string; subItems?: NavSubItem[] }
type NavSection = { label: string; items: NavItem[] }

const NAV: NavSection[] = [
  {
    label: "Voyage",
    items: [
      {
        href: "/onboarding/constraints",
        label: "Préférences de voyage",
        subItems: [
          { href: "/account/preferences",    label: "Préférences globales" },
          { href: "/onboarding/review",      label: "Voyage de cet été" },
          { href: "/trips/work",             label: "Voyage de travail" },
        ],
      },
      { href: "/trips",  label: "Voyages récents" },
      { href: "/saved",  label: "Itinéraires sauvegardés" },
    ],
  },
  {
    label: "Compte",
    items: [
      { href: "/account/personal",  label: "Informations personnelles" },
      { href: "/account/security",  label: "Paramètres de sécurité" },
      { href: "/account/language",  label: "Langue et région" },
      { href: "/account/rewards",   label: "Programme de récompenses" },
      { href: "/account/privacy",   label: "Confidentialité" },
    ],
  },
  {
    label: "Assistance",
    items: [{ href: "/help", label: "Aide" }],
  },
];

/* ── Floating controls (top-right, no bar) ───────────────── */
function FloatingControls() {
  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "24px",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}>
      {/* Language toggle */}
      <button style={{
        fontFamily: "var(--font)",
        fontSize: "15px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: "rgba(255,255,255,0.85)",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.35)",
        borderRadius: "16px",
        height: "44px",
        padding: "0 20px",
        cursor: "pointer",
        transition: "border-color var(--motion-micro), color var(--motion-micro)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.8)";
        (e.currentTarget as HTMLElement).style.color = "#ffffff";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)";
        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
      }}>
        EN
      </button>

      {/* Avatar + hamburger pill */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "transparent",
        height: "44px",
        padding: "0 16px 0 8px",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.35)",
        cursor: "pointer",
        transition: "border-color var(--motion-micro)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.8)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)"}>
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--blue-primary)",
          letterSpacing: "0.03em",
          flexShrink: 0,
        }}>
          ÉD
        </div>
        <div className="menu-lines" style={{ display: "flex", flexDirection: "column", gap: "3.5px", width: "16px" }}>
          {([["menu-line-1", 16], ["menu-line-2", 11], ["menu-line-3", 16]] as const).map(([cls, w]) => (
            <div key={cls} className={cls} style={{
              height: "1.5px",
              width: `${w}px`,
              background: "rgba(255,255,255,0.7)",
              borderRadius: "2px",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────── */
function Sidebar() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "fr";

  return (
    <aside style={{
      width: "var(--sidebar-width)",
      background: "var(--surface-white)",
      borderRight: "1px solid var(--border-default)",
      flexShrink: 0,
      overflowY: "auto",
      padding: "0 0 20px",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Wordmark */}
      <Link href="/" style={{
        fontFamily: "var(--font)",
        fontSize: "29px",
        fontWeight: 700,
        letterSpacing: "-0.7px",
        lineHeight: 0.9,
        textDecoration: "none",
        padding: "28px 20px 32px",
        display: "block",
        flexShrink: 0,
      }}>
        <span style={{ display: "block", color: "var(--text-primary)" }}>Wander</span>
        <span style={{ display: "block", color: "var(--blue-primary)" }}>Mind</span>
      </Link>
      {NAV.map((section, si) => (
        <div key={si}>
          {si > 0 && (
            <div style={{ margin: "16px 14px", height: "1px", background: "var(--border-default)" }} />
          )}

          {/* Section group label */}
          <div style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--text-tertiary)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0 20px",
            marginBottom: "6px",
          }}>
            {section.label}
          </div>

          {section.items.map(item => {
            const localizedHref = `/${locale}${item.href}`;
            const hasSubItems = item.subItems && item.subItems.length > 0;

            // parent is "active" if any sub-item matches (or no sub-items and direct match)
            const isParentActive = hasSubItems
              ? item.subItems!.some(s => {
                  const sh = `/${locale}${s.href}`;
                  return pathname === sh || pathname?.startsWith(sh + "/");
                })
              : pathname === localizedHref || pathname?.startsWith(localizedHref + "/");

            return (
              <div key={item.href}>
                <Link href={localizedHref} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 20px 10px 18px",
                  borderLeft: `2px solid ${isParentActive && !hasSubItems ? "var(--blue-primary)" : "transparent"}`,
                  background: isParentActive && !hasSubItems ? "var(--surface-active)" : "transparent",
                  textDecoration: "none",
                  transition: `background var(--motion-micro)`,
                }}
                onMouseEnter={e => { if (!isParentActive || hasSubItems) (e.currentTarget as HTMLElement).style.background = "var(--surface-hover)"; }}
                onMouseLeave={e => { if (!isParentActive || hasSubItems) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <div style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: isParentActive ? "var(--blue-primary)" : "rgba(0,0,0,0.2)",
                    flexShrink: 0,
                    transition: `background var(--motion-micro)`,
                  }} />
                  <span style={{
                    fontSize: "15px", lineHeight: "1.35",
                    color: isParentActive ? "var(--blue-primary)" : "var(--text-secondary)",
                    fontWeight: isParentActive ? 600 : 400,
                    transition: `color var(--motion-micro)`,
                  }}>
                    {item.label}
                  </span>
                </Link>

                {/* Sub-items — shown when parent is active */}
                {hasSubItems && isParentActive && (
                  <div style={{ borderLeft: "1px solid var(--border-default)", margin: "2px 0 6px 30px" }}>
                    {item.subItems!.map(sub => {
                      const sh = `/${locale}${sub.href}`;
                      const isSubActive = pathname === sh || pathname?.startsWith(sh + "/");
                      return (
                        <Link key={sub.href} href={sh} style={{
                          display: "block",
                          padding: "7px 14px",
                          textDecoration: "none",
                          borderRadius: "0 6px 6px 0",
                          background: isSubActive ? "var(--surface-active)" : "transparent",
                          transition: `background var(--motion-micro)`,
                        }}
                        onMouseEnter={e => { if (!isSubActive) (e.currentTarget as HTMLElement).style.background = "var(--surface-hover)"; }}
                        onMouseLeave={e => { if (!isSubActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <span style={{
                            fontSize: "13.5px", lineHeight: "1.35",
                            color: isSubActive ? "var(--blue-primary)" : "var(--text-secondary)",
                            fontWeight: isSubActive ? 600 : 400,
                          }}>
                            {sub.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

/* ── AppShell ────────────────────────────────────────────── */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100dvh",
      background: "var(--surface-page)",
      color: "var(--text-primary)",
      fontFamily: "var(--font)",
    }}>
      <Sidebar />
      <main style={{ flex: 1, background: "var(--surface-page)", overflowY: "auto" }}>
        {children}
      </main>
      <FloatingControls />
    </div>
  );
}
