'use client';

import { useCallback, useState, useEffect } from 'react';
import { LocationHistoryItem } from '@/types';
import { getLocationHistory, removeFromLocationHistory, clearLocationHistory } from '@/utils/locationHistory';

interface LocationHistoryProps {
  onSelectLocation: (lat: number, lon: number) => void;
}

export function LocationHistory({ onSelectLocation }: LocationHistoryProps) {
  const [history, setHistory] = useState<LocationHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getLocationHistory());
  }, []);

  const handleRemoveLocation = useCallback((lat: number, lon: number) => {
    removeFromLocationHistory(lat, lon);
    setHistory(getLocationHistory());
  }, []);

  const handleClearHistory = useCallback(() => {
    clearLocationHistory();
    setHistory([]);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Location History
        </h3>
        <button
          onClick={handleClearHistory}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {history.map((item) => (
          <div
            key={`${item.lat}-${item.lon}-${item.timestamp}`}
            className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => onSelectLocation(item.lat, item.lon)}
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.country}
              </p>
              {item.lastWeather && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Last: {item.lastWeather.temperature}°C, {item.lastWeather.condition}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveLocation(item.lat, item.lon);
              }}
              className="ml-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
            >
              <span className="sr-only">Remove</span>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 