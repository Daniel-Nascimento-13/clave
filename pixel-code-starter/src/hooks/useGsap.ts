'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

// useLayoutEffect no client (evita FOUC), useEffect no server (SSR seguro).
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
