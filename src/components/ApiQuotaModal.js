'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, X, RefreshCw } from 'lucide-react';

export default function ApiQuotaModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsage = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usage');
      const json = await res.json();
      const d = json?.data || json;
      setUsageData(d);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const quota = usageData?.quota || usageData?.monthly || {};
  const rateLimit = usageData?.rate_limit || {};
  const planName = usageData?.plan || 'solo';
  const remaining = quota.remaining ?? 99900;
  const total = quota.limit ?? quota.quota ?? 100000;
  const used = quota.used ?? (total - remaining);
  const percentUsed = Math.min(100, Math.round((used / total) * 100));

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          fetchUsage();
        }}
        type="button"
        title="Status Kuota API Craftvel Network"
        className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 hover:border-emerald-500 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono">{remaining.toLocaleString()} req</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md glass-dropdown rounded-2xl p-6 border border-violet-900/50 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Craftvel API Health & Quota</h3>
                <p className="text-xs text-slate-400">Monitoring Kuota & Status Server Live</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Paket Akses</span>
                  <span className="px-2 py-0.5 rounded-md uppercase font-bold bg-violet-950 text-violet-300 border border-violet-800">
                    Tier {planName} (720p HD)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Sisa Kuota Bulanan</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {remaining.toLocaleString()} / {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-violet-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, percentUsed)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500">Rate Limit:</span>
                    <div className="font-semibold text-slate-200">
                      {rateLimit.limit || 60} req / menit
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Masa Berlaku Key:</span>
                    <div className="font-semibold text-emerald-300">
                      Aktif (7 Hari s.d. 3 Nov)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-800/40 text-xs text-violet-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Arsitektur Hemat Kuota (Zero Quota Mode) Aktif</span>
                </div>
                <p className="leading-relaxed text-[11px] text-slate-300">
                  Sesuai spesifikasi Craftvel API, seluruh katalog (Beranda, Ongoing, Tamat, Populer, Genre, Detail, Episodes) diakses secara publik <strong>tanpa mengonsumsi kuota API sama sekali</strong>. Kuota 100k Anda hanya terpakai saat pengguna memutar stream video atau mendownload episode.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={fetchUsage}
                  disabled={loading}
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Segarkan Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
