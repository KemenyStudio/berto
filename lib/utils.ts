import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if we're running in Electron
export function isElectron(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for injected Electron identifier (most reliable)
  if ((window as any).__ELECTRON__) {
    return true;
  }
  
  // Fallback checks for Electron-specific properties
  return !!(
    window.navigator?.userAgent?.includes('Electron') ||
    (window as any).process?.type === 'renderer' ||
    (window as any).require ||
    (window as any).__dirname
  );
}

// Get headers for API requests (adds Electron identifier)
export function getApiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (isElectron()) {
    headers['X-Electron-App'] = 'true';
  }
  
  return headers;
}

// Get API URL with Electron parameter if needed
export function getApiUrl(endpoint: string): string {
  if (isElectron()) {
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${endpoint}${separator}electron=true`;
  }
  return endpoint;
}
