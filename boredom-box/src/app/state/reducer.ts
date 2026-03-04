import {
  pickCategoryOptions,
  pickConversationPrompt,
  pickQuestion,
  triviaQuestions,
  remainingQuestionsCount,
} from "./engine";
import type {
  AppState,
  Category,
  ConversationSession,
  Player,
  SeenRecord,
  TriviaSession,
} from "./types";
import type { AppAction } from "./actions";
import { createInitialConversationSession } from "./initialState";

const clampIndex = (idx: number, players: Player[]): number => {
  if (players.length === 0) return 0;
  return ((idx % players.length) + players.length) % players.length;
};

const clearCategorySeen = (category: Category | undefined, seen: SeenRecord): SeenRecord => {
  if (!category) return seen;
  const next = { ...seen };
  triviaQuestions
    .filter((q) => q.category === category)
    .forEach((q) => {
      delete next[q.id];
    });
  return next;
};

const updateTriviaSession = (
  session: TriviaSession,
  updates: Partial<TriviaSession>,
): TriviaSession => ({ ...session, ...updates });

const updateConversationSession = (
  session: ConversationSession,
  updates: Partial<ConversationSession>,
): ConversationSession => ({ ...session, ...updates });

export const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };

    case "ADD_PLAYER": {
      const name = action.name.trim();
      if (!name) return state;
      const newPlayer: Player = {
        id: `player-${crypto.randomUUID?.() ?? Date.now()}`,
        name,
        score: 0,
      };
      return {
        ...state,
        players: [...state.players, newPlayer],
        lifetimeScores: {
          ...state.lifetimeScores,
          [newPlayer.id]: state.lifetimeScores[newPlayer.id] ?? 0,
        },
        triviaSession: updateTriviaSession(state.triviaSession, {
          chooserIndex: clampIndex(
            state.triviaSession.chooserIndex,
            [...state.players, newPlayer],
          ),
        }),
      };
    }

    case "REMOVE_PLAYER": {
      if (state.players.length <= 1) return state;
      const players = state.players.filter((p) => p.id !== action.id);
      return {
        ...state,
        players,
        lifetimeScores: Object.fromEntries(
          Object.entries(state.lifetimeScores).filter(([id]) => id !== action.id),
        ),
        triviaSession: updateTriviaSession(state.triviaSession, {
          chooserIndex: clampIndex(state.triviaSession.chooserIndex, players),
        }),
      };
    }

    case "RENAME_PLAYER": {
      const name = action.name.trim();
      if (!name) return state;
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, name } : p,
        ),
      };
    }

    case "INCREMENT_SCORE": {
      const amount = action.amount ?? 1;
      const lifetime = {
        ...state.lifetimeScores,
        [action.id]: (state.lifetimeScores[action.id] ?? 0) + amount,
      };
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, score: p.score + amount } : p,
        ),
        lifetimeScores: lifetime,
      };
    }

    case "RESET_SCORES": {
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, score: 0 })),
      };
    }

    case "START_TRIVIA_ROUND": {
      const nextChooser =
        state.triviaSession.round === 0
          ? 0
          : clampIndex(state.triviaSession.chooserIndex + 1, state.players);
      const optionCategories = pickCategoryOptions(state.seenQuestions);
      return {
        ...state,
        mode: "trivia-question",
        triviaSession: updateTriviaSession(state.triviaSession, {
          chooserIndex: nextChooser,
          optionCategories,
          category: undefined,
          activeQuestion: undefined,
          questionState: "idle",
          round: state.triviaSession.round + 1,
        }),
      };
    }

    case "CHOOSE_TRIVIA_CATEGORY": {
      const category: Category = action.category;
      let seenPool = state.seenQuestions;
      const remaining = remainingQuestionsCount(category, state.seenQuestions);
      if (remaining === 0) {
        seenPool = clearCategorySeen(category, state.seenQuestions);
      }
      const question = pickQuestion(category, seenPool);
      const seenUpdate =
        question && !seenPool[question.id]
          ? { ...seenPool, [question.id]: true }
          : seenPool;
      return {
        ...state,
        seenQuestions: seenUpdate,
        triviaSession: updateTriviaSession(state.triviaSession, {
          category,
          activeQuestion: question,
          questionState: "idle",
        }),
      };
    }

    case "SHUFFLE_TRIVIA_OPTIONS": {
      const optionCategories = pickCategoryOptions(state.seenQuestions);
      return {
        ...state,
        triviaSession: updateTriviaSession(state.triviaSession, {
          optionCategories,
          category: undefined,
          activeQuestion: undefined,
          questionState: "idle",
        }),
      };
    }

    case "REVEAL_ANSWER": {
      const { activeQuestion } = state.triviaSession;
      if (!activeQuestion) return state;
      const seen: SeenRecord = {
        ...state.seenQuestions,
        [activeQuestion.id]: true,
      };
      return {
        ...state,
        seenQuestions: seen,
        triviaSession: updateTriviaSession(state.triviaSession, {
          questionState: "revealed",
        }),
      };
    }

    case "CHANGE_QUESTION": {
      const category = state.triviaSession.category;
      let seenPool = state.seenQuestions;
      if (remainingQuestionsCount(category, state.seenQuestions) === 0) {
        seenPool = clearCategorySeen(category, state.seenQuestions);
      }
      const nextQuestion = pickQuestion(category, seenPool);
      const seenUpdate =
        nextQuestion && !seenPool[nextQuestion.id]
          ? { ...seenPool, [nextQuestion.id]: true }
          : seenPool;
      return {
        ...state,
        seenQuestions: seenUpdate,
        triviaSession: updateTriviaSession(state.triviaSession, {
          activeQuestion: nextQuestion,
          questionState: "idle",
        }),
      };
    }

    case "NEXT_PROMPT": {
      const previousBias = state.conversationSession.bias;
      const biasInput = action.bias ?? previousBias;
      const bias = biasInput && biasInput !== "none" ? biasInput : undefined;
      const biasLevels = { ...state.conversationSession.biasLevels };

      // If user switches to a different bias, restart its level progression from 1
      if (bias && bias !== previousBias) {
        biasLevels[bias] = 1;
      }

      const targetLevel = bias ? biasLevels[bias] ?? 1 : undefined;
      const next = pickConversationPrompt({
        seenPrompts: {},
        bias,
        targetLevel,
      });
      if (bias && next) {
        biasLevels[bias] = Math.min((biasLevels[bias] ?? 1) + 1, 3);
      }
      return {
        ...state,
        seenPrompts: state.seenPrompts, // preserved but not updated
        conversationSession: updateConversationSession(
          state.conversationSession,
          {
            activePrompt: next,
            bias,
            biasLevels,
          },
        ),
      };
    }

    case "SET_BIAS": {
      return {
        ...state,
        conversationSession: updateConversationSession(
          state.conversationSession,
          {
            bias: action.bias,
          },
        ),
      };
    }

    case "RESET_CONVERSATION_SESSION": {
      return {
        ...state,
        seenPrompts: {},
        conversationSession: {
          ...createInitialConversationSession(),
        },
      };
    }

    default:
      return state;
  }
};
