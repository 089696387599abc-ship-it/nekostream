'use client';

import React, { useState } from 'react';
import { useEnergy } from '@/context/EnergyContext';
import { Zap, Clock, Info, X } from 'lucide-react';

export default function EnergyBadge() {
  const { energy, maxEnergy, timeUntilReset } = useEnergy();
  const [showModal, setShowModal] = useState(false);

  const percentage = Math.round((energy / maxEnergy) * 100);
  const isLow = energy <= 3;
  const isEmpty = energy === 0;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
          isEmpty
            ? 'bg-red-950/60 text-red-400 border-red-800/80 animate-pulse'
            : isLow
            ? 'bg-amber-950/60 text-amber-300 border-amber-700/80'
            : 'bg-violet-950/50 text-violet-300 border-violet-700/60 hover:border-violet-500 hover:glow-purple'
        }`}
        title="Klik untuk melihat status energi harian kamu"
        type="button"
      >
        <Zap className={`w-3.5 h-3.5 fill-current ${isEmpty ? 'text-red-500' : 'text-amber-400'}`} />
        <span>
          {energy} <span className="opacity-60">/ {maxEnergy}</span>
        </span>
      </button>

      {/* Modal Info Energi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm glass-dropdown rounded-2xl p-6 border border-violet-900/50 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Sistem Energi Nonton</h3>
                <p className="text-xs text-slate-400">NekoStream Daily Quota</p>
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 mb-4">
              <div className="flex justify-between items-center mb-2 text-sm font-semibold">
                <span className="text-slate-300">Sisa Energi Hari Ini</span>
                <span className={isEmpty ? 'text-red-400' : 'text-amber-400'}>
                  {energy} / {maxEnergy}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-amber-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-violet-950/40 border border-violet-900/40 p-3 rounded-xl mb-4">
              <Clock className="w-4 h-4 text-violet-400 shrink-0" />
              <div>
                <span>Reset otomatis dalam: </span>
                <span className="font-mono font-bold text-amber-300">{timeUntilReset || '--:--:--'}</span>
                <span className="text-slate-400"> (00:00 WIB)</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 leading-relaxed mb-5">
              <div className="flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <span>Setiap menonton 1 video episode baru memotong 1 energi.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <span>Episode yang sama yang ditonton di hari yang sama gratis (tidak dipotong ganda).</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
