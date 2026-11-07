export const SPEECH_RATE_KEY = "ce-speech-rate";

export const SPEECH_RATES = {
  slow: 0.8,
  normal: 1,
} as const;

export type SpeechRate = keyof typeof SPEECH_RATES;

export type SpeechSegment = {
  el: HTMLElement;
  text: string;
};

export type VoiceLike = {
  lang: string;
  default?: boolean;
};

const STRUCTURAL = new Set([
  "UL",
  "OL",
  "LI",
  "PRE",
  "TABLE",
  "THEAD",
  "TBODY",
  "TFOOT",
  "TR",
  "BLOCKQUOTE",
  "P",
  "DIV",
  "SECTION",
  "ARTICLE",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
]);

export function isIndonesianLang(lang: string): boolean {
  return /^id([-_]|$)/i.test(lang.trim());
}

export function pickVoice<T extends VoiceLike>(voices: T[]): { voice: T | null; indonesian: boolean } {
  const indonesianVoices = voices.filter((voice) => isIndonesianLang(voice.lang));
  const exact = indonesianVoices.find((voice) => /^id[-_]?id$/i.test(voice.lang.trim()));
  const voice = exact ?? indonesianVoices[0] ?? voices.find((item) => item.default) ?? voices[0] ?? null;
  return { voice, indonesian: indonesianVoices.length > 0 };
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function joinSpoken(parts: string[]): string {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      if (!acc) return part;
      return /[.!?…]$/.test(acc) ? `${acc} ${part}` : `${acc}. ${part}`;
    }, "");
}

function ownText(el: Element): string {
  let out = "";
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent ?? "";
      continue;
    }
    if (!(node instanceof HTMLElement)) continue;
    if (STRUCTURAL.has(node.tagName)) continue;
    out += ` ${node.textContent ?? ""}`;
  }
  return normalize(out);
}

function listPrefix(li: Element): string {
  const parent = li.parentElement;
  if (!parent || parent.tagName !== "OL") return "";
  const items = [...parent.children].filter((child) => child.tagName === "LI");
  const index = items.indexOf(li);
  if (index < 0) return "";
  const startAttr = parent.getAttribute("start");
  const start = startAttr ? Number(startAttr) : 1;
  const n = (Number.isFinite(start) ? start : 1) + index;
  return `${n}. `;
}

function pushSegment(segments: SpeechSegment[], el: HTMLElement, text: string) {
  const clean = normalize(text);
  if (!clean) return;
  segments.push({ el, text: clean });
}

function collectTable(segments: SpeechSegment[], table: HTMLTableElement) {
  const rows = [...table.rows];
  const headerRow = rows.find(
    (row) => row.cells.length > 0 && [...row.cells].every((cell) => cell.tagName === "TH"),
  );
  const headers = headerRow ? [...headerRow.cells].map((cell) => normalize(cell.textContent ?? "")) : [];

  for (const row of rows) {
    const cells = [...row.cells].map((cell) => normalize(cell.textContent ?? ""));
    if (cells.every((cell) => cell.length === 0)) continue;
    const headerOnly = row.cells.length > 0 && [...row.cells].every((cell) => cell.tagName === "TH");
    if (headerOnly || headers.length === 0) {
      pushSegment(segments, row, joinSpoken(cells));
      continue;
    }
    const spoken = cells.map((cell, index) => {
      if (!cell) return "";
      const head = headers[index];
      return head ? `${head}: ${cell}` : cell;
    });
    pushSegment(segments, row, joinSpoken(spoken));
  }
}

function visit(segments: SpeechSegment[], el: Element) {
  const tag = el.tagName;
  if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return;

  if (tag === "PRE") {
    pushSegment(segments, el as HTMLElement, "contoh kode");
    return;
  }

  if (tag === "TABLE") {
    collectTable(segments, el as HTMLTableElement);
    return;
  }

  if (/^H[1-6]$/.test(tag) || tag === "P") {
    pushSegment(segments, el as HTMLElement, el.textContent ?? "");
    return;
  }

  if (tag === "LI") {
    const own = ownText(el);
    if (own) pushSegment(segments, el as HTMLElement, `${listPrefix(el)}${own}`);
    for (const child of el.children) {
      if (STRUCTURAL.has(child.tagName)) visit(segments, child);
    }
    return;
  }

  if (tag !== "UL" && tag !== "OL") {
    const own = ownText(el);
    if (own) pushSegment(segments, el as HTMLElement, own);
  }

  for (const child of el.children) visit(segments, child);
}

export function collectSpeechSegments(root: HTMLElement): SpeechSegment[] {
  const segments: SpeechSegment[] = [];
  visit(segments, root);
  return segments;
}
