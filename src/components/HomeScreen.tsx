import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchAllShowsBulk } from '@/services/api';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import type { Show } from '@/types/show';
import HeroBanner from './HeroBanner';
import ShowRow from './ShowRow';
import Navbar from './Navbar';
import SearchOverlay from './SearchOverlay';
import MoviePreview from './MoviePreview';
import ProfilePanel from './ProfilePanel';
import InternetStatus from './InternetStatus';

const HomeScreen = () => {
  const { category, setUser, cachedShows, setCachedShows } = useApp();
  const { isOnline } = useOnlineStatus();
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  useEffect(() => {
    const load = async () => {
      if (cachedShows.length > 0) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchAllShowsBulk();
        setCachedShows(data);
      } catch {
        console.warn('Failed to fetch shows, using cached data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [cachedShows.length, setCachedShows]);

  // Re-fetch when coming back online
  useEffect(() => {
    if (isOnline && cachedShows.length > 0) {
      fetchAllShowsBulk().then(data => setCachedShows(data)).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const filteredShows = useMemo(() => {
    if (category === 'home') return cachedShows;
    if (category === 'tv-shows') return cachedShows.filter(s => s.type === 'Scripted' || s.type === 'Reality' || s.type === 'Talk Show' || s.type === 'Documentary');
    if (category === 'movies') return cachedShows.filter(s => s.type === 'Animation' || s.type === 'Variety');
    if (category === 'video-games') return cachedShows.filter(s => s.genres?.includes('Action') || s.genres?.includes('Science-Fiction'));
    return cachedShows;
  }, [cachedShows, category]);

  const heroShow = useMemo(() => {
    const topRated = [...filteredShows].filter(s => s.rating?.average && s.image?.original).sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    return topRated[0] || null;
  }, [filteredShows]);

  const categorizedRows = useMemo(() => {
    const genreMap: Record<string, Show[]> = {};
    filteredShows.forEach(show => {
      show.genres?.forEach(genre => {
        if (!genreMap[genre]) genreMap[genre] = [];
        if (genreMap[genre].length < 40) genreMap[genre].push(show);
      });
    });

    const topRated = [...filteredShows].filter(s => s.rating?.average).sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)).slice(0, 40);
    const recent = [...filteredShows].filter(s => s.premiered).sort((a, b) => (b.premiered || '').localeCompare(a.premiered || '')).slice(0, 40);

    const rows: { title: string; shows: Show[] }[] = [
      { title: 'Top Rated', shows: topRated },
      { title: 'Recently Added', shows: recent },
    ];

    Object.entries(genreMap).slice(0, 10).forEach(([genre, shows]) => {
      rows.push({ title: genre, shows });
    });

    return rows;
  }, [filteredShows]);

  const handleShowClick = useCallback((show: Show) => {
    setSelectedShow(show);
    setSearchOpen(false);
    setProfileOpen(false);
  }, []);

  const handleSignOut = useCallback(() => {
    setUser(null);
    setProfileOpen(false);
  }, [setUser]);

  return (
    <div className="min-h-screen bg-background">
      <InternetStatus />
      <Navbar onSearchOpen={() => setSearchOpen(true)} onProfileOpen={() => setProfileOpen(true)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} onShowClick={handleShowClick} />
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} onShowClick={handleShowClick} onSignOut={handleSignOut} />
      <MoviePreview show={selectedShow} onClose={() => setSelectedShow(null)} />

      <HeroBanner show={heroShow} onShowClick={handleShowClick} />

      <div className="relative z-10 -mt-16 pb-16">
        {loading ? (
          <div className="px-8 space-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-5 w-40 bg-secondary rounded mb-3 animate-pulse" />
                <div className="flex gap-2">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div key={j} className="w-[160px] h-[230px] bg-secondary rounded animate-pulse flex-shrink-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          categorizedRows.map(row => (
            <ShowRow key={row.title} title={row.title} shows={row.shows} onShowClick={handleShowClick} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
