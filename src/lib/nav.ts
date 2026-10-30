export type NavItem = {
  href: string;
  label: string;
  icon: "home" | "path" | "code" | "chart";
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const APP_NAV: NavGroup[] = [
  {
    label: "Belajar",
    items: [
      { href: "/dashboard", label: "Dasbor", icon: "home" },
      { href: "/kurikulum", label: "Kurikulum", icon: "path" },
      { href: "/latihan", label: "Latihan", icon: "code" },
    ],
  },
  {
    label: "Akun",
    items: [{ href: "/progress", label: "Progress", icon: "chart" }],
  },
];

export const PAGE_TITLE: Record<string, string> = {
  "/dashboard": "Dasbor",
  "/kurikulum": "Kurikulum",
  "/latihan": "Latihan",
  "/progress": "Progress",
};

export function titleForPath(pathname: string): string {
  if (PAGE_TITLE[pathname]) return PAGE_TITLE[pathname];
  if (pathname.startsWith("/kurikulum/")) return "Kurikulum";
  if (pathname.startsWith("/pelajaran/")) return "Materi";
  if (pathname.startsWith("/soal/")) return "Soal";
  return "Codexercise";
}
