import type { ConversationPrompt, Tone } from "../state/types";

export const tones: Tone[] = [
  "light",
  "fun",
  "deep",
  "values",
  "life",
  "future",
  "relationship",
  "spicy",
];

export const conversationPrompts: ConversationPrompt[] = [
  { id: "light-1", tone: "light", text: "What tiny win made you smile today?" },
  { id: "light-2", tone: "light", text: "Which song instantly lifts your mood?" },
  { id: "light-3", tone: "light", text: "What's your go-to comfort snack?" },

  { id: "fun-1", tone: "fun", text: "If you got a free billboard for a day, what would it say?" },
  { id: "fun-2", tone: "fun", text: "Pick a superpower that's mildly inconvenient for everyone else." },
  { id: "fun-3", tone: "fun", text: "What reality show would you secretly crush?" },

  { id: "deep-1", tone: "deep", text: "What belief of yours has changed the most in the past 5 years?" },
  { id: "deep-2", tone: "deep", text: "When do you feel most like yourself?" },
  { id: "deep-3", tone: "deep", text: "Which failure taught you something you still use daily?" },

  { id: "values-1", tone: "values", text: "What principle would you never compromise on?" },
  { id: "values-2", tone: "values", text: "Who modeled the kind of integrity you admire?" },
  { id: "values-3", tone: "values", text: "What does 'success' mean to you right now?" },

  { id: "life-1", tone: "life", text: "What habit are you trying to build this month?" },
  { id: "life-2", tone: "life", text: "Where do you want to spend more of your time?" },
  { id: "life-3", tone: "life", text: "What would make the next 90 days feel meaningful?" },

  { id: "future-1", tone: "future", text: "If you could fast-forward 10 years, what do you hope you see?" },
  { id: "future-2", tone: "future", text: "What technology are you most excited to use in everyday life?" },
  { id: "future-3", tone: "future", text: "What's a risk you want to take in the next year?" },

  { id: "relationship-1", tone: "relationship", text: "What makes you feel most supported by friends?" },
  { id: "relationship-2", tone: "relationship", text: "How do you like to celebrate people you care about?" },
  { id: "relationship-3", tone: "relationship", text: "Which shared experience bonded you with someone quickly?" },

  { id: "spicy-1", tone: "spicy", text: "What's a harmless opinion that still starts arguments?" },
  { id: "spicy-2", tone: "spicy", text: "Which movie is overrated and why?" },
  { id: "spicy-3", tone: "spicy", text: "What's a boundary you wish more people respected?" },
];
