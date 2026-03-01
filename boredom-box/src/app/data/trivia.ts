import triviaFull from "../../../questions/trivia_full_v1.json" assert { type: "json" };
import type { Category, Question } from "../state/types";

// Note: the JSON file must conform to the Question schema (see types.ts).
export const triviaQuestions: Question[] = triviaFull as Question[];

export const triviaCategories: Category[] = Array.from(
  new Set(triviaQuestions.map((q) => q.category)),
);
