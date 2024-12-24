'use client';

import { useState, useEffect } from 'react';
import { LocationData, LocationHistoryItem } from '@/types';
import { getLocationHistory } from '@/utils/locationHistory';
import { formatDistanceToNow } from 'date-fns';
import { TemperatureDisplay } from './UnitDisplay';

interface LocationHistoryProps {
  onSelectLocation: (location: LocationData) => Promise<void>;
}

export function LocationHistory({ onSelectLocation }: LocationHistoryProps) {
  const [history, setHistory] = useState<LocationHistoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setHistory(getLocationHistory());
    setIsClient(true);
  }, []);

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No location history yet
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
        Recent Locations
      </h3>
      <div className="space-y-2">
        {history.map((item: LocationHistoryItem) => (
          <button
            key={`${item.lat}-${item.lon}-${item.timestamp}`}
            onClick={() => onSelectLocation(item)}
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.country}
                </div>
              </div>
              {item.lastWeather && (
                <div className="text-right">
                  <div className="text-gray-900 dark:text-gray-100">
                    <TemperatureDisplay value={item.lastWeather.temperature} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.lastWeather.condition}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {formatDistanceToNow(item.timestamp)} ago
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 