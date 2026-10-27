"use client";

import { useState } from "react";

type Mode = "masuk" | "daftar";

export function AuthForm({ mode }: { mode: Mode }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const payload =
      mode === "daftar"
        ? {
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          }
        : {
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          };

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setPending(false);
      setError(data.error || "Gagal. Coba lagi.");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next") || "/kurikulum";
    window.location.assign(next);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "daftar" && (
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Nama</span>
          <input
            required
            name="name"
            className="w-full rounded-lg border border-steel-border bg-steel px-3 py-2 outline-none focus:border-ember"
            autoComplete="name"
          />
        </label>
      )}
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Email</span>
        <input
          required
          type="email"
          name="email"
          className="w-full rounded-lg border border-steel-border bg-steel px-3 py-2 outline-none focus:border-ember"
          autoComplete="email"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-muted">Password</span>
        <input
          required
          type="password"
          name="password"
          minLength={8}
          className="w-full rounded-lg border border-steel-border bg-steel px-3 py-2 outline-none focus:border-ember"
          autoComplete={mode === "daftar" ? "new-password" : "current-password"}
        />
      </label>
      {error && <p className="text-sm text-bad">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        data-testid="auth-submit"
        className="w-full rounded-lg bg-ember py-2.5 font-medium text-black hover:bg-ember-soft disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : mode === "daftar" ? "Buat akun" : "Masuk"}
      </button>
    </form>
  );
}
