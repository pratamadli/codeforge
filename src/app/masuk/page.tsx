import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function MasukPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">Masuk</h1>
      <p className="mt-2 mb-6 text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="text-ember hover:underline">
          Daftar
        </Link>
      </p>
      <AuthForm mode="masuk" />
      <p className="mt-6 text-xs text-muted">
        Demo seed: <code>demo@codexercise.dev</code> / <code>Latihan123</code>
      </p>
    </main>
  );
}
