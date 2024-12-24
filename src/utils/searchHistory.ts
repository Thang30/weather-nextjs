const HISTORY_KEY = 'weatherSearchHistory';
const MAX_HISTORY_ITEMS = 5;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  lat: number;
  lon: number;
}

export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export function addToSearchHistory(item: Omit<SearchHistoryItem, 'timestamp'>): void {
  const history = getSearchHistory();
  
  // Remove duplicate if exists
  const filteredHistory = history.filter(
    (historyItem) => historyItem.query.toLowerCase() !== item.query.toLowerCase()
  );
  
  // Add new item at the beginning
  const newHistory = [
    { ...item, timestamp: Date.now() },
    ...filteredHistory
  ].slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
}

export function clearSearchHistory(): void {
  localStorage.setItem(HISTORY_KEY, '[]');
} 