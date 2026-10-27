import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { MarketingHeader } from "@/components/marketing-header";
import { getCurrentUser } from "@/lib/auth";
import { getSearchCatalog } from "@/lib/catalog";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codexercise — latihan coding sampai lolos interview",
  description:
    "Kurikulum JS, TS, algoritma, dan arsitektur. Kerjakan soal di editor, sistem mengetes kodemu, lalu baca pembahasan.",
};

const themeScript = `try{var t=localStorage.getItem("ce-theme");if(t==="light")document.documentElement.classList.remove("dark");else document.documentElement.classList.add("dark")}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const catalog = user ? await getSearchCatalog() : [];

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        {user ? (
          <AppShell user={user} catalog={catalog}>
            {children}
          </AppShell>
        ) : (
          <div className="flex min-h-dvh flex-col">
            <MarketingHeader />
            <div className="flex-1">{children}</div>
          </div>
        )}
      </body>
    </html>
  );
}
