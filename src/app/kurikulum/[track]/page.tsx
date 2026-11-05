import { notFound } from "next/navigation";
import { TrackView } from "@/components/kurikulum-view";
import { getTrackBySlug } from "@/lib/content";

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: slug } = await params;
  const track = getTrackBySlug(slug);
  if (!track) notFound();
  return <TrackView track={track} />;
}
