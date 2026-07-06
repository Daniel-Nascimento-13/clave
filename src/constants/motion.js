// ============================================
// CONSTANTES DE MOVIMENTO — SEM NÚMEROS MÁGICOS
// ============================================
export const DURATIONS = { sm: 0.8, md: 1.0, lg: 1.2 };
export const EASE = { primary: "power3.out", expo: "expo.out" };
export const STAGGER = 0.2;

// ============================================
// DIFERENCIAIS — REVEAL
// ============================================
export const DIFERENCIAIS = {
  start: "top 75%",
  duration: 1.0,      // premium (0.8–1.2)
  ease: "expo.out",
  stagger: 0.24,      // entrada sequencial (câmera)
  revealX: 70,        // deslocamento lateral (px) — sinal alterna por índice
};