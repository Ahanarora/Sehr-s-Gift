import conversationRaw from "../../../questions/conversation_randomizer_300_utf8.json" assert { type: "json" };
import type { ConversationBias, ConversationPrompt, Tone } from "../state/types";

type RawPrompt = {
  mode?: string;
  tone: string;
  level?: number;
  text: string;
};

const mapGroup = (
  bias: ConversationBias,
  prompts: RawPrompt[],
  offset: number,
): ConversationPrompt[] =>
  prompts.map((p, idx) => ({
    id: `${bias}-${p.tone}-${p.level ?? 1}-${offset + idx}`,
    tone: p.tone as Tone,
    text: p.text,
    level: p.level ?? 1,
    bias,
  }));

const lighter = mapGroup("lighter", conversationRaw.lighter ?? [], 0);
const deeper = mapGroup("deeper", conversationRaw.deeper ?? [], lighter.length);
const spicier = mapGroup(
  "spicier",
  conversationRaw.spicier ?? [],
  lighter.length + deeper.length,
);

export const conversationPrompts: ConversationPrompt[] = [...lighter, ...deeper, ...spicier];

export const tones: Tone[] = ["light", "fun", "values", "life", "spicy", "deep", "future", "relationship"];
