import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";

const STATUS: Record<string, string> = {
  passed: "Lulus",
  failed: "Gagal",
  error: "Error",
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const data = await getDashboardData(user.id);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 lg:px-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Halo, {user.name}</h1>
          <p className="mt-1 text-muted">Bangun skill, satu soal pada satu waktu.</p>
        </div>
        <Link
          href={data.continueItem?.href ?? "/kurikulum"}
          className="rounded-md bg-ember px-4 py-2 text-sm font-medium text-black hover:bg-ember-soft"
        >
          {data.continueItem ? "Lanjutkan belajar" : "Mulai kurikulum"}
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Soal lulus"
          value={`${data.problemsSolved}/${data.problemsTotal}`}
          hint={data.problemsAttempted > 0 ? `${data.problemsAttempted} sudah dicoba` : "Belum ada percobaan"}
        />
        <Stat
          label="Materi selesai"
          value={`${data.lessonsDone}/${data.lessonsTotal}`}
        />
        <Stat
          label="Track berjalan"
          value={String(data.tracksInProgress)}
          hint="Sudah mulai, belum 100%"
        />
        <Stat
          label="Progress"
          value={`${data.percent}%`}
          hint={data.streak > 0 ? `Streak ${data.streak} hari` : "Streak 0 hari"}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-steel-border bg-steel p-5 lg:col-span-3">
          <h2 className="text-sm font-medium">Lanjutkan</h2>
          {data.continueItem ? (
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wide text-muted">{data.continueItem.trackTitle}</p>
              <p className="mt-1 text-lg font-medium">{data.continueItem.title}</p>
              <p className="mt-1 text-sm text-muted">{data.continueItem.hint}</p>
              <Link
                href={data.continueItem.href}
                className="mt-4 inline-flex rounded-md bg-ember px-3 py-1.5 text-sm font-medium text-black hover:bg-ember-soft"
              >
                Lanjut
              </Link>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Semua materi dan soal di seed ini sudah selesai.</p>
          )}
        </div>

        <div className="rounded-xl border border-steel-border bg-steel p-5 lg:col-span-2">
          <h2 className="text-sm font-medium">Fokus hari ini</h2>
          {data.focus.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Tidak ada item terbuka. Cek kurikulum.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.focus.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block rounded-md px-2 py-1.5 hover:bg-steel-raised">
                    <span className="text-sm">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{item.meta}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-steel-border bg-steel p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">Aktivitas 12 minggu</h2>
          <p className="text-xs text-muted">Jumlah pengumpulan per hari (data asli)</p>
        </div>
        <ActivityGrid days={data.activity} />
      </section>

      <section className="rounded-xl border border-steel-border bg-steel p-5">
        <h2 className="text-sm font-medium">Aktivitas terkini</h2>
        {data.recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Belum ada pengumpulan. Kerjakan soal pertama di Latihan.</p>
        ) : (
          <ul className="mt-3 divide-y divide-steel-border">
            {data.recent.map((item, i) => (
              <li key={`${item.href}-${item.at}-${i}`}>
                <Link href={item.href} className="flex items-center justify-between gap-3 py-2.5 hover:text-ember">
                  <span>
                    <span className="text-sm">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{formatWhen(item.at)}</span>
                  </span>
                  <span
                    className={`text-xs ${item.status === "passed" ? "text-good" : "text-bad"}`}
                  >
                    {STATUS[item.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-steel-border bg-steel p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function ActivityGrid({ days }: { days: { date: string; count: number }[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <div
        className="grid w-max grid-flow-col grid-rows-7 gap-1"
        style={{ gridTemplateRows: "repeat(7, 0.7rem)" }}
      >
        {days.map((day) => {
          const level = day.count === 0 ? 0 : day.count === 1 ? 1 : day.count === 2 ? 2 : day.count <= 4 ? 3 : 4;
          return (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} pengumpulan`}
              className="h-3 w-3 rounded-[3px]"
              style={{ background: `var(--heat-${level})` }}
            />
          );
        })}
      </div>
    </div>
  );
}
