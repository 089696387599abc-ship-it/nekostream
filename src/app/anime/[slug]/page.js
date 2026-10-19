import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchCraftvel, normalizePosterUrl } from '@/lib/craftvel';
import { formatScore } from '@/lib/utils';
import { Star, Play, Clock, Tv, Calendar, Layers, ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const anime = await fetchCraftvel(`/services/anime/${slug}`);
    return {
      title: `${anime.title} Sub Indo — NekoStream`,
      description: anime.synopsis
        ? anime.synopsis.slice(0, 160)
        : `Nonton anime ${anime.title} subtitle Indonesia online terlengkap di NekoStream.`,
      openGraph: {
        title: `${anime.title} — NekoStream`,
        images: [normalizePosterUrl(anime.poster_url)],
      },
    };
  } catch (_) {
    return { title: 'Detail Anime — NekoStream' };
  }
}

export default async function AnimeDetailPage({ params }) {
  const { slug } = await params;
  let anime = null;

  try {
    anime = await fetchCraftvel(`/services/anime/${slug}`);
  } catch (error) {
    notFound();
  }

  if (!anime) notFound();

  const poster = normalizePosterUrl(anime.poster_url);
  const score = formatScore(anime.rating);
  const episodes = anime.episodes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header & Meta Detail Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* Poster Card */}
          <div className="w-48 sm:w-60 aspect-[3/4] relative shrink-0 rounded-xl overflow-hidden shadow-2xl border border-violet-500/20 mx-auto md:mx-0">
            <Image
              src={poster}
              alt={anime.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-violet-950/80 text-violet-300 border border-violet-800/80">
                  {anime.type || 'TV'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    anime.status?.toLowerCase() === 'ongoing'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                      : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                  }`}
                >
                  {anime.status || 'Completed'}
                </span>
                {score !== 'N/A' && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{score}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {anime.title}
              </h1>

              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-sm text-slate-400 mt-1 italic">{anime.title_english}</p>
              )}
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-violet-400" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Studio</div>
                  <div className="font-semibold text-slate-200">{anime.studio || '-'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Musim / Tahun</div>
                  <div className="font-semibold text-slate-200">
                    {anime.season || ''} {anime.year || anime.released_year || '-'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Total Episode</div>
                  <div className="font-semibold text-slate-200">{episodes.length} Episode</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Durasi Rata-rata</div>
                  <div className="font-semibold text-slate-200">~24 Menit</div>
                </div>
              </div>
            </div>

            {/* Genres */}
            {anime.genres && Array.isArray(anime.genres) && anime.genres.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                {anime.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-violet-500 transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Sinopsis
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl whitespace-pre-line text-justify md:text-left">
                  {anime.synopsis}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episode Selection Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Daftar Episode</h2>
              <p className="text-xs text-slate-400">Pilih episode untuk langsung mulai menonton streaming</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
            {episodes.length} Episode Tersedia
          </span>
        </div>

        {episodes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {episodes.map((ep) => {
              const epSlug = ep.stream_slug || ep.slug;
              const epNum = ep.episode_number || ep.number;
              return (
                <Link
                  key={epSlug}
                  href={`/watch/${encodeURIComponent(epSlug)}`}
                  className="group p-3 rounded-xl bg-[#12141f] border border-slate-800 hover:border-violet-500 hover:bg-violet-950/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-md bg-slate-800 group-hover:bg-violet-600 group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 transition-colors">
                      {epNum || '#'}
                    </div>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">
                      {ep.title || `Episode ${epNum}`}
                    </span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 shrink-0 transition-colors" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs glass-panel rounded-xl">
            Belum ada episode yang tersedia untuk anime ini.
          </div>
        )}
      </section>
    </div>
  );
}
