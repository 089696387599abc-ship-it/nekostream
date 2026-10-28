'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, PlayCircle, Film, CheckCircle2, Bookmark, Flame } from 'lucide-react';
import EnergyBadge from './EnergyBadge';
import ApiQuotaModal from './ApiQuotaModal';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <PlayCircle className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-violet-400 transition-colors">
              Neko<span className="text-violet-400">Stream</span>
            </span>
            <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Web.id
            </span>
          </div>
        </Link>

        {/* Navigation Links Desktop */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4 text-violet-400" />
            <span>Beranda</span>
          </Link>
          <Link
            href="/popular"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Populer</span>
          </Link>
          <Link
            href="/ongoing"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            <span>Ongoing</span>
          </Link>
          <Link
            href="/completed"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Tamat</span>
          </Link>
          <Link
            href="/genres"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <Film className="w-4 h-4 text-fuchsia-400" />
            <span>Genre</span>
          </Link>
          <Link
            href="/bookmarks"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Favorit</span>
          </Link>
        </nav>

        {/* Search Bar & Action Badges */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <form onSubmit={handleSearch} className="relative hidden sm:block w-48 lg:w-64">
            <input
              type="text"
              placeholder="Cari anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 text-sm text-white placeholder-slate-500 pl-9 pr-4 py-1.5 rounded-full border border-slate-700/60 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </form>

          {/* Mobile Search Icon */}
          <Link
            href="/search"
            className="sm:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* API Quota Widget */}
          <ApiQuotaModal />

          {/* Energy Quota Widget */}
          <EnergyBadge />
        </div>
      </div>
    </header>
  );
}
