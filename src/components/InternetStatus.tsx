import { useState, useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InternetStatus = () => {
  const { isOnline } = useOnlineStatus();
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const [wasEverOffline, setWasEverOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasEverOffline(true);
    }
  }, [isOnline]);

  useEffect(() => {
    if (isOnline && wasEverOffline) {
      setShowOnlineBanner(true);
      const timer = setTimeout(() => setShowOnlineBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasEverOffline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="offline"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-primary py-2 text-primary-foreground text-sm font-medium"
        >
          <WifiOff className="h-4 w-4" />
          You are offline. Showing cached content.
        </motion.div>
      )}
      {showOnlineBanner && (
        <motion.div
          key="online"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 py-2 text-sm font-medium"
          style={{ background: 'hsl(142, 72%, 29%)', color: '#fff' }}
        >
          <Wifi className="h-4 w-4" />
          Back online. Content updated.
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InternetStatus;
