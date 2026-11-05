"use client";

import { useState } from "react";

export type DrillCard = {
  id: string;
  prompt: string;
  answer: string;
  title?: string;
};

const PREFIX = "ce-drill:";

function loadRevealed(storageKey: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PREFIX + storageKey);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? data.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveRevealed(storageKey: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIX + storageKey, JSON.stringify(ids));
}

export function FlashDrill({
  cards,
  storageKey,
  promptLabel = "Pikirkan lantang dulu, baru buka jawaban.",
}: {
  cards: DrillCard[];
  storageKey: string;
  promptLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<string[]>(() => loadRevealed(storageKey));
  const [open, setOpen] = useState(false);

  const card = cards[index];
  if (!card) return null;

  function reveal() {
    setOpen(true);
    if (!revealed.includes(card.id)) {
      const next = [...revealed, card.id];
      setRevealed(next);
      saveRevealed(storageKey, next);
    }
  }

  function go(nextIndex: number) {
    setIndex(nextIndex);
    setOpen(revealed.includes(cards[nextIndex]?.id ?? ""));
  }

  return (
    <div className="rounded-xl border border-steel-border bg-steel p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          {index + 1} / {cards.length}
          {` · ${revealed.length} sudah dibuka`}
        </span>
        <span>{promptLabel}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {cards.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(i)}
            className={`h-2 w-6 rounded-full ${
              i === index ? "bg-ember" : revealed.includes(item.id) ? "bg-good" : "bg-steel-raised"
            }`}
            aria-label={`Kartu ${i + 1}`}
          />
        ))}
      </div>
      {card.title && <p className="mt-4 text-sm font-medium text-ember-soft">{card.title}</p>}
      <p className="mt-3 text-base leading-relaxed">{card.prompt}</p>
      {open ? (
        <div className="mt-4 rounded-lg border border-l-4 border-steel-border border-l-[var(--tip-yellow)] bg-steel-raised p-4 text-sm leading-relaxed">
          {card.answer}
        </div>
      ) : (
        <button
          type="button"
          onClick={reveal}
          className="mt-4 rounded-md bg-ember px-3 py-1.5 text-sm font-medium text-black hover:bg-ember-soft"
        >
          Tampilkan jawaban
        </button>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => go(index - 1)}
          className="rounded-md border border-steel-border px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          disabled={index >= cards.length - 1}
          onClick={() => go(index + 1)}
          className="rounded-md border border-steel-border px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
