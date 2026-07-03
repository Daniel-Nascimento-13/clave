// ==========================================================
// SECTION.TSX · COMPONENTE UI
// O QUE FAZ: TAG <SECTION> COM PADDING VERTICAL PADRÃO (PY-24/32) E
//            PROP "ID" PARA ÂNCORAS DE NAVEGAÇÃO (#services, #faq, ETC).
//            REACT 19: ACEITA "REF" COMO PROP NORMAL (SEM FORWARDREF).
// QUANDO MEXER: QUASE NUNCA — SÓ SE MUDAR O ESPAÇAMENTO VERTICAL PADRÃO.
// ==========================================================
import { cn } from '@/lib/utils';
import type { ReactNode, Ref } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLElement>;
}

export default function Section({ id, children, className, ref }: SectionProps) {
  return (
    <section ref={ref} id={id} className={cn('py-24 md:py-32', className)}>
      {children}
    </section>
  );
}
