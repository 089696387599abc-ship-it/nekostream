import React from 'react';
import { fetchCraftvel } from '@/lib/craftvel';
import AnimeCard from '@/components/AnimeCard';
import { Sparkles, Flame } from 'lucide-react';

export const revalidate = 120;

export const metadata = {
  title: 'Anime Populer Teratas Sub Indo — NekoStream',
  description: 'Daftar anime terpopuler dengan rating tertinggi subtitle Indonesia di NekoStream.',
};

export default async function PopularPage() {
  let popularItems = [];

  try {
    const res = await fetchCraftvel('/v1/anime/popular?page=1&limit=36');
    const d = res?.data || res || {};
    popularItems = d.items || (Array.isArray(d) ? d : []);
  } catch (error) {
    console.error('Error fetching popular:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Katalog Anime Terpopuler
          </h1>
          <p className="text-xs text-slate-400">
            Pilihan anime terbaik dengan rating dan antusiasme penonton tertinggi di Craftvel Network
          </p>
        </div>
      </div>

      {popularItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {popularItems.map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 text-sm">
          Sedang menyiapkan katalog terpopuler...
        </div>
      )}
    </div>
  );
}
