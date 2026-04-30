"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card"

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </p>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

function Divider() {
  return <hr className="border-border-subtle" />
}

export default function ComponentsPage() {
  const [sliderValue, setSliderValue] = useState([0])
  const [switchOn, setSwitchOn] = useState(false)

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          wandermind — byco
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-text-header">
          Composants
        </h1>
        <p className="text-text-secondary">
          Page de validation visuelle. Chaque primitif doit s&apos;inscrire dans la famille BYCo.
        </p>
      </div>

      <Divider />

      {/* Couleurs */}
      <Section label="01 — Couleurs">
        <div className="flex flex-wrap gap-2">
          {[
            ["surface-base", "bg-surface-base border border-border"],
            ["surface-elevated", "bg-surface-elevated border border-border"],
            ["surface-action", "bg-surface-action"],
            ["text-header", "bg-text-header"],
            ["text-primary", "bg-text-primary"],
            ["text-secondary", "bg-text-secondary"],
            ["text-muted", "bg-text-muted"],
            ["border-default", "bg-border-default"],
            ["accent-primary", "bg-accent-primary"],
            ["state-error", "bg-state-error"],
            ["state-warning", "bg-state-warning"],
            ["state-success", "bg-state-success"],
          ].map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className={`h-10 w-16 rounded-sm ${cls}`} />
              <span className="text-[10px] text-text-muted">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Typographie */}
      <Section label="02 — Typographie">
        <div className="flex flex-col gap-3 w-full">
          <p className="text-7xl font-bold tracking-tight text-text-header leading-tight">
            Aa
          </p>
          <p className="text-4xl font-bold tracking-tight text-text-header">
            Titre principal
          </p>
          <p className="text-2xl font-bold tracking-tight text-text-header">
            Titre secondaire
          </p>
          <p className="text-xl font-medium text-text-primary">
            Sous-titre ou accroche
          </p>
          <p className="text-base text-text-primary leading-relaxed max-w-prose">
            Corps de texte. Rédigé avec clarté, précision, structure. BYCo préfère les phrases complètes et une ponctuation soignée. Pas d&apos;exclamations.
          </p>
          <p className="text-sm text-text-secondary">
            Texte secondaire — légende ou métadonnée
          </p>
          <p className="text-xs uppercase tracking-wide font-medium text-text-muted">
            étiquette / label
          </p>
          <p className="text-base text-text-action font-medium">
            Lien d&apos;action
          </p>
        </div>
      </Section>

      <Divider />

      {/* Boutons */}
      <Section label="03 — Boutons">
        <Button variant="default">Continuer</Button>
        <Button variant="outline">Retour</Button>
        <Button variant="secondary">Secondaire</Button>
        <Button variant="ghost">Fantôme</Button>
        <Button variant="link">Lien</Button>
        <Button variant="destructive">Supprimer</Button>
        <Button variant="default" size="sm">Petit</Button>
        <Button variant="default" size="lg">Grand</Button>
        <Button variant="default" disabled>Désactivé</Button>
      </Section>

      <Divider />

      {/* Puces / Chips */}
      <Section label="04 — Puces">
        <Badge variant="outline">Végétarien</Badge>
        <Badge variant="outline">Accessible en fauteuil</Badge>
        <Badge variant="default">Sélectionné</Badge>
        <Badge variant="action">Action</Badge>
        <Badge variant="muted">Inactif</Badge>
        <Badge variant="secondary">Secondaire</Badge>
        <Badge variant="destructive">Erreur</Badge>
      </Section>

      <Divider />

      {/* Champs */}
      <Section label="05 — Champs de saisie">
        <div className="flex flex-col gap-3 w-full">
          <Input placeholder="Destination (ex. : Lisbonne)" />
          <Input placeholder="Désactivé" disabled />
          <Textarea placeholder="Autre chose ? Ex. : je déteste me sentir pressé." />
        </div>
      </Section>

      <Divider />

      {/* Bascules */}
      <Section label="06 — Bascules">
        <div className="flex items-center gap-3">
          <Switch
            checked={switchOn}
            onCheckedChange={setSwitchOn}
          />
          <span className="text-sm text-text-primary">
            {switchOn ? "Temps libre requis" : "Temps libre optionnel"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Switch defaultChecked />
          <span className="text-sm text-text-primary">Départs matinaux</span>
        </div>
        <div className="flex items-center gap-3">
          <Switch disabled />
          <span className="text-sm text-text-muted">Désactivé</span>
        </div>
      </Section>

      <Divider />

      {/* Curseur */}
      <Section label="07 — Curseur (préférences)">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Moins, plus profond</span>
              <span>Voir plus, plus vite</span>
            </div>
            <Slider
              min={-2}
              max={2}
              step={1}
              value={sliderValue}
              onValueChange={(v) => setSliderValue(Array.isArray(v) ? v : [v])}
            />
            <p className="text-xs text-text-muted text-center">
              Rythme — valeur : {sliderValue[0]}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Incontournables</span>
              <span>Hors des sentiers battus</span>
            </div>
            <Slider min={-2} max={2} step={1} defaultValue={[1]} />
          </div>
        </div>
      </Section>

      <Divider />

      {/* Cartes */}
      <Section label="08 — Cartes">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Qui &amp; où</CardTitle>
            <CardDescription>
              2 adultes · Lisbonne · 5 jours · Anniversaire
            </CardDescription>
            <CardAction>
              <button className="text-xs text-text-action hover:underline">
                Modifier
              </button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">
              Budget 400 CAD/jour · Souple · Dépenser sur la nourriture et les expériences
            </p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md border-state-warning bg-surface-warning">
          <CardHeader>
            <CardTitle className="text-state-warning">
              Contradictions détectées
            </CardTitle>
            <CardDescription>
              3 activités/jour + temps libre requis — ces deux choix s&apos;opposent.
            </CardDescription>
          </CardHeader>
        </Card>
      </Section>

      <Divider />

      {/* Marqueurs de progression */}
      <Section label="09 — Progression (01–04)">
        <div className="flex items-center gap-6 w-full">
          {[
            { step: "01 — Le voyage", state: "done" },
            { step: "02 — Vos préférences", state: "current" },
            { step: "03 — Non-négociables", state: "upcoming" },
            { step: "04 — Votre profil", state: "upcoming" },
          ].map(({ step, state }) => (
            <div key={step} className="flex flex-col gap-1">
              <div
                className={`h-0.5 w-full ${
                  state === "done"
                    ? "bg-accent-primary"
                    : state === "current"
                      ? "bg-accent-primary"
                      : "bg-border"
                }`}
              />
              <p
                className={`text-xs font-medium ${
                  state === "done"
                    ? "text-text-muted"
                    : state === "current"
                      ? "text-text-header"
                      : "text-text-muted"
                }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <div className="py-8" />
    </main>
  )
}
