'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Check } from 'lucide-react';

export default function BookmarkButton({ anime }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!anime?.slug) return;
    try {
      const stored = localStorage.getItem('nekostream_bookmarks');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          setIsBookmarked(list.some(item => item.slug === anime.slug));
        }
      }
    } catch (_) {}
  }, [anime?.slug]);

  const toggleBookmark = () => {
    if (!anime?.slug) return;
    try {
      const stored = localStorage.getItem('nekostream_bookmarks');
      let list = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(list)) list = [];

      if (isBookmarked) {
        list = list.filter(item => item.slug !== anime.slug);
        setIsBookmarked(false);
      } else {
        list.push({
          slug: anime.slug,
          title: anime.title,
          poster_url: anime.poster_url,
          rating: anime.rating,
        });
        setIsBookmarked(true);
      }
      localStorage.setItem('nekostream_bookmarks', JSON.stringify(list));
    } catch (_) {}
  };

  return (
    <button
      onClick={toggleBookmark}
      type="button"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
        isBookmarked
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
      }`}
      title={isBookmarked ? 'Hapus dari daftar favorit' : 'Tambah ke daftar favorit'}
    >
      {isBookmarked ? (
        <>
          <Check className="w-4 h-4 text-amber-400" />
          <span>Tersimpan di Favorit</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4 text-slate-400" />
          <span>Simpan ke Favorit</span>
        </>
      )}
    </button>
  );
}
