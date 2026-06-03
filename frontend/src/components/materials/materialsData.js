const materialsData = [
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

    productSheet: {
      title: "PolyLite PLA Pro",
      shortName: "PLA Pro",
      type: "PLA professionnel",

      stockStatus:
        "Stock de départ conseillé",

      idealFor:
        "Prototypes, pièces propres, validation client",

      sellingPoint:
        "Matériau fiable, propre et polyvalent pour les pièces du quotidien.",

      limits:
        "Moins adapté aux fortes chaleurs et aux pièces exposées longtemps en extérieur.",

      printDifficulty: "Facile",

      nozzle:
        "Buse laiton standard",

      recommendedNozzle:
        "0.4 mm",

      bed:
        "Plateau chauffant recommandé",

      drying:
        "Séchage rarement nécessaire",

      priceLevel: "€",

      quoteText:
        "Recommandé pour une pièce esthétique, un prototype ou une validation de forme.",
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

    productSheet: {
      title: "PolyMax PLA",
      shortName: "PolyMax",
      type: "PLA renforcé",

      stockStatus:
        "Très recommandé",

      idealFor:
        "Supports, réparations, pièces fonctionnelles",

      sellingPoint:
        "Excellente résistance mécanique avec une impression simple.",

      limits:
        "Toujours sensible aux fortes températures.",

      printDifficulty: "Facile",

      nozzle:
        "Buse standard",

      recommendedNozzle:
        "0.4 mm",

      bed:
        "Plateau chauffant conseillé",

      drying:
        "Séchage rarement nécessaire",

      priceLevel: "€€",

      quoteText:
        "Excellent choix pour les pièces techniques du quotidien.",
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

    productSheet: {
      title: "PolyLite PETG",
      shortName: "PETG",
      type: "PETG technique",

      stockStatus:
        "Très important",

      idealFor:
        "Pièces atelier, humidité, pièces techniques",

      sellingPoint:
        "Très bon équilibre entre résistance, facilité et durabilité.",

      limits:
        "Moins rigide qu’un composite carbone.",

      printDifficulty: "Facile",

      nozzle:
        "Buse standard",

      recommendedNozzle:
        "0.4 mm",

      bed:
        "Plateau chauffant recommandé",

      drying:
        "Séchage conseillé",

      priceLevel: "€€",

      quoteText:
        "Très bon choix pour les pièces techniques et fonctionnelles.",
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

    productSheet: {
      title: "PolyLite ASA",
      shortName: "ASA",
      type: "ASA extérieur",

      stockStatus:
        "Très recommandé",

      idealFor:
        "Pièces extérieures, automobile, camping-car",

      sellingPoint:
        "Excellente tenue UV et chaleur pour usage extérieur.",

      limits:
        "Impression plus technique qu’un PLA.",

      printDifficulty: "Intermédiaire",

      nozzle:
        "Buse standard",

      recommendedNozzle:
        "0.4 mm",

      bed:
        "Plateau chauffant obligatoire",

      drying:
        "Séchage conseillé",

      priceLevel: "€€",

      quoteText:
        "Parfait pour les pièces exposées au soleil et aux intempéries.",
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

    productSheet: {
      title: "PolyFlex TPU95A",
      shortName: "TPU95A",
      type: "TPU flexible",

      stockStatus:
        "Très intéressant",

      idealFor:
        "Silentblocs, protections, amortisseurs",

      sellingPoint:
        "Très flexible et durable avec une excellente résistance à l’abrasion.",

      limits:
        "Impression plus lente et plus technique.",

      printDifficulty: "Intermédiaire",

      nozzle:
        "Buse standard",

      recommendedNozzle:
        "0.4 mm",

      bed:
        "Plateau chauffant recommandé",

      drying:
        "Séchage recommandé",

      priceLevel: "€€",

      quoteText:
        "Idéal pour les pièces souples et anti-vibration.",
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

    productSheet: {
      title: "PA612-CF",
      shortName: "PA612-CF",
      type: "Nylon carbone",

      stockStatus:
        "Premium technique",

      idealFor:
        "Pièces mécaniques haute performance",

      sellingPoint:
        "Rigidité et performances mécaniques très élevées.",

      limits:
        "Nécessite une impression technique et un séchage rigoureux.",

      printDifficulty: "Avancé",

      nozzle:
        "Buse acier trempé obligatoire",

      recommendedNozzle:
        "0.4 mm ou 0.6 mm",

      bed:
        "Plateau chauffant obligatoire",

      drying:
        "Séchage obligatoire",

      priceLevel: "€€€€",

      quoteText:
        "Solution hautes performances pour applications industrielles.",
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

    productSheet: {
      title: "PETG-CF",
      shortName: "PETG-CF",
      type: "PETG carbone",

      stockStatus:
        "Très recommandé",

      idealFor:
        "Pièces rigides premium et techniques",

      sellingPoint:
        "Très beau rendu carbone avec excellente rigidité.",

      limits:
        "Abrasif pour les buses standard.",

      printDifficulty: "Intermédiaire",

      nozzle:
        "Buse acier trempé recommandée",

      recommendedNozzle:
        "0.4 mm",

      bed:
        "Plateau chauffant recommandé",

      drying:
        "Séchage conseillé",

      priceLevel: "€€€",

      quoteText:
        "Excellent compromis entre esthétique carbone et performance.",
    },
  },
];

export default materialsData;