'use client';

interface AirQualityProps {
  aqi: number;
  components: {
    co: number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
  };
}

export function AirQuality({ aqi, components }: AirQualityProps) {
  const getAQILabel = (aqi: number) => {
    switch (aqi) {
      case 1: return { text: 'Good', color: 'text-green-600 dark:text-green-400' };
      case 2: return { text: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' };
      case 3: return { text: 'Moderate', color: 'text-orange-600 dark:text-orange-400' };
      case 4: return { text: 'Poor', color: 'text-red-600 dark:text-red-400' };
      case 5: return { text: 'Very Poor', color: 'text-purple-600 dark:text-purple-400' };
      default: return { text: 'Unknown', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const { text, color } = getAQILabel(aqi);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Air Quality
      </h3>
      <div className={`text-2xl font-bold ${color}`}>
        {text}
      </div>
      <div className="mt-2 space-y-1 text-sm">
        <p className="text-gray-600 dark:text-gray-300">PM2.5: {components.pm2_5} μg/m³</p>
        <p className="text-gray-600 dark:text-gray-300">PM10: {components.pm10} μg/m³</p>
        <p className="text-gray-600 dark:text-gray-300">O₃: {components.o3} μg/m³</p>
        <p className="text-gray-600 dark:text-gray-300">NO₂: {components.no2} μg/m³</p>
        <p className="text-gray-600 dark:text-gray-300">CO: {components.co} μg/m³</p>
      </div>
    </div>
  );
} 