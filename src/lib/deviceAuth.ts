// ============================================================
// FitFolk Device Authentication & Owner Authorization Service
// Ensures demo accounts and developer options are ONLY visible on THIS device
// and completely hidden when sharing links with any other user/device!
// ============================================================

const OWNER_FLAG_KEY = 'fitfolk_is_owner_device';

/**
 * Checks whether the current browser/device is recognized as the owner's device.
 * Returns true if:
 * 1. Running locally on this PC (localhost, 127.0.0.1, ::1)
 * 2. Unlocked via owner query parameter (?owner=true, ?dev=1, ?admin=true)
 * 3. Explicitly unlocked and persisted in this device's localStorage
 */
export function isOwnerDevice(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const hostname = window.location.hostname;
    // 1. Localhost / local development PC
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.endsWith('.localhost')
    ) {
      localStorage.setItem(OWNER_FLAG_KEY, 'true');
      return true;
    }

    // 2. Secret URL query parameter (allowing owner to activate on their phone)
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('owner') === 'true' ||
      params.get('admin') === 'true' ||
      params.get('dev') === '1'
    ) {
      localStorage.setItem(OWNER_FLAG_KEY, 'true');
      return true;
    }

    // 3. Persisted flag on this device
    return localStorage.getItem(OWNER_FLAG_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Explicitly enable owner mode on this device
 */
export function enableOwnerDevice(): void {
  try {
    localStorage.setItem(OWNER_FLAG_KEY, 'true');
  } catch {}
}

/**
 * Explicitly disable owner mode on this device
 */
export function disableOwnerDevice(): void {
  try {
    localStorage.removeItem(OWNER_FLAG_KEY);
  } catch {}
}
