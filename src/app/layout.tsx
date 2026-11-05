import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { getSearchCatalog } from "@/lib/content";
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
  title: "Codexercise — Senior Full Stack (MERN)",
  description:
    "14 bab revisi Panduan Interview Fullstack (proses/thread dulu), ditimbang senior MERN: produksi, transaksi Mongo, API, RCA. Tanpa daftar akun.",
};

const themeScript = `try{var t=localStorage.getItem("ce-theme");if(t==="light")document.documentElement.classList.remove("dark");else document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const catalog = getSearchCatalog();

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
        <AppShell catalog={catalog}>{children}</AppShell>
      </body>
    </html>
  );
}
