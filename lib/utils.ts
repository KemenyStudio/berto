import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get headers for API requests
export function getApiHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

// Get API URL
export function getApiUrl(endpoint: string): string {
  return endpoint;
}
