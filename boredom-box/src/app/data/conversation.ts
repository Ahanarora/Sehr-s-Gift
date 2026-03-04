import promptsRaw from "../../../questions/boredom_box_prompts_600.json" assert { type: "json" };
import type { ConversationBias, ConversationPrompt, Tone } from "../state/types";

type RawPrompt = {
  id?: string;
  category: string;
  level?: number;
  prompt: string;
};

const categoryToBias: Record<string, ConversationBias> = {
  light: "lighter",
  deep: "deeper",
  spicy: "spicier",
};

const categoryToTone: Record<string, Tone> = {
  light: "light",
  deep: "deep",
  spicy: "spicy",
};

const mapped = (promptsRaw as RawPrompt[])
  .map((p, idx) => {
    const bias = categoryToBias[p.category];
    const tone = categoryToTone[p.category];
    if (!bias || !tone) return undefined;
    return {
      id: p.id ?? `${bias}-${tone}-${p.level ?? 1}-${idx}`,
      tone,
      text: p.prompt,
      level: p.level ?? 1,
      bias,
    } satisfies ConversationPrompt;
  })
  .filter(Boolean) as ConversationPrompt[];

export const conversationPrompts: ConversationPrompt[] = mapped;

export const tones: Tone[] = ["light", "deep", "spicy"];
