'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useEnergy } from '@/context/EnergyContext';
import {
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertTriangle,
  Zap,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { normalizeStreamUrl } from '@/lib/craftvel';

export default function VideoPlayer({ streamData, episodeSlug }) {
  const { energy, hasEnergy, consumeEnergy, timeUntilReset, watchedToday } = useEnergy();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('720');
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [energyBlocked, setEnergyBlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Mendukung resolusi dari Craftvel v1 (streamData.resolutions) maupun legacy format (streamData.streams)
  const rawResolutions = streamData?.resolutions || streamData?.streams || {};
  const base480 = rawResolutions['480']?.url || null;
  const base720 = rawResolutions['720']?.url || null;
  const direct360 = rawResolutions['360']?.url || null;

  // Resolusi 360p fallback ke 480p atau 720p jika server upstream menandai 360 unavailable
  const streams = {
    '360': {
      available: Boolean(direct360 || base480 || base720),
      url: direct360 || base480 || base720,
      isFallback: !direct360 && Boolean(base480 || base720),
      locked: false,
    },
    '480': {
      available: Boolean(base480 || base720),
      url: base480 || base720,
      isFallback: !base480 && Boolean(base720),
      locked: false,
    },
    '720': {
      available: Boolean(base720 || base480),
      url: base720 || base480,
      isFallback: false,
      locked: false,
    },
    '1080': {
      available: false,
      url: null,
      locked: true,
      required_plan: 'pro',
    },
  };

  const downloads = streamData?.downloads || [];
  const anime = streamData?.anime || {};
  const episode = streamData?.episode || {};
  const episodesList = streamData?.episodes || [];
  const prevEp = streamData?.prev_episode;
  const nextEp = streamData?.next_episode;

  const isAlreadyWatched = watchedToday.includes(episodeSlug);

  // Tentukan kualitas awal yang tersedia (utamakan 720, 480, lalu 360)
  useEffect(() => {
    if (streams['720']?.available && streams['720']?.url) {
      setSelectedQuality('720');
    } else if (streams['480']?.available && streams['480']?.url) {
      setSelectedQuality('480');
    } else if (streams['360']?.available && streams['360']?.url) {
      setSelectedQuality('360');
    }
  }, [streamData]);

  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Resume waktu tonton terakhir dari localStorage
  useEffect(() => {
    if (!episodeSlug) return;
    try {
      const savedTime = localStorage.getItem(`progress_${episodeSlug}`);
      if (savedTime && videoRef.current) {
        const t = parseFloat(savedTime);
        if (!isNaN(t) && t > 5) {
          videoRef.current.currentTime = t;
        }
      }
    } catch (_) {}
  }, [episodeSlug]);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !episodeSlug) return;
    const cur = videoRef.current.currentTime;
    try {
      localStorage.setItem(`progress_${episodeSlug}`, cur.toString());
    } catch (_) {}
  };

  // Keyboard shortcut listener (Space = play/pause, ArrowLeft/Right = 10s skip, F = Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (!videoRef.current) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (videoRef.current.paused) {
          handlePlayAttempt();
        } else {
          videoRef.current.pause();
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(videoRef.current.duration || 99999, videoRef.current.currentTime + 10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEnergy, isAlreadyWatched]);

  // Handle Play dengan Gating Energi
  const handlePlayAttempt = () => {
    // Jika belum pernah ditonton hari ini dan energi 0, blokir
    if (!isAlreadyWatched && !hasEnergy) {
      setEnergyBlocked(true);
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    if (!hasStartedPlaying) {
      const allowed = consumeEnergy(episodeSlug);
      if (!allowed) {
        setEnergyBlocked(true);
        if (videoRef.current) videoRef.current.pause();
        return;
      }
      setHasStartedPlaying(true);
    }

    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const activeStream = streams[selectedQuality];
  const activeStreamUrl = normalizeStreamUrl(activeStream?.url);
  const isDirectAvailable = activeStream?.available && activeStreamUrl && !activeStream?.locked;

  // Pergantian Kualitas tanpa me-reset durasi video
  const handleQualityChange = (res) => {
    if (streams[res]?.locked) return;
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      setSelectedQuality(res);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = cur;
          if (isPlaying) videoRef.current.play();
        }
      }, 100);
    } else {
      setSelectedQuality(res);
    }
  };

  return (
    <div className={`space-y-6 transition-all duration-300 ${isTheaterMode ? 'max-w-7xl mx-auto' : ''}`}>
      {/* Top Navigation & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-xl border border-slate-800">
        <div>
          <Link
            href={`/anime/${encodeURIComponent(anime.slug || '')}`}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 mb-1"
          >
            &larr; Detail {anime.title}
          </Link>
          <h1 className="text-base sm:text-lg font-bold text-white">
            {anime.title} — Episode {episode.number || ''}
          </h1>
        </div>

        {/* Energy Status Tag */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              type="button"
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isTheaterMode
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Mode Layar Lebar (Theater Mode)"
            >
              {isTheaterMode ? 'Mode Normal' : 'Mode Bioskop'}
            </button>

            <div
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${
                isAlreadyWatched
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  : 'bg-violet-950/60 text-violet-300 border-violet-800/80'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>
                {isAlreadyWatched ? 'Sudah Ditonton (Gratis)' : `Energi: ${energy}/12`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Wrapper */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center group">
        {/* State: Energi Habis Modal Block */}
        {energyBlocked ? (
          <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Energi Nonton Hari Ini Habis (0/12)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              Kamu telah menggunakan seluruh 12 energi nonton untuk hari ini. Energi harian akan diisi penuh kembali secara otomatis saat pergantian hari.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-950/60 border border-violet-700/60 text-xs font-semibold text-amber-300">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Reset dalam: </span>
              <span className="font-mono font-bold text-white">{timeUntilReset || '--:--:--'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              💡 Tip: Kamu tetap bisa menonton ulang episode yang sudah kamu tonton hari ini tanpa dipotong energi!
            </p>
          </div>
        ) : isDirectAvailable ? (
          /* HTML5 Video Player dengan Direct MP4 Stream */
          <video
            ref={videoRef}
            src={activeStreamUrl}
            controls
            playsInline
            preload="metadata"
            onPlay={handlePlayAttempt}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-contain"
          >
            Browser Anda tidak mendukung pemutar video HTML5.
          </video>
        ) : (
          /* Fallback jika stream direct belum tersedia dari server */
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Media Stream Sedang Diproses
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              File video direct untuk episode ini sedang dalam antrean sinkronisasi server Craftvel. Silakan gunakan link unduhan di bawah atau pilih episode lain.
            </p>
          </div>
        )}
      </div>

      {/* Player Quality Selector & Navigation Controls */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quality Switcher Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400">Kualitas:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['360', '480', '720', '1080'].map((res) => {
                const s = streams[res];
                const isLocked = s?.locked || res === '1080';
                const isAvail = s?.available && s?.url && !isLocked;
                const isActive = res === selectedQuality;

                return (
                  <button
                    key={res}
                    type="button"
                    onClick={() => handleQualityChange(res)}
                    disabled={isLocked || !isAvail}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-600/40'
                        : isLocked
                        ? 'bg-slate-900/50 text-slate-600 border border-slate-800 cursor-not-allowed'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    title={
                      isLocked
                        ? 'Khusus Paket Pro'
                        : !isAvail
                        ? 'Tidak tersedia'
                        : s?.isFallback
                        ? `Putar ${res}p (Dioptimasi dari resolusi tersedia)`
                        : `Ganti ke ${res}p`
                    }
                  >
                    {res === '1080' ? '1080p FHD (Pro)' : `${res}p`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prev / Next Episode Buttons */}
          <div className="flex items-center gap-2">
            {prevEp ? (
              <Link
                href={`/watch/${encodeURIComponent(prevEp.slug || prevEp.stream_slug)}`}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Ep {prevEp.episode_number || prevEp.number}</span>
              </Link>
            ) : (
              <button
                disabled
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-slate-600 cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Ep Sebelumnya</span>
              </button>
            )}

            {nextEp ? (
              <Link
                href={`/watch/${encodeURIComponent(nextEp.slug || nextEp.stream_slug)}`}
                className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-colors flex items-center gap-1 shadow-md shadow-violet-700/30"
              >
                <span>Ep {nextEp.episode_number || nextEp.number}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                disabled
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-slate-600 cursor-not-allowed flex items-center gap-1"
              >
                <span>Ep Terakhir</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Episode Grid Drawer */}
        {episodesList.length > 0 && (
          <div className="pt-3 border-t border-slate-800/80">
            <h3 className="text-xs font-semibold text-slate-400 mb-2">Pilih Episode Lain:</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {episodesList.map((ep) => {
                const epSlug = ep.stream_slug || ep.slug;
                const epNum = ep.episode_number || ep.number;
                const isCurrent = epSlug === episodeSlug;

                return (
                  <Link
                    key={epSlug}
                    href={`/watch/${encodeURIComponent(epSlug)}`}
                    className={`p-2 rounded-lg text-center text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-700/40'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {epNum}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Download Options (Jika ada) */}
      {downloads && Array.isArray(downloads) && downloads.length > 0 && (
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Tautan Unduh Episode (MP4)</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {downloads.map((dl, idx) => (
              <a
                key={idx}
                href={dl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/80 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>{dl.quality || dl.resolution || 'MP4'}</span>
                <span className="text-[10px] opacity-70">({dl.server || 'Direct'})</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
