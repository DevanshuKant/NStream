import type { Show } from '@/types/show';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Play } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface MoviePreviewProps {
  show: Show | null;
  onClose: () => void;
}

const MoviePreview = ({ show, onClose }: MoviePreviewProps) => {
  const { watchlist, addToWatchlist, removeFromWatchlist, addToHistory } = useApp();
  const isInWatchlist = show ? watchlist.some(s => s.id === show.id) : false;

  if (!show) return null;

  const summary = show.summary?.replace(/<[^>]+>/g, '') || 'No description available.';
  const bgImage = show.image?.original || show.image?.medium;

  const handlePlay = () => {
    addToHistory(show);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-center justify-center p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl rounded-lg overflow-hidden bg-card shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header image */}
          <div className="relative h-[350px]">
            {bgImage && (
              <img src={bgImage} alt={show.name} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-bold text-foreground text-shadow mb-3">{show.name}</h2>
              <div className="flex gap-3">
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-2 px-6 py-2.5 rounded bg-foreground text-background font-semibold text-sm hover:bg-foreground/80 transition-colors"
                >
                  <Play className="h-4 w-4 fill-current" /> Play
                </button>
                <button
                  onClick={() => isInWatchlist ? removeFromWatchlist(show.id) : addToWatchlist(show)}
                  className="h-10 w-10 rounded-full border-2 border-muted-foreground flex items-center justify-center hover:border-foreground transition-colors"
                >
                  {isInWatchlist ? <Check className="h-4 w-4 text-foreground" /> : <Plus className="h-4 w-4 text-foreground" />}
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 text-sm">
              {show.rating?.average && <span className="text-green-400 font-semibold">{show.rating.average} ★</span>}
              {show.premiered && <span className="text-muted-foreground">{show.premiered.slice(0, 4)}</span>}
              <span className="px-1.5 py-0.5 text-xs border border-muted-foreground rounded text-muted-foreground">{show.type}</span>
              {show.language && <span className="text-muted-foreground">{show.language}</span>}
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{summary}</p>
            <div className="text-xs text-muted-foreground space-y-1">
              {show.genres?.length > 0 && <p><span className="text-foreground/60">Genres:</span> {show.genres.join(', ')}</p>}
              {show.network && <p><span className="text-foreground/60">Network:</span> {show.network.name}</p>}
              {show.status && <p><span className="text-foreground/60">Status:</span> {show.status}</p>}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoviePreview;
