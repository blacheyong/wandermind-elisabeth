"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ============================================================
   AppShell — WanderMind top nav + sidebar shell
   Light mode. All values reference tokens.css custom properties.
   ============================================================ */

const NAV = [
  {
    label: "Voyage",
    items: [
      { href: "/onboarding/trip-context", label: "Préférences de voyage" },
      { href: "/trips",                   label: "Voyages récents" },
      { href: "/saved",                   label: "Itinéraires sauvegardés" },
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

/* ── Top navigation ──────────────────────────────────────── */
function TopNav() {
  return (
    <header style={{
      height: "var(--nav-height)",
      background: "var(--surface-white)",
      borderBottom: "1px solid var(--border-default)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>

      {/* Wordmark: "WanderMind" — SegmentAlt Bold, black */}
      <Link href="/" style={{
        fontFamily: "var(--font)",
        fontSize: "17px",
        fontWeight: 700,
        letterSpacing: "-0.5px",
        color: "var(--text-primary)",
        lineHeight: 1,
        textDecoration: "none",
      }}>
        WanderMind
      </Link>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        {/* Language toggle — mirrors BYC's "En" pill */}
        <button style={{
          fontFamily: "var(--font)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: "var(--text-tertiary)",
          background: "var(--surface-page)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-full)",
          padding: "4px 12px",
          cursor: "pointer",
          transition: "background var(--motion-micro), color var(--motion-micro)",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--border-default)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--surface-page)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
        }}>
          EN
        </button>

        {/* Avatar + hamburger pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          background: "var(--surface-page)",
          padding: "4px 11px 4px 4px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-default)",
          cursor: "pointer",
          transition: "background var(--motion-micro)",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--grey-200)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-page)"}>
          {/* Avatar — ÉD initials in primary blue */}
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "var(--blue-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.03em",
          }}>
            ÉD
          </div>
          {/* Hamburger lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3.5px", width: "16px" }}>
            {[16, 11, 16].map((w, i) => (
              <div key={i} style={{
                height: "1.5px",
                width: `${w}px`,
                background: "rgba(0,0,0,0.55)",
                borderRadius: "1px",
              }} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Sidebar ─────────────────────────────────────────────── */
function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "var(--sidebar-width)",
      background: "var(--surface-white)",
      borderRight: "1px solid var(--border-default)",
      flexShrink: 0,
      overflowY: "auto",
      padding: "24px 0 20px",
    }}>
      {NAV.map((section, si) => (
        <div key={si}>
          {si > 0 && (
            <div style={{ margin: "12px 14px", height: "1px", background: "var(--border-default)" }} />
          )}

          {/* Section group label */}
          <div style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "var(--text-tertiary)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0 16px",
            marginBottom: "2px",
          }}>
            {section.label}
          </div>

          {section.items.map(item => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "8px 16px 8px 14px",
                borderLeft: `2px solid ${isActive ? "var(--blue-primary)" : "transparent"}`,
                background: isActive ? "var(--surface-active)" : "transparent",
                textDecoration: "none",
                transition: `background var(--motion-micro)`,
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "var(--surface-hover)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                {/* Dot */}
                <div style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: isActive ? "var(--blue-primary)" : "rgba(0,0,0,0.2)",
                  flexShrink: 0,
                  transition: `background var(--motion-micro)`,
                }} />
                {/* Label */}
                <span style={{
                  fontSize: "12.5px",
                  lineHeight: "1.3",
                  color: isActive ? "var(--blue-primary)" : "var(--text-secondary)",
                  fontWeight: isActive ? 500 : 400,
                  transition: `color var(--motion-micro)`,
                }}>
                  {item.label}
                </span>
              </Link>
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
      flexDirection: "column",
      minHeight: "100dvh",
      background: "var(--surface-page)",
      color: "var(--text-primary)",
      fontFamily: "var(--font)",
    }}>
      <TopNav />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, background: "var(--surface-page)", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
