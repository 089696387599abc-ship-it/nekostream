'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const MAX_ENERGY = 12;
const STORAGE_KEY = 'nekostream_user_energy_v1';
const HISTORY_KEY = 'nekostream_watched_episodes_v1';

const EnergyContext = createContext({
  energy: MAX_ENERGY,
  maxEnergy: MAX_ENERGY,
  timeUntilReset: '',
  consumeEnergy: () => true,
  hasEnergy: true,
  watchedToday: [],
});

export function EnergyProvider({ children }) {
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [watchedToday, setWatchedToday] = useState([]);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  // Dapatkan string tanggal lokal YYYY-MM-DD
  const getTodayDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  // Muat status energi dari localStorage
  useEffect(() => {
    const today = getTodayDateString();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setEnergy(typeof parsed.energy === 'number' ? parsed.energy : MAX_ENERGY);
        } else {
          // Hari baru: reset otomatis ke 12 energi
          const freshData = { date: today, energy: MAX_ENERGY };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
          setEnergy(MAX_ENERGY);
        }
      } else {
        const initialData = { date: today, energy: MAX_ENERGY };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        setEnergy(MAX_ENERGY);
      }

      // Muat riwayat tontonan hari ini
      const historyStored = localStorage.getItem(HISTORY_KEY);
      if (historyStored) {
        const historyParsed = JSON.parse(historyStored);
        if (historyParsed.date === today && Array.isArray(historyParsed.episodes)) {
          setWatchedToday(historyParsed.episodes);
        } else {
          localStorage.setItem(HISTORY_KEY, JSON.stringify({ date: today, episodes: [] }));
          setWatchedToday([]);
        }
      }
    } catch (e) {
      console.warn('Gagal memuat energy/history dari localStorage:', e);
    }
  }, []);

  // Hitung mundur waktu reset harian (ke 00:00:00)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diffMs = tomorrow.getTime() - now.getTime();

      if (diffMs <= 0) {
        // Reset energi instan jika pergantian hari terjadi saat user membuka web
        const today = getTodayDateString();
        setEnergy(MAX_ENERGY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, energy: MAX_ENERGY }));
        localStorage.setItem(HISTORY_KEY, JSON.stringify({ date: today, episodes: [] }));
        setWatchedToday([]);
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fungsi konsumsi 1 energi
  const consumeEnergy = (episodeSlug) => {
    const today = getTodayDateString();

    // Jika episode ini sudah pernah diputar hari ini, jangan kurangi energi lagi (Smart Re-watch)
    if (episodeSlug && watchedToday.includes(episodeSlug)) {
      return true;
    }

    if (energy <= 0) {
      return false;
    }

    const nextEnergy = Math.max(0, energy - 1);
    setEnergy(nextEnergy);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, energy: nextEnergy }));

    if (episodeSlug) {
      const nextWatched = [...watchedToday, episodeSlug];
      setWatchedToday(nextWatched);
      localStorage.setItem(HISTORY_KEY, JSON.stringify({ date: today, episodes: nextWatched }));
    }

    return true;
  };

  return (
    <EnergyContext.Provider
      value={{
        energy,
        maxEnergy: MAX_ENERGY,
        timeUntilReset,
        consumeEnergy,
        hasEnergy: energy > 0,
        watchedToday,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  return useContext(EnergyContext);
}
