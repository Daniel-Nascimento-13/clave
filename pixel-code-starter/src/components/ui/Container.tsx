// ==========================================================
// CONTAINER.TSX · COMPONENTE UI
// O QUE FAZ: DIV COM LARGURA MÁXIMA (1152PX), CENTRALIZADA E COM
//            PADDING LATERAL RESPONSIVO. USADO EM TODAS AS SECTIONS.
// QUANDO MEXER: QUASE NUNCA — SÓ SE MUDAR A LARGURA MÁXIMA DO LAYOUT.
// ==========================================================
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-6 md:px-12', className)}>
      {children}
    </div>
  );
}
