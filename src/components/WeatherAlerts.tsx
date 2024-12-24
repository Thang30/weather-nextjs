'use client';

import { WeatherAlert } from '@/types';
import { formatTime } from '@/utils/dateUtils';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  if (!alerts?.length) return null;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Weather Alerts
      </h3>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={`${alert.event}-${index}`}
            className={`p-4 rounded-lg ${
              alert.severity === 'extreme'
                ? 'bg-red-100 dark:bg-red-900'
                : alert.severity === 'severe'
                ? 'bg-orange-100 dark:bg-orange-900'
                : 'bg-yellow-100 dark:bg-yellow-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`font-semibold ${
                  alert.severity === 'extreme'
                    ? 'text-red-800 dark:text-red-100'
                    : alert.severity === 'severe'
                    ? 'text-orange-800 dark:text-orange-100'
                    : 'text-yellow-800 dark:text-yellow-100'
                }`}>
                  {alert.event}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  From {formatTime(alert.start)} to {formatTime(alert.end)}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                alert.severity === 'extreme'
                  ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100'
                  : alert.severity === 'severe'
                  ? 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                  : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
              }`}>
                {alert.severity}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
              {alert.description}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Issued by {alert.senderName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 