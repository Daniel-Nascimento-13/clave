import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealTarget = string | Element | Element[];

/**
 * On-scroll entrance (fade + slide up, staggered). Pass the elements to
 * animate and an optional trigger element (defaults to the first target).
 * Fires when the trigger hits "top 85%" of the viewport.
 */
export const reveal = (targets: RevealTarget, trigger?: Element | string) => {
  return gsap.from(targets, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: (trigger ??
        (Array.isArray(targets) ? targets[0] : targets)) as Element | string,
      start: "top 85%",
    },
  });
};
