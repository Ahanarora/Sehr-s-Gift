import { conversationPrompts, tones } from "../data/conversation";
import { triviaCategories, triviaQuestions } from "../data/trivia";
import type {
  Category,
  ConversationBias,
  ConversationPrompt,
  Question,
  SeenRecord,
  Tone,
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

const biasToTones = (bias?: ConversationBias): Tone[] | undefined => {
  switch (bias) {
    case "lighter":
      return ["light", "fun"];
    case "deeper":
      return ["deep", "values", "life", "future", "relationship"];
    case "spicier":
      return ["spicy"];
    default:
      return undefined;
  }
};

interface PromptPickerInput {
  modeFilter?: Tone[];
  seenPrompts: SeenRecord;
  lastTone?: Tone;
  bias?: ConversationBias;
}

export const pickConversationPrompt = (
  input: PromptPickerInput,
): ConversationPrompt | undefined => {
  const { modeFilter, seenPrompts, lastTone, bias } = input;
  const pool = conversationPrompts.filter(
    (p) => (!modeFilter || modeFilter.includes(p.tone)) && !seenPrompts[p.id],
  );

  if (pool.length === 0) return undefined;

  const counts = pool.reduce<Record<Tone, number>>((acc, prompt) => {
    acc[prompt.tone] = (acc[prompt.tone] ?? 0) + 1;
    return acc;
  }, {} as Record<Tone, number>);

  const preferredTones = biasToTones(bias);

  let candidateTones: Tone[] = preferredTones
    ? preferredTones.filter((tone) => counts[tone])
    : (Object.keys(counts) as Tone[]);

  if (candidateTones.length === 0) {
    candidateTones = Object.keys(counts) as Tone[];
  }

  const withoutLast = candidateTones.filter((t) => t !== lastTone);
  if (withoutLast.length > 0) {
    candidateTones = withoutLast;
  }

  const maxCount = Math.max(...candidateTones.map((t) => counts[t] ?? 0));
  const topTones = candidateTones.filter((t) => counts[t] === maxCount);
  const chosenTone = randomPick(topTones);
  const tonePool = pool.filter((p) => p.tone === chosenTone);
  return randomPick(tonePool);
};

export const remainingPromptsCount = (
  seenPrompts: SeenRecord,
  modeFilter?: Tone[],
): number => {
  return conversationPrompts.filter(
    (p) => (!modeFilter || modeFilter.includes(p.tone)) && !seenPrompts[p.id],
  ).length;
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

export { triviaQuestions, conversationPrompts, tones };
