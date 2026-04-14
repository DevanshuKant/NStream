import type { Show } from '@/types/show';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroBannerProps {
  show: Show | null;
  onShowClick: (show: Show) => void;
}

const HeroBanner = ({ show, onShowClick }: HeroBannerProps) => {
  if (!show) return <div className="h-[70vh] bg-secondary animate-pulse" />;

  const bgImage = show.image?.original || show.image?.medium;
  const summary = show.summary?.replace(/<[^>]+>/g, '').slice(0, 200) || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-[70vh] w-full flex items-end"
    >
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
      )}
      <div className="relative z-10 px-8 pb-16 max-w-2xl">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <p className="text-primary font-semibold text-sm mb-2 tracking-widest uppercase">Today's Top Show</p>
          <h1 className="text-5xl font-bold text-foreground mb-4 text-shadow leading-tight">{show.name}</h1>
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            {show.rating?.average && <span className="text-green-400 font-semibold">{show.rating.average} ★</span>}
            {show.premiered && <span>{show.premiered.slice(0, 4)}</span>}
            {show.genres?.slice(0, 3).map(g => (
              <span key={g} className="px-2 py-0.5 rounded bg-secondary text-xs">{g}</span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{summary}...</p>
          <div className="flex gap-3">
            <button
              onClick={() => onShowClick(show)}
              className="flex items-center gap-2 px-6 py-2.5 rounded bg-foreground text-background font-semibold text-sm hover:bg-foreground/80 transition-colors"
            >
              <Play className="h-4 w-4 fill-current" /> Play
            </button>
            <button
              onClick={() => onShowClick(show)}
              className="flex items-center gap-2 px-6 py-2.5 rounded bg-secondary/80 text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
            >
              <Info className="h-4 w-4" /> More Info
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
