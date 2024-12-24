import { LocationHistoryItem } from '@/types';

const LOCATION_HISTORY_KEY = 'weatherLocationHistory';
const MAX_HISTORY_ITEMS = 10;

export function getLocationHistory(): LocationHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  const history = localStorage.getItem(LOCATION_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export function addToLocationHistory(location: Omit<LocationHistoryItem, 'timestamp'>): void {
  const history = getLocationHistory();
  
  // Remove duplicate if exists (based on coordinates)
  const filteredHistory = history.filter(
    (item) => !(Math.abs(item.lat - location.lat) < 0.01 && Math.abs(item.lon - location.lon) < 0.01)
  );
  
  // Add new item at the beginning
  const newHistory = [
    { ...location, timestamp: Date.now() },
    ...filteredHistory
  ].slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(newHistory));
}

export function removeFromLocationHistory(lat: number, lon: number): void {
  const history = getLocationHistory();
  const filteredHistory = history.filter(
    (item) => !(Math.abs(item.lat - lat) < 0.01 && Math.abs(item.lon - lon) < 0.01)
  );
  localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(filteredHistory));
}

export function clearLocationHistory(): void {
  localStorage.setItem(LOCATION_HISTORY_KEY, '[]');
} 