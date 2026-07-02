import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scrubbed vertical parallax tied to scroll position. */
export const parallax = (target: Element, speed = 0.3) => {
  return gsap.to(target, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: target,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
};
