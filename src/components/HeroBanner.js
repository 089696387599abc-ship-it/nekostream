'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { normalizePosterUrl } from '@/lib/craftvel';
import { formatScore } from '@/lib/utils';

export default function HeroBanner({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex] || items[0];
  const poster = normalizePosterUrl(current.poster_url);
  const score = formatScore(current.rating);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-violet-900/30 mb-10 shadow-2xl">
      {/* Background Ambience Banner Blur */}
      <div className="absolute inset-0 z-0 overflow-hidden" style={{ position: 'absolute' }}>
        <Image
          src={poster}
          alt={current.title || 'Hero Banner'}
          fill
          className="object-cover opacity-25 filter blur-2xl scale-110"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090a10] via-[#090a10]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center gap-8">
        {/* Left Poster (Desktop) */}
        <div className="relative w-44 sm:w-56 aspect-[3/4] shrink-0 rounded-xl overflow-hidden shadow-2xl border border-violet-500/30 group">
          <Image
            src={poster}
            alt={current.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            priority
          />
          {score !== 'N/A' && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{score}</span>
            </div>
          )}
        </div>

        {/* Right Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-700/60 text-violet-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Highlight Populer Terkini</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {current.title}
          </h1>

          {current.title_english && current.title_english !== current.title && (
            <p className="text-sm text-slate-400 font-medium italic">{current.title_english}</p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-slate-300">
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 font-semibold uppercase">
              {current.type || 'TV'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">
              {current.status || 'Ongoing'}
            </span>
            {current.latest_episode && (
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-violet-300 font-semibold">
                Episode Terkini: {current.latest_episode}
              </span>
            )}
            {/* Genre Pills */}
            {(() => {
              const genres = current.genres || current.genre || [];
              const list = Array.isArray(genres) ? genres : typeof genres === 'string' ? genres.split(',') : [];
              return list.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-md bg-violet-950/70 border border-violet-800/60 text-violet-300 font-medium"
                >
                  {typeof g === 'string' ? g.trim() : g}
                </span>
              ));
            })()}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl line-clamp-3">
            Tonton episode anime terbaru sub Indo dengan kualitas jernih hingga 720p HD tanpa lag di platform streaming NekoStream.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              href={`/anime/${encodeURIComponent(current.slug)}`}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-violet-700/30 hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Nonton</span>
            </Link>

            <Link
              href={`/anime/${encodeURIComponent(current.slug)}`}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              <span>Detail Info</span>
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="hidden lg:flex flex-col gap-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-lg bg-slate-800/70 hover:bg-violet-600 text-white transition-colors"
            title="Anime Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-lg bg-slate-800/70 hover:bg-violet-600 text-white transition-colors"
            title="Anime Selanjutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
