"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandSearch } from "@/components/command-search";
import { IconMenu, IconPanel, NavIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import type { SearchHit } from "@/lib/catalog";
import { APP_NAV, titleForPath } from "@/lib/nav";

type User = { name: string; email: string };

export function AppShell({
  user,
  catalog,
  children,
}: {
  user: User;
  catalog: SearchHit[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("ce-sidebar") === "collapsed");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("ce-sidebar", next ? "collapsed" : "expanded");
  }

  async function logout() {
    await fetch("/api/auth/keluar", { method: "POST" });
    window.location.assign("/");
  }

  const editor = pathname.startsWith("/soal/");

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        data-collapsed={collapsed ? "true" : "false"}
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-steel-border bg-sidebar transition-transform md:static md:translate-x-0 ${
          collapsed ? "md:w-[4.5rem]" : "md:w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className={`flex h-14 items-center gap-2 border-b border-steel-border px-3 ${collapsed ? "md:justify-center" : ""}`}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ember text-xs font-bold text-black">
              C
            </span>
            <span className={`text-sm font-semibold tracking-tight ${collapsed ? "md:hidden" : ""}`}>
              Codexercise
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {APP_NAV.map((group) => (
            <div key={group.label} className="mb-4">
              <p
                className={`px-2 pb-1 text-[11px] uppercase tracking-wider text-muted ${collapsed ? "md:hidden" : ""}`}
              >
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={item.label}
                        className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm ${
                          collapsed ? "md:justify-center" : ""
                        } ${
                          active
                            ? "bg-ember/15 font-medium text-ember-soft"
                            : "text-muted hover:bg-steel-raised hover:text-foreground"
                        }`}
                      >
                        <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />
                        <span className={collapsed ? "md:hidden" : ""}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-steel-border p-2">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted hover:bg-steel-raised hover:text-foreground md:flex"
            title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            data-testid="toggle-sidebar"
          >
            <IconPanel className="h-4 w-4 shrink-0" />
            <span className={collapsed ? "md:hidden" : ""}>Ciutkan</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-steel-border bg-background px-3 md:px-5">
          <button
            type="button"
            className="rounded-md border border-steel-border p-2 text-muted md:hidden"
            aria-label="Buka menu"
            data-testid="open-mobile-nav"
            onClick={() => setMobileOpen(true)}
          >
            <IconMenu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{titleForPath(pathname)}</p>
          </div>
          <CommandSearch catalog={catalog} />
          <ThemeToggle />
          <div className="hidden text-right text-xs leading-tight md:block">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-steel-border px-3 py-1.5 text-sm text-muted hover:border-ember hover:text-foreground"
          >
            Keluar
          </button>
        </header>
        <main className={editor ? "min-h-0 flex-1 overflow-hidden" : "flex-1 overflow-auto"}>
          {children}
        </main>
      </div>
    </div>
  );
}
