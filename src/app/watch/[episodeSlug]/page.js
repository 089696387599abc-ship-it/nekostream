import React from 'react';
import { notFound } from 'next/navigation';
import { fetchCraftvel } from '@/lib/craftvel';
import VideoPlayer from '@/components/VideoPlayer';

export async function generateMetadata({ params }) {
  const { episodeSlug } = await params;
  try {
    const res = await fetchCraftvel(`/v1/anime/episodes/${episodeSlug}/stream`);
    const stream = res?.data || res;
    const animeTitle = stream.anime?.title || 'Anime';
    const epNum = stream.episode?.number ? `Episode ${stream.episode.number}` : 'Episode';
    return {
      title: `Nonton ${animeTitle} — ${epNum} Sub Indo — NekoStream`,
      description: `Streaming ${animeTitle} ${epNum} subtitle Indonesia resolusi 720p HD lancar di NekoStream.`,
    };
  } catch (_) {
    return { title: 'Nonton Streaming — NekoStream' };
  }
}

export default async function WatchPage({ params }) {
  const { episodeSlug } = await params;
  let streamData = null;

  try {
    const res = await fetchCraftvel(`/v1/anime/episodes/${episodeSlug}/stream`);
    streamData = res?.data || res;
  } catch (error) {
    notFound();
  }

  if (!streamData) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <VideoPlayer streamData={streamData} episodeSlug={episodeSlug} />
    </div>
  );
}
