import type { AppState } from "./types";

export const seenTriviaCount = (state: AppState): number =>
  Object.keys(state.seenQuestions).length;

export const seenPromptCount = (state: AppState): number =>
  Object.keys(state.seenPrompts).length;
