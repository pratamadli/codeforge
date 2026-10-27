import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function DaftarPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold">Buat akun</h1>
      <p className="mt-2 mb-6 text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="text-ember hover:underline">
          Masuk
        </Link>
      </p>
      <AuthForm mode="daftar" />
    </main>
  );
}
