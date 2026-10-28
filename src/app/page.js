import React from 'react';
import Link from 'next/link';
import { fetchCraftvel } from '@/lib/craftvel';
import HeroBanner from '@/components/HeroBanner';
import AnimeCard from '@/components/AnimeCard';
import { PlayCircle, CheckCircle2, Flame, ArrowRight, Zap } from 'lucide-react';

export const revalidate = 60; // Refresh data setiap 60 detik (ISR)

export default async function HomePage() {
  let homeData = {
    popular_banner: [],
    ongoing: [],
    completed: [],
  };

  try {
    const res = await fetchCraftvel('/v1/anime/home');
    const d = res?.data || res || {};

    const ongoingList = Array.isArray(d.ongoing)
      ? d.ongoing
      : d.ongoing?.items || d.ongoing?.popular || [];

    const completedList = Array.isArray(d.completed)
      ? d.completed
      : d.completed?.items || [];

    const popularBanner = Array.isArray(d.popular_banner) && d.popular_banner.length > 0
      ? d.popular_banner
      : Array.isArray(d.popular_all)
      ? d.popular_all.slice(0, 10)
      : [];

    homeData = {
      popular_banner: popularBanner,
      ongoing: ongoingList,
      completed: completedList,
    };
  } catch (error) {
    console.error('Gagal memuat home data:', error.message);
  }

  const { popular_banner, ongoing, completed } = homeData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Hero Highlight Banner */}
      {popular_banner.length > 0 && <HeroBanner items={popular_banner} />}

      {/* Energy Info Alert Banner */}
      <div className="glass-panel rounded-xl p-4 border border-violet-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Sistem Kuota 12 Energi Nonton Harian</h4>
            <p className="text-xs text-slate-400">
              Setiap pengunjung mendapatkan 12 energi per hari yang di-reset otomatis setiap pergantian hari jam 00:00 WIB.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-950/60 text-violet-300 border border-violet-800/60 shrink-0">
          Limit: 12 Video / Hari
        </div>
      </div>

      {/* Section 1: Anime Ongoing Terbaru */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Episode Terbaru (Ongoing)
              </h2>
              <p className="text-xs text-slate-400">Rilisan episode anime yang sedang tayang musim ini</p>
            </div>
          </div>

          <Link
            href="/ongoing"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {ongoing.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {ongoing.slice(0, 18).map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            Sedang menyiapkan katalog ongoing...
          </div>
        )}
      </section>

      {/* Section 2: Anime Tamat (Completed) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Anime Tamat (Completed)
              </h2>
              <p className="text-xs text-slate-400">Maraton serial anime yang sudah selesai tamat</p>
            </div>
          </div>

          <Link
            href="/completed"
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {completed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {completed.slice(0, 12).map((anime) => (
              <AnimeCard key={anime.slug} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            Sedang menyiapkan katalog tamat...
          </div>
        )}
      </section>
    </div>
  );
}
