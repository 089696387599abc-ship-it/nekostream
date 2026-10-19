import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EnergyProvider } from '@/context/EnergyContext';
import './globals.css';

export const metadata = {
  title: 'NekoStream — Nonton Anime Subtitle Indonesia Terlengkap',
  description: 'Streaming anime sub Indo online cepat, lancar tanpa jeda iklan dengan resolusi hingga 720p HD di nekostream.web.id.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nekostream.web.id'),
  openGraph: {
    title: 'NekoStream — Streaming Anime Sub Indo',
    description: 'Nonton anime ongoing & completed sub Indo gratis kualitas 720p HD.',
    url: 'https://nekostream.web.id',
    siteName: 'NekoStream',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-[#090a10] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-violet-600 selection:text-white">
        <EnergyProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </EnergyProvider>
      </body>
    </html>
  );
}
