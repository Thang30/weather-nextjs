'use client';

import { ForecastData } from '@/types';
import { TemperatureDisplay } from '@/components/UnitDisplay';
import { formatDay, formatTime } from '@/utils/dateUtils';

interface ForecastDisplayProps {
  forecast: ForecastData;
}

export function ForecastDisplay({ forecast }: ForecastDisplayProps) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forecast.list.map((item) => (
          <div 
            key={item.dt}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formatDay(item.dt)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatTime(item.dt)}
                </p>
              </div>
              <img 
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
                className="w-12 h-12"
              />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                <TemperatureDisplay value={item.temp} />
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                {item.weather[0].description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 