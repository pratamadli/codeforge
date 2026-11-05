import { LatihanView } from "@/components/latihan-view";
import { getTrackTree } from "@/lib/content";

export default function LatihanPage() {
  return <LatihanView tree={getTrackTree()} />;
}
