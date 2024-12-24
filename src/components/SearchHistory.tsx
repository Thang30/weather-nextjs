import { useCallback } from 'react';
import { SearchHistoryItem, getSearchHistory, clearSearchHistory } from '@/utils/searchHistory';

interface SearchHistoryProps {
  onSelectLocation: (lat: number, lon: number) => void;
}

export function SearchHistory({ onSelectLocation }: SearchHistoryProps) {
  const history = getSearchHistory();

  const handleClearHistory = useCallback(() => {
    clearSearchHistory();
    // Force re-render
    window.location.reload();
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Recent Searches</h3>
        <button
          onClick={handleClearHistory}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear History
        </button>
      </div>
      <ul className="space-y-2">
        {history.map((item: SearchHistoryItem) => (
          <li
            key={item.timestamp}
            className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelectLocation(item.lat, item.lon)}
          >
            <span>{item.query}</span>
            <span className="text-sm text-gray-500">
              {new Date(item.timestamp).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
} 