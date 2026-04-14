import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Show, Category } from '@/types/show';

interface AppContextType {
  user: string | null;
  setUser: (u: string | null) => void;
  category: Category;
  setCategory: (c: Category) => void;
  watchlist: Show[];
  addToWatchlist: (s: Show) => void;
  removeFromWatchlist: (id: number) => void;
  watchHistory: Show[];
  addToHistory: (s: Show) => void;
  cachedShows: Show[];
  setCachedShows: (s: Show[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('home');
  const [watchlist, setWatchlist] = useState<Show[]>([]);
  const [watchHistory, setWatchHistory] = useState<Show[]>([]);
  const [cachedShows, setCachedShows] = useState<Show[]>([]);

  const addToWatchlist = useCallback((show: Show) => {
    setWatchlist(prev => prev.find(s => s.id === show.id) ? prev : [...prev, show]);
  }, []);

  const removeFromWatchlist = useCallback((id: number) => {
    setWatchlist(prev => prev.filter(s => s.id !== id));
  }, []);

  const addToHistory = useCallback((show: Show) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(s => s.id !== show.id);
      return [show, ...filtered];
    });
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser, category, setCategory,
      watchlist, addToWatchlist, removeFromWatchlist,
      watchHistory, addToHistory,
      cachedShows, setCachedShows,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
