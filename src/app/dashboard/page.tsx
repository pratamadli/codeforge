import { DashboardView } from "@/components/dashboard-view";
import { getTrackTree } from "@/lib/content";

export default function DashboardPage() {
  return <DashboardView tree={getTrackTree()} />;
}
