import type { Player, SeenRecord } from "./types";
import { createDefaultPlayers } from "./initialState";

const PLAYERS_KEY = "bb_players_v1";
const TRIVIA_SEEN_KEY = "bb_trivia_seen_v1";
const CONVO_SEEN_KEY = "bb_convo_seen_v1";
const LIFETIME_SCORES_KEY = "bb_lifetime_scores_v1";

const isBrowser = typeof window !== "undefined" && !!window.localStorage;

const safeParse = <T>(raw: string | null): T | undefined => {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn("Failed to parse stored value", err);
    return undefined;
  }
};

const normalizePlayer = (player: Player): Player => {
  const normalizedName = player.name?.trim() === "Seher" ? "Sehr" : player.name;
  return { ...player, name: normalizedName, score: player.score ?? 0 };
};

export const loadPlayers = (): Player[] => {
  if (!isBrowser) return createDefaultPlayers();
  const parsed = safeParse<Player[]>(localStorage.getItem(PLAYERS_KEY));
  if (!parsed || !Array.isArray(parsed)) return createDefaultPlayers();
  return parsed.map(normalizePlayer);
};

export const savePlayers = (players: Player[]) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  } catch (err) {
    console.warn("Failed to save players", err);
  }
};

export const loadSeenQuestions = (): SeenRecord => {
  if (!isBrowser) return {};
  return safeParse<SeenRecord>(localStorage.getItem(TRIVIA_SEEN_KEY)) ?? {};
};

export const saveSeenQuestions = (seen: SeenRecord) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(TRIVIA_SEEN_KEY, JSON.stringify(seen));
  } catch (err) {
    console.warn("Failed to save trivia seen", err);
  }
};

export const loadSeenPrompts = (): SeenRecord => {
  if (!isBrowser) return {};
  return safeParse<SeenRecord>(localStorage.getItem(CONVO_SEEN_KEY)) ?? {};
};

export const saveSeenPrompts = (seen: SeenRecord) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(CONVO_SEEN_KEY, JSON.stringify(seen));
  } catch (err) {
    console.warn("Failed to save convo seen", err);
  }
};

export const loadLifetimeScores = (): Record<string, number> => {
  if (!isBrowser) return {};
  return safeParse<Record<string, number>>(localStorage.getItem(LIFETIME_SCORES_KEY)) ?? {};
};

export const saveLifetimeScores = (scores: Record<string, number>) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(LIFETIME_SCORES_KEY, JSON.stringify(scores));
  } catch (err) {
    console.warn("Failed to save lifetime scores", err);
  }
};
