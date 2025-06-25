import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if we're running in Electron
export function isElectron(): boolean {
  return false;
}

// Get headers for API requests (adds Electron identifier)
export function getApiHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

// Get API URL with Electron parameter if needed
export function getApiUrl(endpoint: string): string {
  return endpoint;
}
