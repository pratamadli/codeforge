"use client";

import Link from "next/link";

type Props = {
  user: { name: string; email: string } | null;
};

export function Navbar({ user }: Props) {
  async function logout() {
    await fetch("/api/auth/keluar", { method: "POST" });
    window.location.assign("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-steel-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href={user ? "/kurikulum" : "/"} className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">Codexercise</span>
          <span className="hidden text-xs text-muted sm:inline">latihan sampai lolos interview</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link className="text-muted hover:text-foreground" href="/kurikulum">
                Kurikulum
              </Link>
              <Link className="text-muted hover:text-foreground" href="/progress">
                Progress
              </Link>
              <span className="hidden text-muted md:inline">{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-steel-border px-3 py-1.5 text-muted hover:border-ember hover:text-foreground"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link className="text-muted hover:text-foreground" href="/masuk">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-md bg-ember px-3 py-1.5 font-medium text-black hover:bg-ember-soft"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
