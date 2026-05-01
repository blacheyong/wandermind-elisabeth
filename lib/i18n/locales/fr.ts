const fr = {
  onboarding: {
    progress: {
      step1: "01 — Profil",
      step2: "02 — Préférences",
      step3: "03 — Le voyage",
      step4: "04 — Récapitulatif",
    },
    tripContext: {
      heading: "Votre voyage",
      nameLabel: "Nom du voyage",
      namePlaceholder: "Ex. : Lisbonne à la fin de l’été",
      nameHelp:
        "Créez le premier voyage que WanderMind préparera à partir de votre profil.",
      travellersLabel: "Qui voyage ?",
      destinationLabel: "Destination",
      destinationKnown: "Je sais où",
      destinationSuggest: "Suggérez-moi",
      destinationRandomize: "Suggérer une autre destination",
      destinationSuggestions: [
        "Paris, France",
        "Madrid, Espagne",
        "Tokyo, Japon",
        "Rome, Italie",
        "Milan, Italie",
        "Bangkok, Thaïlande",
        "Londres, Royaume-Uni",
        "Hong Kong",
        "Lisbonne, Portugal",
        "New York, États-Unis",
      ],
      datesLabel: "Dates",
      datesToggleExact: "Dates précises",
      datesToggleFlex: "Saison et durée",
      budgetLabel: "Budget quotidien (CAD)",
      budgetStrict: "Strict",
      budgetFlex: "Souple",
      budgetSaveOn: "Où économiser ?",
      budgetSplurgeOn: "Où dépenser plus ?",
      reasonLabel: "Occasion",
      alreadyBooked: "Déjà réservé ?",
      mustSee: "Incontournables ?",
      addAdult: "+ Adulte",
      addPartner: "+ Partenaire",
      addChild: "+ Enfant",
      addPet: "+ Animal",
      childAge: "Âge",
      removeLabel: "Retirer",
      bookedPlaceholder: "Ex. : vol Montréal–Lisbonne le 15 août",
      mustSeePlaceholder: "Ex. : Musée des Azulejos",
      reasons: {
        leisure: "Vacances",
        anniversary: "Anniversaire",
        family_visit: "Visite en famille",
        work_plus: "Travail + tourisme",
        first_time: "Première fois",
        return: "Retour",
        celebration: "Célébration",
      },
      seasons: {
        spring: "Printemps",
        summer: "Été",
        autumn: "Automne",
        winter: "Hiver",
      },
      budgetCategories: {
        food: "Nourriture",
        stay: "Hébergement",
        experiences: "Activités",
        transport: "Transport",
      },
    },
    tradeoffs: {
      heading: "Vos préférences",
      subheading:
        "Quand les choix s'opposent, qu'est-ce qui prime ?", // TODO: review with native speaker
      adjustLater:
        "Vous pourrez modifier ces préférences plus tard.",
      pace: {
        label: "Rythme",
        left: "Moins, plus profond",
        right: "Voir plus, plus vite",
      },
      discovery: {
        label: "Découverte",
        left: "Incontournables",
        right: "Hors des sentiers battus",
      },
      movement: {
        label: "Mouvement",
        left: "Marcher dans les quartiers",
        right: "Minimiser les transferts",
      },
      spending: {
        label: "Dépenses",
        left: "Économiser quand possible",
        right: "Payer pour la facilité",
      },
      planning: {
        label: "Planification",
        left: "Journée structurée",
        right: "Après-midis libres",
      },
      lodging: {
        label: "Hébergement",
        left: "Emplacement central",
        right: "Meilleur établissement",
      },
      food: {
        label: "Restauration",
        left: "Réservations planifiées",
        right: "Découverte spontanée",
      },
    },
    constraints: {
      heading: "Vos non-négociables",
      respectHeading: "Choses à respecter",
      avoidHeading: "À éviter activement",
      avoidPlaceholder:
        'Ex. : foules, musées, boîtes de nuit, longues marches', // TODO: review with native speaker
      densityHeading: "Densité quotidienne",
      densityQuestion:
        "Combien de choses peuvent tenir dans une journée avant que ça cesse d'être agréable ?", // TODO: review with native speaker
      density1: "Une chose principale",
      density2: "Deux activités",
      density3: "Trois ou plus",
      densityFlex: "Selon la journée",
      morningLabel: "Départs",
      morningEarly: "Matinaux",
      morningLeisurely: "Tranquilles",
      morningLate: "Tardifs",
      walkingLabel: "Marche",
      walkingLow: "Minimale",
      walkingMedium: "Modérée",
      walkingHigh: "Élevée",
      downtimeLabel: "Temps libre quotidien requis",
      nuanceHeading: "Autre chose ?",
      nuancePlaceholder: "Ex. : je déteste me sentir pressé",
      otherInput: "Précisez…",
      accessibility: {
        wheelchair: "Fauteuil roulant",
        limitedWalking: "Marche limitée",
        hearing: "Audition",
        vision: "Vision",
        none: "Aucune",
      },
      dietary: {
        vegetarian: "Végétarien",
        vegan: "Végétalien",
        halal: "Halal",
        kosher: "Casher",
        celiac: "Cœliaque",
        nutAllergy: "Allergie noix",
        shellfishAllergy: "Allergie crustacés",
        lactoseFree: "Sans lactose",
        other: "Autre",
      },
      languages: {
        french: "Français",
        english: "Anglais",
        spanish: "Espagnol",
        italian: "Italien",
        portuguese: "Portugais",
        german: "Allemand",
        other: "Autre",
      },
      avoidSuggestions: [
        "Foules", "Hauteurs", "Musées", "Boîtes de nuit",
        "Plages", "Longues marches", "Départs matinaux",
        "Sorties tardives", "Chaînes de restaurants", "Visites guidées",
      ],
    },
    review: {
      heading: "Votre profil",
      subheading: "Voici ce que nous avons compris.",
      editPrompt:
        "Modifiez ce qui ne reflète pas votre voyage.",
      contradictionWarning:
        "Certains de vos choix semblent contradictoires.",
      sections: {
        tripName: "Voyage",
        whoWhere: "Qui & où",
        budgetReason: "Budget & raison",
        nonNegotiables: "Non-négociables",
        pace: "Rythme",
        preferences: "Préférences fortes",
        nuance: "Nuance",
      },
    },
  },

  actions: {
    continue: "Continuer",
    back: "Retour",
    edit: "Modifier",
    generate: "Générer mon itinéraire",
    generateFor: (destination: string) =>
      `Générer mon itinéraire pour ${destination}`,
    editAnswers: "Modifier mes réponses",
    retry: "Réessayer",
  },

  itinerary: {
    loading: (destination: string) =>
      `Conception de votre séjour à ${destination}…`,
    whyThisFits: "Pourquoi ça vous correspond",
    seeWhy: "Voir pourquoi ce voyage vous correspond",
    openDay: "Journée libre",
    profile: "Votre profil de voyageur",
    promptUsed: "Instructions transmises",
  },

  diff: {
    heading: "Test de différenciation",
    subheading:
      "Choisissez deux profils et une destination. Nous générons les deux itinéraires côte à côte.",
    pitch:
      "La plupart des outils de voyage IA collectent beaucoup de préférences et produisent des itinéraires similaires. La thèse de WanderMind : la différenciation visible est la seule position défendable. Cette page est le test.",
    profileA: "Profil A",
    profileB: "Profil B",
    destination: "Destination",
    tripLength: "Durée (jours)",
    generate: "Générer les deux",
    differences: "Différences observables",
  },

  lang: {
    toggle: "EN",
    current: "FR",
  },
};

export type Dictionary = typeof fr;
export default fr;
