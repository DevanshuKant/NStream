import type { Show, SearchResult } from '@/types/show';

const BASE_URL = 'https://api.tvmaze.com';

export const fetchAllShows = async (page: number = 0): Promise<Show[]> => {
  const res = await fetch(`${BASE_URL}/shows?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch shows');
  return res.json();
};

export const fetchAllShowsBulk = async (): Promise<Show[]> => {
  const pages = Array.from({ length: 42 }, (_, i) => i); // ~10,500 shows
  const results = await Promise.allSettled(pages.map(p => fetchAllShows(p)));
  const allShows: Show[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') allShows.push(...r.value);
  }
  return allShows;
};

export const searchShows = async (query: string): Promise<SearchResult[]> => {
  const res = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};

export const fetchShowById = async (id: number): Promise<Show> => {
  const res = await fetch(`${BASE_URL}/shows/${id}`);
  if (!res.ok) throw new Error('Failed to fetch show');
  return res.json();
};
