import { CONTEKAN_CARDS, type ContekanCard } from "@/content/contekan";

export const REVIEW_KEY = "ce-review-v1";

export type ReviewGrade = "lancar" | "goyang";

export type ReviewState = {
  v: 1;
  grades: Record<string, ReviewGrade>;
};

export function emptyReview(): ReviewState {
  return { v: 1, grades: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseReview(raw: string | null): ReviewState {
  if (!raw) return emptyReview();
  try {
    const data = JSON.parse(raw) as unknown;
    if (!isRecord(data) || data.v !== 1 || !isRecord(data.grades)) return emptyReview();
    const grades: Record<string, ReviewGrade> = {};
    for (const [id, value] of Object.entries(data.grades)) {
      if (value === "lancar" || value === "goyang") grades[id] = value;
    }
    return { v: 1, grades };
  } catch {
    return emptyReview();
  }
}

export function loadReview(): ReviewState {
  if (typeof window === "undefined") return emptyReview();
  try {
    return parseReview(window.localStorage.getItem(REVIEW_KEY));
  } catch {
    return emptyReview();
  }
}

export function saveReview(state: ReviewState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVIEW_KEY, JSON.stringify(state));
}

export function gradeCard(id: string, grade: ReviewGrade): ReviewState {
  const state = loadReview();
  state.grades[id] = grade;
  saveReview(state);
  return state;
}

export function pickCard(
  cards: ContekanCard[] = CONTEKAN_CARDS,
  grades: Record<string, ReviewGrade> = {},
  currentId?: string,
): ContekanCard {
  const pool = currentId ? cards.filter((card) => card.id !== currentId) : cards;
  const goyang = pool.filter((card) => grades[card.id] === "goyang");
  if (goyang[0]) return goyang[0];
  const unseen = pool.filter((card) => !grades[card.id]);
  if (unseen[0]) return unseen[0];
  return pool[0] ?? cards[0];
}
