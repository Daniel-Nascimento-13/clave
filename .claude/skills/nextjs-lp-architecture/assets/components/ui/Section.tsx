import { cn } from "@/lib/utils";
import type { ReactNode, Ref } from "react";

// React 19: ref is a normal prop — no forwardRef, no wrapper div needed.
interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLElement>;
}

/** Vertical rhythm wrapper. Pass id for anchor nav, ref to scope animations. */
export default function Section({ id, children, className, ref }: SectionProps) {
  return (
    <section ref={ref} id={id} className={cn("py-24 md:py-32", className)}>
      {children}
    </section>
  );
}
