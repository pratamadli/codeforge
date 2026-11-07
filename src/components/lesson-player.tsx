"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  collectSpeechSegments,
  pickVoice,
  SPEECH_RATE_KEY,
  SPEECH_RATES,
  type SpeechRate,
  type SpeechSegment,
} from "@/lib/lesson-speech";

const CONTROL =
  "min-h-11 rounded-lg px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const PRIMARY = "bg-ember text-black hover:bg-ember-soft";
const GHOST = "border border-steel-border bg-transparent text-foreground hover:bg-steel-raised";

function clearSpeakingMark(root: HTMLElement | null) {
  if (!root) return;
  root.querySelectorAll(".speak-current").forEach((el) => {
    el.classList.remove("speak-current");
    el.removeAttribute("data-speaking");
  });
}

function markSpeaking(el: HTMLElement) {
  clearSpeakingMark(el.closest("article"));
  el.classList.add("speak-current");
  el.setAttribute("data-speaking", "true");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
}

function readStoredRate(): SpeechRate {
  try {
    const saved = localStorage.getItem(SPEECH_RATE_KEY);
    if (saved === "slow" || saved === "normal") return saved;
  } catch {
    /* private mode */
  }
  return "normal";
}

export function LessonPlayer({ slug, children }: { slug: string; children: ReactNode }) {
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = useState<SpeechRate>("normal");
  const [utterance, setUtterance] = useState("");
  const [script, setScript] = useState<string[]>([]);
  const [unsupported, setUnsupported] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [indonesian, setIndonesian] = useState(false);

  const articleRef = useRef<HTMLElement>(null);
  const statusRef = useRef(status);
  const rateRef = useRef(rate);
  const segmentsRef = useRef<SpeechSegment[]>([]);
  const indexRef = useRef(0);
  const genRef = useRef(0);
  const pausedRef = useRef(false);
  const restartOnResumeRef = useRef(false);

  statusRef.current = status;
  rateRef.current = rate;

  useLayoutEffect(() => {
    const root = articleRef.current;
    const segments = root ? collectSpeechSegments(root) : [];
    segmentsRef.current = segments;
    setScript(segments.map((segment) => segment.text));
    setStatus("idle");
    setUtterance("");
    statusRef.current = "idle";
    pausedRef.current = false;
    indexRef.current = 0;
    clearSpeakingMark(root);

    return () => {
      genRef.current += 1;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      clearSpeakingMark(root);
    };
  }, [slug]);

  useLayoutEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      const timer = window.setTimeout(() => setUnsupported(true), 0);
      return () => window.clearTimeout(timer);
    }

    function update() {
      const voices = synth.getVoices();
      setIndonesian(pickVoice(voices).indonesian);
      if (voices.length > 0) setVoicesReady(true);
    }

    update();
    synth.addEventListener("voiceschanged", update);
    const voicesTimer = window.setTimeout(() => setVoicesReady(true), 800);
    const rateTimer = window.setTimeout(() => {
      const stored = readStoredRate();
      rateRef.current = stored;
      setRate(stored);
    }, 0);
    return () => {
      synth.removeEventListener("voiceschanged", update);
      window.clearTimeout(voicesTimer);
      window.clearTimeout(rateTimer);
    };
  }, []);

  useLayoutEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => {
      const synth = window.speechSynthesis;
      if (!synth || statusRef.current !== "playing" || pausedRef.current) return;
      if (!synth.speaking || synth.paused) return;
      // Chrome drops long speechSynthesis audio unless the engine is nudged.
      synth.pause();
      synth.resume();
    }, 10000);
    return () => window.clearInterval(timer);
  }, [status]);

  function clearSynth() {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    synth.resume();
  }

  function playFrom(index: number) {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const segment = segmentsRef.current[index];
    genRef.current += 1;
    const token = genRef.current;
    clearSynth();

    if (!segment) {
      clearSpeakingMark(articleRef.current);
      pausedRef.current = false;
      restartOnResumeRef.current = false;
      indexRef.current = 0;
      statusRef.current = "idle";
      setStatus("idle");
      setUtterance("");
      return;
    }

    indexRef.current = index;
    pausedRef.current = false;
    restartOnResumeRef.current = false;
    statusRef.current = "playing";
    setStatus("playing");
    setUtterance(segment.text);
    markSpeaking(segment.el);

    const spoken = new SpeechSynthesisUtterance(segment.text);
    spoken.lang = "id-ID";
    spoken.rate = SPEECH_RATES[rateRef.current];
    const picked = pickVoice(synth.getVoices());
    if (picked.voice) spoken.voice = picked.voice;

    window.setTimeout(() => {
      if (genRef.current !== token || pausedRef.current) return;
      const started = performance.now();
      spoken.onend = (event) => {
        if (genRef.current !== token || pausedRef.current) return;
        const elapsed = performance.now() - started;
        // Headless browsers acknowledge speech without playing it.
        if (event.elapsedTime === 0 && elapsed < 200) return;
        playFrom(index + 1);
      };
      spoken.onerror = () => {
        /* interrupted or unavailable — controls stay on this part */
      };
      synth.speak(spoken);
    }, 40);
  }

  function play() {
    if (!window.speechSynthesis) {
      setUnsupported(true);
      return;
    }
    if (unsupported || segmentsRef.current.length === 0) return;
    if (statusRef.current === "playing") return;
    if (statusRef.current === "paused") {
      if (restartOnResumeRef.current) {
        playFrom(indexRef.current);
        return;
      }
      pausedRef.current = false;
      statusRef.current = "playing";
      setStatus("playing");
      const synth = window.speechSynthesis;
      if (synth?.paused) synth.resume();
      window.setTimeout(() => {
        if (statusRef.current === "playing" && synth && !synth.speaking && !synth.pending) {
          playFrom(indexRef.current);
        }
      }, 120);
      return;
    }
    playFrom(0);
  }

  function pause() {
    if (statusRef.current !== "playing") return;
    pausedRef.current = true;
    statusRef.current = "paused";
    setStatus("paused");
    window.speechSynthesis?.pause();
  }

  function stop() {
    genRef.current += 1;
    pausedRef.current = false;
    restartOnResumeRef.current = false;
    indexRef.current = 0;
    statusRef.current = "idle";
    clearSynth();
    clearSpeakingMark(articleRef.current);
    setStatus("idle");
    setUtterance("");
  }

  function chooseRate(next: SpeechRate) {
    rateRef.current = next;
    setRate(next);
    try {
      localStorage.setItem(SPEECH_RATE_KEY, next);
    } catch {
      /* private mode */
    }
    if (statusRef.current === "idle") return;
    if (statusRef.current === "paused") {
      restartOnResumeRef.current = true;
      return;
    }
    playFrom(indexRef.current);
  }

  const showVoiceNote = !unsupported && voicesReady && !indonesian;
  const playing = status === "playing";
  const idle = status === "idle";

  return (
    <>
    <section
      data-testid="lesson-player"
      data-status={status}
      data-rate={rate}
      data-indonesian={voicesReady ? (indonesian ? "true" : "false") : "pending"}
      data-utterance={utterance}
      aria-label="Pemutar materi"
      className="sticky top-0 z-20 -mx-4 mb-6 border-b border-steel-border bg-background/95 px-4 py-3 backdrop-blur-md lg:-mx-8 lg:px-8"
    >
      <p data-testid="speech-status" aria-live="polite" className="text-xs font-medium text-ember-soft">
        {playing ? "Memutar" : status === "paused" ? "Dijeda" : "Siap"}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <button
          type="button"
          data-testid="speech-play"
          className={`${CONTROL} ${playing ? GHOST : PRIMARY}`}
          onClick={play}
          disabled={unsupported || playing || script.length === 0}
        >
          Putar
        </button>
        <button
          type="button"
          data-testid="speech-pause"
          className={`${CONTROL} ${playing ? PRIMARY : GHOST}`}
          onClick={pause}
          disabled={!playing}
        >
          Jeda
        </button>
        <button
          type="button"
          data-testid="speech-stop"
          className={`${CONTROL} ${GHOST}`}
          onClick={stop}
          disabled={idle}
        >
          Berhenti
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="shrink-0 text-xs text-muted">Kecepatan</span>
        <div role="group" aria-label="Kecepatan" className="grid flex-1 grid-cols-2 gap-2 sm:max-w-xs">
          <button
            type="button"
            data-testid="speech-rate-slow"
            aria-pressed={rate === "slow"}
            className={`${CONTROL} ${rate === "slow" ? PRIMARY : GHOST}`}
            onClick={() => chooseRate("slow")}
          >
            Lambat
          </button>
          <button
            type="button"
            data-testid="speech-rate-normal"
            aria-pressed={rate === "normal"}
            className={`${CONTROL} ${rate === "normal" ? PRIMARY : GHOST}`}
            onClick={() => chooseRate("normal")}
          >
            Normal
          </button>
        </div>
      </div>
      {showVoiceNote ? (
        <p data-testid="speech-voice-note" className="mt-2 text-xs text-muted">
          Suara Indonesia tergantung perangkat.
        </p>
      ) : null}
      {utterance && status !== "idle" ? (
        <p data-testid="speech-utterance" className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground">
          {utterance}
        </p>
      ) : null}
      {unsupported ? (
        <p className="mt-2 text-xs text-muted">Peramban ini belum bisa membacakan materi.</p>
      ) : null}
      <ol data-testid="speech-script" hidden>
        {script.map((line, index) => (
          <li key={`${slug}-${index}`}>{line}</li>
        ))}
      </ol>
    </section>
    <article ref={articleRef}>{children}</article>
    </>
  );
}
