"use client";

import { useEffect, useState } from "react";

/**
 * Whether a CSS media query matches, such as `(max-width: 767px)`. It is null
 * until the browser has answered: the server cannot know the screen size, so the
 * first render has no answer and should not pick a layout from it.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}
