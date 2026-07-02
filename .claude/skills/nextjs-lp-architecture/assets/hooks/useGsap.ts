"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

// useLayoutEffect on the client (prevents FOUC on above-the-fold animations),
// useEffect on the server (SSR-safe, no React warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Runs GSAP animations scoped to the returned ref, with automatic cleanup.
 *   const scope = useGsap<HTMLElement>(() => reveal(scope.current!));
 *   return <section ref={scope}>...</section>;
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: gsap.Context) => void,
  deps: React.DependencyList = []
) {
  const scope = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(setup, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
