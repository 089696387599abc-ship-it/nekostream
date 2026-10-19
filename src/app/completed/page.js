import React from 'react';
import { fetchCraftvel } from '@/lib/craftvel';
import AnimeCard from '@/components/AnimeCard';
import { CheckCircle2 } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Anime Tamat (Completed) Sub Indo — NekoStream',
  description: 'Daftar serial anime yang sudah selesai tamat (completed) subtitle Indonesia di NekoStream.',
};

export default async function CompletedPage() {
  let completedItems = [];

  try {
    const data = await fetchCraftvel('/services/anime/completed?page=1&limit=36');
    completedItems = data.items || [];
  } catch (error) {
    console.error('Error fetching completed:', error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Katalog Anime Tamat (Completed)
          </h1>
          <p className="text-xs text-slate-400">
            Koleksi serial anime yang sudah tamat, siap untuk maraton dari awal hingga akhir
          </p>
        </div>
      </div>

      {completedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {completedItems.map((anime) => (
            <AnimeCard key={anime.slug} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 text-sm">
          Sedang menyiapkan katalog tamat...
        </div>
      )}
    </div>
  );
}
