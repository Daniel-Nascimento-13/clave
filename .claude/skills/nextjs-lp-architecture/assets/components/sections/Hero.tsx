// ==========================================================
// HERO · SECTION (Server Component)
// Reads typed content from /data/hero and hands it to HeroClient,
// which owns the DOM ref and animation. Edit copy in src/data/hero.ts.
// ==========================================================
import { hero } from "@/data/hero";
import HeroClient from "./HeroClient";

export default function Hero() {
  return <HeroClient {...hero} />;
}
