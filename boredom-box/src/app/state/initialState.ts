import type {
  AppState,
  ConversationSession,
  Player,
  SeenRecord,
  TriviaSession,
} from "./types";

export const createDefaultPlayers = (): Player[] => [
  { id: "player-ahan", name: "Ahan", score: 0 },
  { id: "player-sehr", name: "Sehr", score: 0 },
];

export const createInitialTriviaSession = (): TriviaSession => ({
  category: undefined,
  activeQuestion: undefined,
  questionState: "idle",
  chooserIndex: 0,
  optionCategories: [],
  round: 0,
});

export const createInitialConversationSession = (): ConversationSession => ({
  activePrompt: undefined,
  lastTone: undefined,
  modeFilter: undefined,
  bias: "none",
});

export const createInitialState = (
  players: Player[] = createDefaultPlayers(),
  seenQuestions: SeenRecord = {},
  seenPrompts: SeenRecord = {},
  lifetimeScores: Record<string, number> = {},
): AppState => ({
  mode: "home",
  players,
  triviaSession: createInitialTriviaSession(),
  conversationSession: createInitialConversationSession(),
  seenQuestions,
  seenPrompts,
  lifetimeScores,
});
