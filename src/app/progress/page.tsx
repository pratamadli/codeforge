import { ProgressView } from "@/components/progress-view";
import { getTrackTree } from "@/lib/content";

export default function ProgressPage() {
  return <ProgressView tree={getTrackTree()} />;
}
