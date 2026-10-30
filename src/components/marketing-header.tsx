import Link from "next/link";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-steel-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ember text-xs font-bold text-black">
            C
          </span>
          <span className="text-sm font-semibold tracking-tight">Codexercise</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link className="text-muted hover:text-foreground" href="/masuk">
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="rounded-md bg-ember px-3 py-1.5 font-medium text-black hover:bg-ember-soft"
          >
            Daftar
          </Link>
        </nav>
      </div>
    </header>
  );
}
