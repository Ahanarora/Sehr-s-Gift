export type Mode =
  | "home"
  | "trivia-setup"
  | "trivia-category"
  | "trivia-question"
  | "welcome"
  | "conversation";

export type Category = string;

export type TriviaFormat = "open-ended" | "multiple-choice" | "list";

export interface Question {
  id: string;
  category: Category;
  format: TriviaFormat;
  prompt: string;
  answer?: string;
  answers?: string[];
  allRequired?: boolean;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard" | string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface TriviaSession {
  category?: Category;
  activeQuestion?: Question;
  questionState: "idle" | "revealed";
  chooserIndex: number; // rotating selector who picks the category pair
  optionCategories: Category[]; // two options for the chooser each round
  round: number;
}

export type Tone =
  | "light"
  | "fun"
  | "deep"
  | "values"
  | "life"
  | "future"
  | "relationship"
  | "spicy";

export type ConversationBias = "lighter" | "deeper" | "spicier" | "none";

export interface ConversationPrompt {
  id: string;
  tone: Tone;
  text: string;
  level?: number;
  bias?: ConversationBias;
}

export interface ConversationSession {
  activePrompt?: ConversationPrompt;
  bias?: ConversationBias;
  biasLevels: Record<ConversationBias, number>;
}

export interface AppState {
  mode: Mode;
  players: Player[];
  triviaSession: TriviaSession;
  conversationSession: ConversationSession;
  seenQuestions: Record<string, boolean>;
  seenPrompts: Record<string, boolean>;
  lifetimeScores: Record<string, number>;
}

export type SeenRecord = Record<string, boolean>;
