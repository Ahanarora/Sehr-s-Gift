import rawThoughts from "../../../questions/500_unique_thoughts_of_the_day.json";

// Normalize: strip any leading numbering like "Thought 1:" while preserving the rest of the text.
export const thoughtsOfDay: string[] = (rawThoughts as string[]).map((t) =>
  t.replace(/^Thought\s*\d+:\s*/i, "").trim(),
);
