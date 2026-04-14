import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Show } from '@/types/show';
import ShowCard from './ShowCard';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onShowClick: (show: Show) => void;
  onSignOut: () => void;
}

const ProfilePanel = ({ isOpen, onClose, onShowClick, onSignOut }: ProfilePanelProps) => {
  const { user, watchlist, watchHistory } = useApp();

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
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded bg-primary flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user || 'Guest'}</h2>
                  <p className="text-sm text-muted-foreground">Profile</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Watchlist */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">My Watchlist</h3>
              {watchlist.length === 0 ? (
                <p className="text-muted-foreground text-sm">Your watchlist is empty. Add shows from the home page.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {watchlist.map(show => (
                    <ShowCard key={show.id} show={show} onClick={onShowClick} />
                  ))}
                </div>
              )}
            </section>

            {/* Watch History */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Watch History</h3>
              {watchHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm">No watch history yet.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {watchHistory.map(show => (
                    <ShowCard key={show.id} show={show} onClick={onShowClick} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePanel;
