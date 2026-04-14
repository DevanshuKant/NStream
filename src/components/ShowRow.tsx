import { useRef } from 'react';
import type { Show } from '@/types/show';
import ShowCard from './ShowCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShowRowProps {
  title: string;
  shows: Show[];
  onShowClick: (show: Show) => void;
}

const ShowRow = ({ title, shows, onShowClick }: ShowRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const amount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  if (shows.length === 0) return null;

  return (
    <div className="mb-8 group/row">
      <h2 className="text-lg font-semibold text-foreground mb-3 px-8">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 w-10 z-10 flex items-center justify-center bg-background/60 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-auto px-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shows.map((show, i) => (
            <ShowCard key={show.id} show={show} onClick={onShowClick} index={i} />
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 w-10 z-10 flex items-center justify-center bg-background/60 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ShowRow;
