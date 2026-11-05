import { KurikulumList } from "@/components/kurikulum-view";
import { getTrackTree } from "@/lib/content";

export default function KurikulumPage() {
  return <KurikulumList tree={getTrackTree()} />;
}
