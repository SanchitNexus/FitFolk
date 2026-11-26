import { useState, useCallback } from 'react';

/**
 * Generic hook for reading and writing a value to localStorage.
 * Falls back to in-memory state if localStorage is unavailable.
 *
 * @example
 * const [name, setName] = useLocalStorage<string>('user_name', 'Guest');
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`[useLocalStorage] Failed to save "${key}"`, error);
      }
    },
    [key],
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
