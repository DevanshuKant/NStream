export interface Show {
  id: number;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  premiered: string | null;
  ended: string | null;
  rating: { average: number | null };
  image: { medium: string; original: string } | null;
  summary: string | null;
  network: { name: string } | null;
  webChannel: { name: string } | null;
}

export interface SearchResult {
  score: number;
  show: Show;
}

export type Category = 'home' | 'tv-shows' | 'movies' | 'video-games';
