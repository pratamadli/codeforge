"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch } from "@/components/icons";
import type { SearchHit } from "@/lib/catalog";

const KIND: Record<SearchHit["kind"], string> = {
  track: "Track",
  lesson: "Materi",
  problem: "Soal",
};

export function CommandSearch({ catalog }: { catalog: SearchHit[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog.slice(0, 8);
    return catalog
      .filter(
        (hit) =>
          hit.title.toLowerCase().includes(q) ||
          hit.subtitle.toLowerCase().includes(q) ||
          KIND[hit.kind].toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [catalog, query]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-w-0 items-center gap-2 rounded-md border border-steel-border bg-steel px-3 py-1.5 text-sm text-muted hover:border-ember"
      >
        <IconSearch className="h-4 w-4 shrink-0" />
        <span className="hidden truncate sm:inline">Cari materi atau soal</span>
        <kbd className="hidden rounded border border-steel-border px-1.5 text-[10px] md:inline">⌘K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh]">
          <button
            type="button"
            aria-label="Tutup pencarian"
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-steel-border bg-steel shadow-xl">
            <div className="flex items-center gap-2 border-b border-steel-border px-3">
              <IconSearch className="h-4 w-4 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari track, materi, atau soal…"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted">Tidak ada hasil.</li>
              )}
              {results.map((hit) => (
                <li key={hit.href}>
                  <button
                    type="button"
                    onClick={() => go(hit.href)}
                    className="flex w-full items-start justify-between gap-3 px-4 py-2.5 text-left hover:bg-steel-raised"
                  >
                    <span>
                      <span className="block text-sm">{hit.title}</span>
                      <span className="text-xs text-muted">{hit.subtitle}</span>
                    </span>
                    <span className="mt-0.5 text-[11px] uppercase tracking-wide text-muted">
                      {KIND[hit.kind]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
