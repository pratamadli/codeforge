"use client";

import { useState } from "react";

export function LessonCompleteButton({
  done,
  onComplete,
}: {
  done: boolean;
  onComplete: () => void;
}) {
  const [complete, setComplete] = useState(done);

  function mark() {
    onComplete();
    setComplete(true);
  }

  if (complete) {
    return (
      <p className="rounded-lg border border-good/40 bg-good/10 px-4 py-3 text-sm text-good">
        Materi ini sudah kamu tandai selesai. Progress tersimpan di browser ini.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={mark}
      data-testid="tandai-selesai"
      className="rounded-lg bg-ember px-4 py-2.5 font-medium text-black hover:bg-ember-soft"
    >
      Tandai selesai
    </button>
  );
}
