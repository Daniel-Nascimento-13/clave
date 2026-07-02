// Above-the-fold entrance: runs immediately on mount (no ScrollTrigger,
// since the hero is already in view), and respects prefers-reduced-motion.
import { gsap } from "gsap";

export function heroReveal(scope: HTMLElement) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from(scope.querySelectorAll("[data-reveal]"), {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.15,
      });
  });
}
