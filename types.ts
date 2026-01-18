export enum SubjectType {
  HISTORY = 'Histoire',
  GEOGRAPHY = 'Géographie',
  EMC = 'EMC'
}

export enum Level {
  SIXIEME = '6ème',
  CINQUIEME = '5ème',
  QUATRIEME = '4ème',
  TROISIEME = '3ème',
  SECONDE = '2nde',
  PREMIERE = '1ère',
  TERMINALE = 'Terminale'
}

export interface LexiconItem {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  subject: SubjectType;
  level: Level;
  content: string; // Markdown supported
  lexicon: LexiconItem[];
  quiz?: QuizQuestion[];
  xpReward: number;
}

export interface Homework {
  id: string;
  subject: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  email?: string;
  grade: Level; // School grade (6eme - Terminale)
  xp: number;
  level: number; // Player/Game level
  badges: string[];
  completedChapters: string[];
  dyslexiaMode: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isImage?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
