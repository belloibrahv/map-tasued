import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  }
  return `${(distance / 1000).toFixed(1)}km`
}

export function formatTime(timeInMinutes: number): string {
  if (timeInMinutes < 60) {
    return `${Math.round(timeInMinutes)} min`
  }
  const hours = Math.floor(timeInMinutes / 60)
  const minutes = Math.round(timeInMinutes % 60)
  return `${hours}h ${minutes}m`
}