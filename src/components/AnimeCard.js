import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
import { normalizePosterUrl } from '@/lib/craftvel';
import { formatScore } from '@/lib/utils';

export default function AnimeCard({ anime }) {
  if (!anime) return null;

  const poster = normalizePosterUrl(anime.poster_url);
  const score = formatScore(anime.rating);
  const episodeText = anime.latest_episode
    ? `Ep ${anime.latest_episode}`
    : anime.episodes_count
    ? `${anime.episodes_count} Ep`
    : null;

  return (
    <Link
      href={`/anime/${encodeURIComponent(anime.slug)}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-[#12141f] border border-slate-800/80 hover:border-violet-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-950/30"
    >
      {/* Thumbnail Wrap */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
        <Image
          src={poster}
          alt={anime.title || 'Anime Poster'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-transparent to-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-950/80 text-violet-300 border border-violet-800/80 backdrop-blur-sm">
            {anime.type || 'TV'}
          </span>
          {anime.status && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold backdrop-blur-sm ${
                anime.status.toLowerCase() === 'ongoing'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                  : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
              }`}
            >
              {anime.status}
            </span>
          )}
        </div>

        {/* Rating Score Badge */}
        {score !== 'N/A' && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-amber-500/40 text-amber-300 text-[11px] font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{score}</span>
          </div>
        )}

        {/* Bottom Episode Badge */}
        {episodeText && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold">
            {episodeText}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <h3
          className="text-sm font-semibold text-slate-200 group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug"
          title={anime.title}
        >
          {anime.title}
        </h3>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>{anime.released_year || anime.year || ''}</span>
          <span className="group-hover:translate-x-0.5 transition-transform text-violet-400 font-medium">
            Tonton &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
