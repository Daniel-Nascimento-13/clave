"use client";

import { useContext } from "react";
import { LenisContext } from "@/providers/SmoothScroll";

/** Access the active Lenis instance (null until mounted). */
export function useLenis() {
  return useContext(LenisContext);
}
