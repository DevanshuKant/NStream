import { memo, useRef, useEffect, useState } from 'react';
import type { Show } from '@/types/show';
import { motion } from 'framer-motion';

interface ShowCardProps {
  show: Show;
  onClick: (show: Show) => void;
  index?: number;
}

const ShowCard = memo(({ show, onClick, index = 0 }: ShowCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const imgUrl = show.image?.medium || `https://via.placeholder.com/210x295/141414/e50914?text=${encodeURIComponent(show.name.slice(0, 10))}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.2) }}
      className="relative flex-shrink-0 w-[160px] cursor-pointer card-hover group"
      onClick={() => onClick(show)}
    >
      {isVisible ? (
        <>
          <img
            src={imgUrl}
            alt={show.name}
            className="w-full h-[230px] object-cover rounded"
            loading="lazy"
          />
          <div className="absolute inset-0 rounded bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-xs font-semibold text-foreground truncate">{show.name}</p>
              {show.rating?.average && (
                <p className="text-[10px] text-green-400 font-medium">{show.rating.average} ★</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[230px] rounded bg-secondary animate-pulse" />
      )}
    </motion.div>
  );
});

ShowCard.displayName = 'ShowCard';
export default ShowCard;
