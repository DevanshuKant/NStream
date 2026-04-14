import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { searchShows } from '@/services/api';
import { useApp } from '@/context/AppContext';
import type { Show, SearchResult } from '@/types/show';
import ShowCard from './ShowCard';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onShowClick: (show: Show) => void;
}

const SearchOverlay = ({ isOpen, onClose, onShowClick }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const { cachedShows } = useApp();

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const doSearch = async () => {
      setLoading(true);
      try {
        // Try online search first
        const data = await searchShows(debouncedQuery);
        setResults(data);
      } catch {
        // Fallback to cached data for offline
        const q = debouncedQuery.toLowerCase();
        const filtered = cachedShows
          .filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.id.toString().includes(q) ||
            (s.premiered && s.premiered.startsWith(q))
          )
          .slice(0, 20)
          .map(show => ({ score: 1, show }));
        setResults(filtered);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [debouncedQuery, cachedShows]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md overflow-y-auto"
        >
          <div className="max-w-5xl mx-auto px-8 pt-6">
            <div className="flex items-center gap-4 mb-8">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title, year, or ID..."
                className="flex-1 bg-transparent text-2xl text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {loading && (
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-[160px] h-[230px] rounded bg-secondary animate-pulse" />
                ))}
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {results.map(r => (
                  <ShowCard key={r.show.id} show={r.show} onClick={onShowClick} />
                ))}
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <p className="text-muted-foreground text-center mt-20">No results found for "{query}"</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
