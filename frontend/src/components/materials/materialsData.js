export const materialsData = [
  {
    id: "pla-pro",
    category: "Standard",
    name: "PolyLite PLA Pro",
    brand: "Polymaker",

    colors: [
      "Noir",
      "Blanc",
      "Gris",
      "Orange",
    ],

    applications: [
      "Prototype",
      "Pièce visuelle",
      "Validation client",
      "Goodies",
    ],

    properties: [
      "Facile à imprimer",
      "Excellent rendu",
      "Bonne rigidité",
      "Faible retrait",
    ],

    description:
      "PLA professionnel polyvalent offrant une excellente qualité d’impression et un rendu premium.",

    resistance: {
    mechanical: 3,
    temperature: 2,
    uv: 2,
    flexibility: 1,
    finish: 5,
    },
  },

  {
    id: "polymax-pla",
    category: "Renforcé",
    name: "PolyMax PLA",
    brand: "Polymaker",

    colors: ["Noir", "Gris"],

    applications: [
      "Support technique",
      "Pièce fonctionnelle",
      "Réparation",
    ],

    properties: [
      "Très résistant",
      "Haute résistance impact",
      "Très polyvalent",
    ],

    description:
      "PLA renforcé conçu pour les pièces fonctionnelles nécessitant une excellente résistance mécanique.",

   resistance: {   
   mechanical: 4,
   temperature: 2,
   uv: 2,
   flexibility: 2,
   finish: 4,
  },
  },

  {
    id: "petg",
    category: "Technique",
    name: "PolyLite PETG",
    brand: "Polymaker",

    colors: [
      "Noir",
      "Gris",
      "Transparent",
    ],

    applications: [
      "Atelier",
      "Humidité",
      "Technique",
      "Usage quotidien",
    ],

    properties: [
      "Résistant",
      "Résiste à l’humidité",
      "Bonne tenue chimique",
    ],

    description:
      "Excellent compromis entre facilité d’impression et résistance mécanique.",

    resistance: {
    mechanical: 4,
    temperature: 3,
    uv: 3,
    flexibility: 2,
    finish: 4,
    },
  },

  {
    id: "asa",
    category: "Extérieur",
    name: "PolyLite ASA",
    brand: "Polymaker",

    colors: [
      "Noir",
      "Blanc",
      "Anthracite",
    ],

    applications: [
      "Extérieur",
      "Camping-car",
      "Automobile",
      "UV",
    ],

    properties: [
      "Résistant UV",
      "Résistant chaleur",
      "Très durable",
    ],

    description:
      "Matériau idéal pour les pièces exposées aux UV et aux conditions extérieures.",

    resistance: {
    mechanical: 4,
    temperature: 4,
    uv: 5,
    flexibility: 2,
    finish: 4,
    },
  },

  {
    id: "tpu95a",
    category: "Flexible",
    name: "PolyFlex TPU95A",
    brand: "Polymaker",

    colors: [
      "Noir",
      "Orange",
    ],

    applications: [
      "Silentbloc",
      "Protection",
      "Anti-vibration",
      "Souple",
    ],

    properties: [
      "Flexible",
      "Résistant abrasion",
      "Très durable",
    ],

    description:
      "TPU professionnel flexible pour les pièces nécessitant amortissement et souplesse.",

    resistance: {
    mechanical: 3,
    temperature: 3,
    uv: 3,
    flexibility: 5,
    finish: 3,
    },
  },

  {
    id: "pa612-cf",
    category: "Industrie",
    name: "PA612-CF",
    brand: "Polymaker",

    colors: ["Noir Carbone"],

    applications: [
      "Mécanique",
      "Industriel",
      "Pièce haute performance",
    ],

    properties: [
      "Fibre carbone",
      "Très rigide",
      "Très haute résistance",
    ],

    description:
      "Nylon renforcé carbone destiné aux applications mécaniques et industrielles avancées.",

    resistance: {
    mechanical: 5,
    temperature: 5,
    uv: 4,
    flexibility: 2,
    finish: 5,
    },
  },

  {
    id: "petg-cf",
    category: "Composite",
    name: "PETG-CF",
    brand: "Polymaker",

    colors: ["Noir Carbone"],

    applications: [
      "Technique",
      "Rigidité",
      "Pièce premium",
    ],

    properties: [
      "Aspect carbone",
      "Rigidité renforcée",
      "Très bon rendu",
    ],

    description:
      "PETG renforcé fibre carbone offrant un excellent compromis technique et esthétique.",

    resistance: {
    mechanical: 5,
    temperature: 4,
    uv: 4,
    flexibility: 1,
    finish: 5,
    },
  },
];

export default materialsData;