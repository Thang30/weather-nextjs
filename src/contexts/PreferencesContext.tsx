'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UserPreferences, getUserPreferences, saveUserPreferences } from '@/utils/preferences';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  toggleTheme: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(getUserPreferences());

  useEffect(() => {
    // Initialize preferences from localStorage
    setPreferences(getUserPreferences());
  }, []);

  useEffect(() => {
    // Update document class when theme changes
    const isDark = preferences.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, [preferences.theme]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      saveUserPreferences(updated);
      return updated;
    });
  };

  const toggleTheme = () => {
    updatePreferences({
      theme: preferences.theme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, toggleTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
} 