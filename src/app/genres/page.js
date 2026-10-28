import React from 'react';
import Link from 'next/link';
import { fetchCraftvel } from '@/lib/craftvel';
import AnimeCard from '@/components/AnimeCard';
import { Tag, Sparkles } from 'lucide-react';

export const revalidate = 300;

export const metadata = {
  title: 'Jelajah Genre Anime — NekoStream',
  description: 'Daftar genre anime lengkap dari Aksi, Fantasi, Romantis, hingga Isekai di NekoStream.',
};

export default async function GenresPage({ searchParams }) {
  const { g } = (await searchParams) || {};
  let genres = [];
  let genreAnime = [];
  const currentGenre = g ? decodeURIComponent(g) : null;

  try {
    const genresRes = await fetchCraftvel('/v1/anime/genres');
    const d = genresRes?.data || genresRes || [];
    genres = Array.isArray(d) ? d : [];
  } catch (err) {
    console.error('Error fetching genres:', err);
  }

  if (currentGenre) {
    try {
      const animeRes = await fetchCraftvel(`/v1/anime/genres/${encodeURIComponent(currentGenre)}?page=1&limit=36`);
      const ad = animeRes?.data || animeRes || {};
      genreAnime = ad.items || (Array.isArray(ad) ? ad : []);
    } catch (err) {
      console.error(`Error fetching anime for genre ${currentGenre}:`, err);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Katalog Genre Anime
          </h1>
          <p className="text-xs text-slate-400">
            Jelajahi ribuan anime berdasarkan genre favoritmu dari Craftvel database
          </p>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const name = typeof genre === 'string' ? genre : genre.name;
          const count = typeof genre === 'object' ? genre.count : null;
          const isActive = currentGenre?.toLowerCase() === name.toLowerCase();

          return (
            <Link
              key={name}
              href={`/genres?g=${encodeURIComponent(name)}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/40'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-violet-500 hover:text-white'
              }`}
            >
              <span>{name}</span>
              {count && <span className="ml-1.5 opacity-60 text-[10px]">({count})</span>}
            </Link>
          );
        })}
      </div>

      {/* Genre Selected Anime List */}
      {currentGenre && (
        <section className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span>Anime dengan Genre &ldquo;{currentGenre}&rdquo;</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              {genreAnime.length} Judul Ditemukan
            </span>
          </div>

          {genreAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {genreAnime.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-sm glass-panel rounded-2xl">
              Belum ada anime untuk genre ini.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
