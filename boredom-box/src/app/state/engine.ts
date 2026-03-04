import { conversationPrompts } from "../data/conversation";
import { triviaCategories, triviaQuestions } from "../data/trivia";
import type {
  Category,
  ConversationBias,
  ConversationPrompt,
  Question,
  SeenRecord,
} from "./types";

const randomPick = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const shuffle = <T>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const sampleWithoutReplacement = <T>(items: T[], count: number): T[] => {
  const copy = [...items];
  const result: T[] = [];
  const max = Math.min(count, copy.length);
  for (let i = 0; i < max; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
};

export const pickQuestion = (
  category: Category | undefined,
  seenQuestions: SeenRecord,
): Question | undefined => {
  if (!category) return undefined;
  const pool = triviaQuestions.filter(
    (q) => q.category === category && !seenQuestions[q.id],
  );
  if (pool.length === 0) return undefined;
  const shuffled = shuffle(pool);
  return shuffled[0];
};

interface PromptPickerInput {
  seenPrompts?: SeenRecord;
  bias?: ConversationBias;
  targetLevel?: number;
}

export const pickConversationPrompt = (
  input: PromptPickerInput,
): ConversationPrompt | undefined => {
  const { seenPrompts = {}, bias, targetLevel } = input;
  const basePool = conversationPrompts.filter((p) => {
    if (bias && p.bias !== bias) return false;
    return !seenPrompts[p.id];
  });

  if (basePool.length === 0) return undefined;

  let pool = basePool;

  if (typeof targetLevel === "number") {
    for (let level = targetLevel; level <= 3; level++) {
      const levelPool = basePool.filter((p) => (p.level ?? 1) === level);
      if (levelPool.length > 0) {
        pool = levelPool;
        break;
      }
    }
  }

  if (pool.length === 0) return undefined;

  return randomPick(pool);
};

export const remainingPromptsCount = (): number => {
  return conversationPrompts.length;
};

export const remainingQuestionsCount = (
  category: Category | undefined,
  seenQuestions: SeenRecord,
): number => {
  if (!category) return 0;
  return triviaQuestions.filter(
    (q) => q.category === category && !seenQuestions[q.id],
  ).length;
};

export const pickCategoryOptions = (seenQuestions: SeenRecord): Category[] => {
  const available = triviaCategories.filter(
    (cat) => remainingQuestionsCount(cat, seenQuestions) > 0,
  );
  const pool = available.length > 0 ? available : triviaCategories;
  return sampleWithoutReplacement(pool, Math.min(2, pool.length));
};

export { triviaQuestions, conversationPrompts };
