export type KnowledgeDomain = "Économie" | "Droit français";

export type QuizCard = {
  id: string;
  domain: KnowledgeDomain;
  prompt: string;
  answerIsTrue: boolean;
  explanation: string;
  spiceLine?: string;
  difficulty: "facile" | "moyen" | "costaud";
};

const BASE_CARDS: QuizCard[] = [
  {
    id: "econ-bce-inflation-target",
    domain: "Économie",
    prompt:
      "La Banque centrale européenne vise une inflation « proche mais inférieure à 2 % » à moyen terme.",
    answerIsTrue: true,
    explanation:
      "Depuis 2003, la BCE vise un taux d'inflation de 2 % approximativement, objectif réaffirmé en 2021 pour assurer la stabilité des prix.",
    spiceLine: "Lagarde ne fait pas tourner la planche à billets au hasard.",
    difficulty: "facile",
  },
  {
    id: "econ-gdp-real",
    domain: "Économie",
    prompt:
      "Le PIB nominal d’un pays est déjà corrigé de l’inflation, contrairement au PIB réel.",
    answerIsTrue: false,
    explanation:
      "C’est l’inverse : le PIB réel est ajusté de l’inflation, le PIB nominal reste au prix courant. Gare aux cousins économistes qui confondent.",
    spiceLine: "Le nominal aime bien les chiffres gonflés.",
    difficulty: "moyen",
  },
  {
    id: "econ-fiscal-multiplicateur",
    domain: "Économie",
    prompt:
      "Un multiplicateur budgétaire supérieur à 1 signifie qu’un euro de dépense publique génère plus d’un euro de PIB.",
    answerIsTrue: true,
    explanation:
      "Le multiplicateur budgétaire mesure l’effet d’une dépense publique sur l’activité. S'il est > 1, l’effet amplifie l’impulsion budgétaire.",
    spiceLine:
      "Magie keynésienne : un euro public peut avoir des petits frères.",
    difficulty: "moyen",
  },
  {
    id: "econ-oat",
    domain: "Économie",
    prompt:
      "Les obligations d’État françaises à 10 ans sont aussi connues sous le nom d’OAT.",
    answerIsTrue: true,
    explanation:
      "Les Obligations Assimilables du Trésor (OAT) sont l’instrument de dette à moyen-long terme le plus courant pour financer l’État français.",
    spiceLine: "Les financiers prononcent « O-A-T » mais pensent « baguette ».",
    difficulty: "facile",
  },
  {
    id: "econ-triple-deficit",
    domain: "Économie",
    prompt:
      "Un pays peut afficher simultanément un déficit public, un déficit commercial et un déficit d’épargne privée : c’est le « triple déficit ».",
    answerIsTrue: true,
    explanation:
      "On parle de triple déficit quand les trois grands soldes macroéconomiques sont négatifs, souvent signe d’un déséquilibre global.",
    spiceLine: "Un triple combo que même Street Fighter trouverait violent.",
    difficulty: "costaud",
  },
  {
    id: "econ-quantitative-tightening",
    domain: "Économie",
    prompt:
      "Le « quantitative tightening » consiste à racheter massivement des actifs pour soutenir le crédit.",
    answerIsTrue: false,
    explanation:
      "C’est l’inverse : le quantitative tightening réduit le bilan d’une banque centrale en laissant expirer (ou vendre) des titres, retirant ainsi de la liquidité.",
    spiceLine: "C’est la cure detox après les orgies de liquidités.",
    difficulty: "moyen",
  },
  {
    id: "law-cdi-trial",
    domain: "Droit français",
    prompt:
      "En France, la période d’essai d’un CDI peut être renouvelée si et seulement si un accord de branche le prévoit.",
    answerIsTrue: true,
    explanation:
      "Le Code du travail n’autorise le renouvellement que si un accord de branche le permet et si cette possibilité est prévue dans le contrat.",
    spiceLine:
      "Pas d’accord de branche, pas de joker : c’est écrit noir sur blanc.",
    difficulty: "moyen",
  },
  {
    id: "law-smic-date",
    domain: "Droit français",
    prompt:
      "Le SMIC est réévalué automatiquement chaque 1er janvier, sans possibilité de revalorisation en cours d’année.",
    answerIsTrue: false,
    explanation:
      "Il est revalorisé au 1er janvier, mais des hausses automatiques surviennent aussi si l’inflation dépasse 2 % ou sur décision gouvernementale.",
    spiceLine:
      "Quand les prix flambent, le SMIC reçoit parfois un rappel surprise.",
    difficulty: "facile",
  },
  {
    id: "law-cdd-prime",
    domain: "Droit français",
    prompt:
      "Les CDD ouvrent droit à une prime de précarité de 10 % sauf exceptions, comme la signature d’un CDI à la suite du contrat.",
    answerIsTrue: true,
    explanation:
      "La prime est due pour compenser la précarité, sauf cas listés par le Code du travail (rupture anticipée pour faute grave, CDI proposé, etc.).",
    spiceLine: "Le bonus de fin de CDD n’est pas une rumeur TikTok.",
    difficulty: "facile",
  },
  {
    id: "law-cse-obligation",
    domain: "Droit français",
    prompt:
      "La mise en place d’un CSE devient obligatoire à partir de 50 salariés en France.",
    answerIsTrue: true,
    explanation:
      "Le Comité Social et Économique est obligatoire dès 11 salariés, mais ses attributions complètes apparaissent à 50 salariés.",
    spiceLine: "À 11 déjà, mais à 50 ça devient une vraie tournée de réunions.",
    difficulty: "facile",
  },
  {
    id: "law-code-civil-1103",
    domain: "Droit français",
    prompt:
      "L’article 1103 du Code civil dispose que « les conventions légalement formées tiennent lieu de loi à ceux qui les ont faites ».",
    answerIsTrue: true,
    explanation:
      "C’est le principe de force obligatoire du contrat, pilier du droit des obligations réaffirmé lors de la réforme de 2016.",
    spiceLine: "Un contrat, ce n’est pas juste un PDF qui prend la poussière.",
    difficulty: "moyen",
  },
  {
    id: "law-amende-contravention-1",
    domain: "Droit français",
    prompt:
      "Une contravention de 1re classe peut entraîner jusqu’à 750 € d’amende pour une personne physique.",
    answerIsTrue: false,
    explanation:
      "Le plafond est de 38 € pour une contravention de 1re classe ; 750 € correspond au maximum pour la 5e classe.",
    spiceLine:
      "On garde les 750 € pour les grosses bêtises, pas pour un ticket perdu.",
    difficulty: "facile",
  },
];

export function buildQuizDeck(): QuizCard[] {
  const deck = BASE_CARDS.map((card) => ({ ...card }));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck;
}

export function countByDomain(
  cards: QuizCard[],
): Record<KnowledgeDomain, number> {
  return cards.reduce(
    (acc, card) => {
      acc[card.domain] += 1;
      return acc;
    },
    {
      Économie: 0,
      "Droit français": 0,
    } as Record<KnowledgeDomain, number>,
  );
}
