// ============================================================
// FitFolk Local Storage Persistence Layer
// ============================================================

import type { DemoState } from '../types';

const STORAGE_KEY = 'fitfolk_demo_v4';
const STORAGE_VERSION = 4;

/**
 * Check if localStorage is available and working.
 * Handles private browsing, disabled storage, and quota issues.
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__fitfolk_storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load demo state from localStorage.
 * Returns null if no data exists, data is corrupted, or version mismatches.
 */
export function loadDemoState(): DemoState | null {
  if (!isStorageAvailable()) {
    console.warn('[FitFolk] localStorage is not available');
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    // Version check – reject stale or incompatible data
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      parsed.version !== STORAGE_VERSION
    ) {
      console.warn(
        '[FitFolk] Stored data version mismatch – clearing old data',
      );
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed as DemoState;
  } catch (error) {
    console.error('[FitFolk] Failed to parse stored state – clearing', error);
    // Corrupted data – remove it so fresh state can be created
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing we can do if removeItem also fails
    }
    return null;
  }
}

/**
 * Save demo state to localStorage.
 * Silently handles quota exceeded errors by logging a warning.
 */
export function saveDemoState(state: DemoState): void {
  if (!isStorageAvailable()) {
    console.warn('[FitFolk] localStorage is not available – state not saved');
    return;
  }

  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.code === 22 || // Legacy quota exceeded
        error.code === 1014 || // Firefox
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      console.warn(
        '[FitFolk] localStorage quota exceeded – state not saved. Consider resetting demo data.',
      );
    } else {
      console.error('[FitFolk] Failed to save state', error);
    }
  }
}

/**
 * Remove all FitFolk data from localStorage.
 */
export function resetDemoState(): void {
  if (!isStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[FitFolk] Failed to reset state', error);
  }
}
