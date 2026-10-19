import React from 'react';
import Link from 'next/link';
import { PlayCircle, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#07080d] mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white">
                <PlayCircle className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white">
                Neko<span className="text-violet-400">Stream</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Platform streaming anime modern, cepat, dan responsif. Menonton anime subtitle Indonesia dengan kualitas gambar jernih dan navigasi episode yang mulus.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Didukung oleh Craftvel Anime Engine High-Bandwidth Gateway</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Navigasi</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-violet-400 transition-colors">
                  Beranda Anime
                </Link>
              </li>
              <li>
                <Link href="/ongoing" className="hover:text-violet-400 transition-colors">
                  Anime Ongoing (Rilis Terbaru)
                </Link>
              </li>
              <li>
                <Link href="/completed" className="hover:text-violet-400 transition-colors">
                  Anime Tamat (Completed)
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-violet-400 transition-colors">
                  Daftar Favorit & Riwayat
                </Link>
              </li>
            </ul>
          </div>

          {/* Daily Energy Info */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Aturan Layanan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>⚡ Kuota Harian: 12 Energi / Hari</li>
              <li>🕒 Reset: Pukul 00:00 WIB Setiap Hari</li>
              <li>📺 Resolusi: 360p, 480p, hingga 720p HD</li>
              <li>© {new Date().getFullYear()} NekoStream.web.id</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NekoStream — nekostream.web.id. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>untuk Komunitas Anime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
