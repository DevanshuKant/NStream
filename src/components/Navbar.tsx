import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, User, Wifi, WifiOff } from 'lucide-react';
import type { Category } from '@/types/show';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface NavbarProps {
  onSearchOpen: () => void;
  onProfileOpen: () => void;
}

const navItems: { label: string; value: Category }[] = [
  { label: 'Home', value: 'home' },
  { label: 'TV Shows', value: 'tv-shows' },
  { label: 'Movies', value: 'movies' },
  { label: 'Video Games', value: 'video-games' },
];

const Navbar = ({ onSearchOpen, onProfileOpen }: NavbarProps) => {
  const { category, setCategory, user } = useApp();
  const { isOnline } = useOnlineStatus();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'netflix-gradient-top'}`}>
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold tracking-wider text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '2px' }}>
          NSTREAM
        </h1>
        <div className="flex items-center gap-6">
          {navItems.map(item => (
            <button
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={`text-sm font-medium transition-colors duration-200 ${
                category === item.value
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-xs">
          {isOnline ? (
            <Wifi className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
        <button onClick={onSearchOpen} className="text-foreground/80 hover:text-foreground transition-colors">
          <Search className="h-5 w-5" />
        </button>
        <button onClick={onProfileOpen} className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          {user && <span className="text-sm">{user}</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
