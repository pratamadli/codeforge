"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LessonCompleteButton({
  slug,
  done,
}: {
  slug: string;
  done: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(done);

  async function mark() {
    setPending(true);
    const res = await fetch(`/api/pelajaran/${slug}/selesai`, { method: "POST" });
    setPending(false);
    if (res.ok) {
      setComplete(true);
      router.refresh();
    }
  }

  if (complete) {
    return (
      <p className="rounded-lg border border-good/40 bg-good/10 px-4 py-3 text-sm text-good">
        Materi ini sudah kamu tandai selesai.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={mark}
      disabled={pending}
      data-testid="tandai-selesai"
      className="rounded-lg bg-ember px-4 py-2.5 font-medium text-black hover:bg-ember-soft disabled:opacity-60"
    >
      {pending ? "Menyimpan…" : "Tandai selesai"}
    </button>
  );
}
