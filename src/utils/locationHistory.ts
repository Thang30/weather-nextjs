'use client';

import { LocationHistoryItem } from '@/types';

const HISTORY_KEY = 'weatherLocationHistory';
const MAX_HISTORY_ITEMS = 5;

export function getLocationHistory(): LocationHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to parse location history:', error);
    return [];
  }
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
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
}

export function removeFromLocationHistory(lat: number, lon: number): void {
  const history = getLocationHistory();
  const filteredHistory = history.filter(
    (item) => !(Math.abs(item.lat - lat) < 0.01 && Math.abs(item.lon - lon) < 0.01)
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
}

export function clearLocationHistory(): void {
  localStorage.setItem(HISTORY_KEY, '[]');
} 