import type { Category, ConversationBias, Tone } from "./types";

export type AppAction =
  | { type: "SET_MODE"; mode: "home" | "trivia-setup" | "trivia-question" | "conversation" }
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "INCREMENT_SCORE"; id: string; amount?: number }
  | { type: "RESET_SCORES" }
  | { type: "START_TRIVIA_ROUND" }
  | { type: "CHOOSE_TRIVIA_CATEGORY"; category: Category }
  | { type: "SHUFFLE_TRIVIA_OPTIONS" }
  | { type: "REVEAL_ANSWER" }
  | { type: "CHANGE_QUESTION" }
  | { type: "NEXT_PROMPT"; bias?: ConversationBias }
  | { type: "RESET_CONVERSATION_SESSION" }
  | { type: "SET_MODE_FILTER"; tones?: Tone[] }
  | { type: "SET_BIAS"; bias?: ConversationBias };
