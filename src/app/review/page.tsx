import { ReviewView } from "@/components/review-view";
import { getTrackTree } from "@/lib/content";

export default function ReviewPage() {
  return <ReviewView tree={getTrackTree()} />;
}
