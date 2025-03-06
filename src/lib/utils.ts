import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs Class names to combine
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns theme-aware classes, replacing hardcoded dark colors with theme variables
 * @param baseClasses Base classes to apply
 * @param options Additional options like disabling theme awareness
 * @returns Theme-aware class string
 */
export function themeAwareClasses(
  baseClasses: string,
  options?: { disableThemeAwareness?: boolean }
) {
  if (options?.disableThemeAwareness) return baseClasses;

  // Replace hardcoded colors with theme variables
  return baseClasses
    .replace(/bg-black/g, "bg-background")
    .replace(/bg-zinc-800/g, "bg-secondary")
    .replace(/bg-zinc-900/g, "bg-secondary/90")
    .replace(/bg-zinc-700/g, "bg-secondary/80")
    .replace(/border-zinc-800/g, "border-border")
    .replace(/hover:bg-zinc-800/g, "hover:bg-secondary/90")
    .replace(/hover:bg-zinc-900/g, "hover:bg-secondary/80")
    .replace(/hover:bg-zinc-700/g, "hover:bg-secondary/70")
    .replace(/hover:bg-gray-800/g, "hover:bg-secondary")
    .replace(/hover:bg-gray-700/g, "hover:bg-secondary/90");
}
