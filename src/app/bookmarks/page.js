'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Clock, Trash2, Play } from 'lucide-react';
import { useEnergy } from '@/context/EnergyContext';

export default function BookmarksPage() {
  const { watchedToday } = useEnergy();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nekostream_bookmarks');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (_) {}
  }, []);

  const removeBookmark = (slug) => {
    const updated = bookmarks.filter((b) => b.slug !== slug);
    setBookmarks(updated);
    try {
      localStorage.setItem('nekostream_bookmarks', JSON.stringify(updated));
    } catch (_) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Riwayat Tontonan Hari Ini */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Riwayat Tonton Hari Ini</h1>
            <p className="text-xs text-slate-400">
              Episode yang ditonton hari ini (bebas ditonton kembali tanpa memotong energi)
            </p>
          </div>
        </div>

        {watchedToday.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {watchedToday.map((slug) => {
              const formattedTitle = slug
                .replace(/-sub-indo$/i, '')
                .replace(/-subtitle-indonesia$/i, '')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <Link
                  key={slug}
                  href={`/watch/${encodeURIComponent(slug)}`}
                  className="group p-3.5 rounded-xl bg-[#12141f] border border-slate-800 hover:border-violet-500 hover:bg-violet-950/20 transition-all flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                      {formattedTitle}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">Bebas Energi Hari Ini • Lanjutkan Menonton</span>
                  </div>
                  <Play className="w-4 h-4 text-slate-500 group-hover:text-violet-400 shrink-0 transition-colors" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 glass-panel rounded-xl">
            Belum ada video yang ditonton hari ini.
          </div>
        )}
      </section>

      {/* Anime Favorit */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Daftar Favorit</h2>
            <p className="text-xs text-slate-400">Koleksi serial anime yang kamu simpan</p>
          </div>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bookmarks.map((anime) => (
              <div
                key={anime.slug}
                className="relative rounded-xl overflow-hidden bg-[#12141f] border border-slate-800 group"
              >
                <Link href={`/anime/${encodeURIComponent(anime.slug)}`} className="block">
                  <div className="relative aspect-[3/4] w-full bg-slate-900">
                    <img
                      src={anime.poster_url}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-white line-clamp-1">{anime.title}</h3>
                  </div>
                </Link>
                <button
                  onClick={() => removeBookmark(anime.slug)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-red-400 hover:text-red-300"
                  title="Hapus dari favorit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 glass-panel rounded-xl">
            Belum ada anime di daftar favorit kamu.
          </div>
        )}
      </section>
    </div>
  );
}
