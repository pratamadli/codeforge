import { getTrackTree } from "@/lib/data";

export type SearchHit = {
  href: string;
  title: string;
  kind: "track" | "lesson" | "problem";
  subtitle: string;
};

export async function getSearchCatalog(): Promise<SearchHit[]> {
  const tree = await getTrackTree();
  const hits: SearchHit[] = [];
  for (const track of tree) {
    hits.push({
      href: `/kurikulum/${track.slug}`,
      title: track.title,
      kind: "track",
      subtitle: "Kurikulum",
    });
    for (const mod of track.modules) {
      for (const lesson of mod.lessons) {
        hits.push({
          href: `/pelajaran/${lesson.slug}`,
          title: lesson.title,
          kind: "lesson",
          subtitle: `${track.title} · ${mod.title}`,
        });
      }
      for (const problem of mod.problems) {
        hits.push({
          href: `/soal/${problem.slug}`,
          title: problem.title,
          kind: "problem",
          subtitle: `${track.title} · ${problem.language.toUpperCase()}`,
        });
      }
    }
  }
  return hits;
}
