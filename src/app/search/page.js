'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnimeCard from '@/components/AnimeCard';
import { Search, Loader2 } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/anime/search?q=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (e) {
      console.error('Search error:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      doSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Cari Serial Anime
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Temukan anime favoritmu dari ribuan katalog subtitle Indonesia terlengkap
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            placeholder="Ketik judul anime (misal: One Piece, Solo Leveling, Naruto)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900/90 text-sm text-white placeholder-slate-500 pl-11 pr-28 py-3.5 rounded-2xl border border-slate-700/80 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-xl transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cari'}
          </button>
        </form>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <p className="text-xs">Mencari anime ke server Craftvel...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-base font-bold text-white">
                Hasil Pencarian: &ldquo;{query}&rdquo;
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-800">
                {results.length} Judul Ditemukan
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {results.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          </div>
        ) : hasSearched ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 max-w-lg mx-auto space-y-2">
            <p className="text-sm font-semibold text-slate-300">
              Tidak ditemukan anime dengan kata kunci &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs text-slate-500">
              Coba gunakan ejaan judul yang berbeda atau kata kunci yang lebih singkat.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-slate-500 text-xs">
          Memuat halaman pencarian...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
