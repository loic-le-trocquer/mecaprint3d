export const materialsData = [
  {
    id: "pla",
    name: "PLA",
    family: "FDM",
    shortDescription:
      "Matière simple, économique et adaptée aux prototypes, maquettes et pièces décoratives.",
    resistance: 2,
    temperature: 1,
    uv: 1,
    flexibility: 1,
    finish: 4,
    bestFor: "Prototype / décoration",
    advantages: [
      "Facile à imprimer",
      "Bon rendu visuel",
      "Économique",
    ],
    limits: [
      "Faible tenue en température",
      "Usage extérieur limité",
    ],
    applications: [
      "Prototype",
      "Maquette",
      "Objet décoratif",
    ],
    finishing: [
      "Ponçage",
      "Peinture",
    ],
  },

  {
    id: "petg",
    name: "PETG",
    family: "FDM",
    shortDescription:
      "Bon compromis entre résistance mécanique et facilité d’impression.",
    resistance: 4,
    temperature: 3,
    uv: 3,
    flexibility: 2,
    finish: 3,
    bestFor: "Pièce fonctionnelle",
    advantages: [
      "Bonne résistance",
      "Bonne tenue à l’humidité",
      "Polyvalent",
    ],
    limits: [
      "Moins rigide que le PLA",
    ],
    applications: [
      "Réparation",
      "Support technique",
      "Pièce utile",
    ],
    finishing: [
      "Ébavurage",
      "Peinture",
    ],
  },

  {
    id: "asa",
    name: "ASA",
    family: "FDM",
    shortDescription:
      "Matière technique adaptée aux pièces extérieures et automobile.",
    resistance: 4,
    temperature: 4,
    uv: 5,
    flexibility: 2,
    finish: 3,
    bestFor: "Extérieur / automobile",
    advantages: [
      "Très bonne tenue UV",
      "Bonne tenue température",
    ],
    limits: [
      "Impression plus technique",
    ],
    applications: [
      "Automobile",
      "Extérieur",
      "Restauration",
    ],
    finishing: [
      "Ponçage",
      "Peinture",
    ],
  },

  {
    id: "tpu",
    name: "TPU",
    family: "FDM",
    shortDescription:
      "Matière flexible pour protections, joints et amortissement.",
    resistance: 3,
    temperature: 3,
    uv: 3,
    flexibility: 5,
    finish: 2,
    bestFor: "Pièce flexible",
    advantages: [
      "Très souple",
      "Résistant aux chocs",
    ],
    limits: [
      "Impression plus lente",
    ],
    applications: [
      "Joint",
      "Protection",
      "Silentbloc",
    ],
    finishing: [
      "Ébavurage",
    ],
  },

  {
    id: "pa12",
    name: "PA12",
    family: "SLS",
    shortDescription:
      "Nylon technique utilisé en frittage poudre pour pièces complexes.",
    resistance: 5,
    temperature: 4,
    uv: 4,
    flexibility: 3,
    finish: 4,
    bestFor: "Pièce technique",
    advantages: [
      "Très bonne résistance",
      "Géométries complexes",
    ],
    limits: [
      "Fabrication partenaire",
    ],
    applications: [
      "Mécanique",
      "Petite série",
    ],
    finishing: [
      "Microbillage",
      "Teinture",
    ],
  },
];