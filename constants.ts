import { Badge, Chapter, Level, SubjectType } from './types';

export const BADGES: Badge[] = [
  { id: '1', name: 'Historien Novice', description: 'Terminer 1 chapitre d\'Histoire', icon: '📜', color: 'bg-red-100 text-red-700' },
  { id: '2', name: 'Cartographe en chef', description: 'Obtenir 100% à un quiz de Géo', icon: '🌍', color: 'bg-blue-100 text-blue-700' },
  { id: '3', name: 'Citoyen Engagé', description: 'Participer à 3 débats EMC avec l\'IA', icon: '⚖️', color: 'bg-green-100 text-green-700' },
];

export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 'h-6-1',
    title: 'Les débuts de l\'humanité',
    subject: SubjectType.HISTORY,
    level: Level.SIXIEME,
    xpReward: 100,
    content: `
# Les débuts de l'humanité

## 1. L'apparition des premiers humains
L'histoire de l'humanité commence en Afrique. Les premiers hominidés apparaissent il y a environ 7 millions d'années. Le genre *Homo* apparaît vers 2,5 millions d'années.

## 2. La "Révolution" Néolithique
Vers 10 000 avant J.-C., les humains commencent à pratiquer l'agriculture et l'élevage. Ils se sédentarisent. C'est un changement majeur dans le mode de vie.

### Points clés :
*   **Paléolithique** : Âge de la pierre taillée (chasseurs-cueilleurs).
*   **Néolithique** : Âge de la pierre polie (agriculteurs-éleveurs).
    `,
    lexicon: [
      { term: 'Hominidé', definition: 'Famille de grands primates dont fait partie l\'Homme.' },
      { term: 'Sédentaire', definition: 'Qui a un habitat fixe (contraire de nomade).' },
      { term: 'Archéologie', definition: 'Science qui étudie les traces du passé.' }
    ],
    quiz: [
        {
            id: 'q1',
            question: "Sur quel continent sont apparus les premiers hominidés ?",
            options: ["Europe", "Asie", "Afrique", "Amérique"],
            correctAnswerIndex: 2,
            explanation: "L'Afrique est le berceau de l'humanité, où les plus anciens fossiles d'hominidés ont été retrouvés."
        },
        {
            id: 'q2',
            question: "Que signifie 'Néolithique' ?",
            options: ["Âge de la pierre taillée", "Âge de la pierre polie", "Âge des métaux", "Âge du feu"],
            correctAnswerIndex: 1,
            explanation: "Le Néolithique est l'âge de la pierre polie, marquant le début de l'agriculture et de la sédentarisation."
        },
        {
            id: 'q3',
            question: "Quelle activité caractérise le mode de vie au Paléolithique ?",
            options: ["Agriculture", "Élevage", "Chasse et cueillette", "Commerce maritime"],
            correctAnswerIndex: 2,
            explanation: "Au Paléolithique, les humains étaient des nomades vivant de la chasse, de la pêche et de la cueillette."
        }
    ]
  },
  {
    id: 'g-term-1',
    title: 'Mers et océans : vecteurs de la mondialisation',
    subject: SubjectType.GEOGRAPHY,
    level: Level.TERMINALE,
    xpReward: 150,
    content: `
# Les espaces maritimes : au cœur de la mondialisation

## 1. Des espaces d'échanges majeurs
80% du commerce mondial de marchandises s'effectue par voie maritime. Les routes maritimes relient les pôles de la "Triade" (Amérique du Nord, Europe, Asie orientale).

## 2. Des ressources convoitées
Les océans regorgent de ressources :
*   Halieutiques (pêche)
*   Énergétiques (hydrocarbures offshore, éolien)
*   Minérales

## 3. La maritimisation
Ce processus désigne l'accroissement des échanges par voie maritime et la concentration des activités sur les littoraux.
    `,
    lexicon: [
      { term: 'Mondialisation', definition: 'Processus de mise en relation des différentes parties du monde par les flux.' },
      { term: 'Maritimisation', definition: 'Dépendance croissante des économies envers la mer.' },
      { term: 'ZEE', definition: 'Zone Économique Exclusive (200 milles marins).' }
    ],
    quiz: [
        {
            id: 'q1',
            question: "Quel pourcentage du commerce mondial s'effectue par voie maritime ?",
            options: ["50%", "60%", "80%", "95%"],
            correctAnswerIndex: 2,
            explanation: "Environ 80% des échanges commerciaux mondiaux en volume passent par la mer."
        },
        {
            id: 'q2',
            question: "Qu'est-ce que la ZEE ?",
            options: ["Zone Économique Européenne", "Zone Économique Exclusive", "Zone d'Échange Extérieur", "Zone Écologique Estuaire"],
            correctAnswerIndex: 1,
            explanation: "La Zone Économique Exclusive s'étend jusqu'à 200 milles marins des côtes; l'État y a la souveraineté sur les ressources."
        }
    ]
  },
  {
    id: 'e-2-1',
    title: 'La Laïcité en France',
    subject: SubjectType.EMC,
    level: Level.SECONDE,
    xpReward: 120,
    content: `
# La Laïcité : principe républicain

## 1. Définition
La laïcité garantit la liberté de conscience. Elle impose la neutralité de l'État vis-à-vis des religions.

## 2. La loi de 1905
La loi de séparation des Églises et de l'État est le pilier de la laïcité française. "La République ne reconnaît, ne salarie ni ne subventionne aucun culte."
    `,
    lexicon: [
      { term: 'Laïcité', definition: 'Principe de séparation de la société civile et de la société religieuse.' },
      { term: 'Liberté de conscience', definition: 'Droit de croire ou de ne pas croire.' }
    ],
    quiz: [
        {
            id: 'q1',
            question: "En quelle année a été votée la loi de séparation des Églises et de l'État ?",
            options: ["1789", "1882", "1905", "1958"],
            correctAnswerIndex: 2,
            explanation: "La loi du 9 décembre 1905 est le texte fondateur de la laïcité en France."
        },
        {
            id: 'q2',
            question: "Que garantit la laïcité ?",
            options: ["L'interdiction des religions", "La liberté de conscience", "L'obligation de croire", "La suppression des lieux de culte"],
            correctAnswerIndex: 1,
            explanation: "La laïcité garantit à chacun la liberté de croire ou de ne pas croire, tant que l'ordre public est respecté."
        }
    ]
  }
];

export const SUBJECT_COLORS = {
  [SubjectType.HISTORY]: 'text-history border-history',
  [SubjectType.GEOGRAPHY]: 'text-geo border-geo',
  [SubjectType.EMC]: 'text-emc border-emc',
};

export const SUBJECT_BG = {
  [SubjectType.HISTORY]: 'bg-history',
  [SubjectType.GEOGRAPHY]: 'bg-geo',
  [SubjectType.EMC]: 'bg-emc',
};
