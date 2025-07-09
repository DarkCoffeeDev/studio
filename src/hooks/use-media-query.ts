// src/hooks/use-media-query.ts
"use client"; // Este hook debe ser un componente de cliente

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia(query);
      setMatches(mediaQueryList.matches);

      const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
      mediaQueryList.addEventListener('change', listener);

      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    }
    return undefined; // Return undefined if on server
  }, [query]);

  return matches;
}