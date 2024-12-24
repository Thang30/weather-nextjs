'use client';

import { useCallback, useState } from 'react';
import { LocationHistoryItem } from '@/types';
import { getLocationHistory, removeFromLocationHistory, clearLocationHistory } from '@/utils/locationHistory';

interface LocationHistoryProps {
  onSelectLocation: (lat: number, lon: number) => void;
}

export function LocationHistory({ onSelectLocation }: LocationHistoryProps) {
  const [history, setHistory] = useState<LocationHistoryItem[]>(getLocationHistory());

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
        <h3 className="text-lg font-semibold">Location History</h3>
        <button
          onClick={handleClearHistory}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={`${item.lat}-${item.lon}-${item.timestamp}`}
            className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50"
          >
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => onSelectLocation(item.lat, item.lon)}
            >
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.country}</p>
              {item.lastWeather && (
                <p className="text-sm text-gray-600 mt-1">
                  Last: {item.lastWeather.temperature}°C, {item.lastWeather.condition}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveLocation(item.lat, item.lon);
              }}
              className="ml-2 text-gray-400 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 