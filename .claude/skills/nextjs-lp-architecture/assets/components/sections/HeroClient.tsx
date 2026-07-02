"use client";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useGsap } from "@/hooks/useGsap";
import { heroReveal } from "@/animations/hero";
import { cn } from "@/lib/utils";
import type { HeroContent } from "@/types";

export default function HeroClient({
  headlineStart,
  headlineGradient,
  headlineSuffix,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: HeroContent) {
  // Hero is above the fold → immediate entrance via heroReveal.
  const scope = useGsap<HTMLElement>(() => heroReveal(scope.current!));

  return (
    <section ref={scope} id="hero" className="flex min-h-screen items-center py-24">
      <Container>
        <h1
          data-reveal
          className={cn(
            "font-display text-5xl font-bold leading-tight text-fg sm:text-6xl md:text-7xl"
          )}
        >
          {headlineStart}{" "}
          <span className="text-gradient-brand">{headlineGradient}</span>
          <br />
          {headlineSuffix}
        </h1>

        <p data-reveal className="mt-6 max-w-xl text-lg text-fg/60">
          {subtitle}
        </p>

        <div data-reveal className="mt-8 flex flex-wrap gap-4">
          <Button variant="primary">{ctaPrimary}</Button>
          <Button variant="ghost">{ctaSecondary}</Button>
        </div>
      </Container>
    </section>
  );
}
