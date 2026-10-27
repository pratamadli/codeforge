"use client";

import { useEffect, useState, type ComponentType } from "react";

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  language: "javascript" | "typescript";
};

type MonacoEditorComponent = ComponentType<{
  height: string;
  language: string;
  theme: string;
  value: string;
  onChange?: (value: string | undefined) => void;
  options?: Record<string, unknown>;
}>;

function TextEditor({ value, onChange }: Pick<EditorProps, "value" | "onChange">) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      aria-label="Editor kode"
      className="h-full min-h-[16rem] w-full resize-none border-0 bg-[#1e1e1e] p-3 font-mono text-sm leading-6 text-[#d4d4d4] outline-none"
    />
  );
}

export function CodeEditor({ value, onChange, language }: EditorProps) {
  const [Monaco, setMonaco] = useState<MonacoEditorComponent | null>(null);
  const [typed, setTyped] = useState(false);
  const [preferMonaco, setPreferMonaco] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const monaco = await import("monaco-editor");
        const reactMonaco = await import("@monaco-editor/react");
        (
          window as Window & {
            MonacoEnvironment?: { getWorker: () => Worker };
          }
        ).MonacoEnvironment = {
          getWorker() {
            return new Worker(
              URL.createObjectURL(
                new Blob(["self.onmessage=function(){};"], { type: "text/javascript" }),
              ),
            );
          },
        };
        reactMonaco.loader.config({ monaco });
        if (!cancelled) setMonaco(() => reactMonaco.default);
      } catch (error) {
        console.warn("Monaco tidak dimuat; memakai editor teks.", error);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (Monaco && !typed) setPreferMonaco(true);
  }, [Monaco, typed]);

  function handleChange(next: string) {
    setTyped(true);
    onChange(next);
  }

  if (!preferMonaco || !Monaco) {
    return <TextEditor value={value} onChange={handleChange} />;
  }

  return (
    <Monaco
      height="100%"
      language={language}
      theme="vs-dark"
      value={value}
      onChange={(next) => {
        if (typeof next === "string") handleChange(next);
      }}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 12 },
      }}
    />
  );
}
