import React from 'react';
import { fetchCraftvel } from '@/lib/craftvel';
import AnimeCard from '@/components/AnimeCard';
import { PlayCircle } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Anime Ongoing Sub Indo Terbaru — NekoStream',
  description: 'Daftar anime yang sedang tayang (ongoing) musim ini dengan subtitle Indonesia terlengkap di NekoStream.',
};

export default async function OngoingPage() {
  let ongoingItems = [];

  try {
    const res = await fetchCraftvel('/v1/anime/ongoing?page=1&limit=36');
    const d = res?.data || res || {};
    ongoingItems = d.items || (Array.isArray(d) ? d : []);
  } catch (error) {
    console.error('Error fetching ongoing:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
          <PlayCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Katalog Anime Ongoing
          </h1>
          <p className="text-xs text-slate-400">
            Daftar serial anime yang sedang tayang saat ini dan update setiap minggu
          </p>
        </div>
      </div>

      {ongoingItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {ongoingItems.map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 text-sm">
          Sedang menyiapkan katalog ongoing...
        </div>
      )}
    </div>
  );
}
