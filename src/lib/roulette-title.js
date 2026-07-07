/* ============================================
   ROLETA DE TÍTULO — REUTILIZÁVEL
   ============================================ */
import { gsap } from "gsap";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const REEL_LENGTH = 8;

function measureCharWidth(ch, font, letterSpacing) {
  const span = document.createElement("span");
  span.style.cssText = "position:absolute;visibility:hidden;white-space:pre;top:-9999px;";
  span.style.font = font;
  span.style.letterSpacing = letterSpacing;
  span.textContent = ch;
  document.body.appendChild(span);
  const w = span.getBoundingClientRect().width;
  document.body.removeChild(span);
  return w;
}

export function animateRouletteTitle(el, { stagger = 0.05, duration = 0.7, gap = "-0.02em" } = {}) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const text = el.textContent;
  if (reduce) return;

  const computed = getComputedStyle(el);
  el.setAttribute("aria-label", text);
  el.textContent = "";
  el.style.letterSpacing = gap;

  const cols = [];
  const words = text.split(" ");

  words.forEach((word, wi) => {
    const wordWrap = document.createElement("span");
    wordWrap.style.cssText = "display:inline-block;white-space:nowrap;";

    word.split("").forEach((ch) => {
      const charWidth = measureCharWidth(ch, computed.font, gap);

      const wrap = document.createElement("span");
      wrap.style.cssText = `display:inline-block;overflow:hidden;height:1.2em;vertical-align:top;width:${charWidth}px;`;
      wrap.setAttribute("aria-hidden", "true");

      const col = document.createElement("div");
      col.style.cssText = "display:flex;flex-direction:column;align-items:center;";
      for (let i = 0; i < 8; i++) {
        const s = document.createElement("span");
        s.textContent = i === 7 ? ch : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
        s.style.cssText = "height:1.2em;line-height:1.2em;";
        col.appendChild(s);
      }
      wrap.appendChild(col);
      wordWrap.appendChild(wrap);
      cols.push(col);
    });

    el.appendChild(wordWrap);
    if (wi < words.length - 1) {
      el.appendChild(document.createTextNode(" "));
    }
  });

  gsap.set(cols, { y: 0 });
  cols.forEach((col, i) => {
    gsap.to(col, {
      y: "-8.4em",
      duration,
      delay: i * stagger,
      ease: "power3.out",
    });
  });
}