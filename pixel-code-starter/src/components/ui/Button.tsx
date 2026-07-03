// ==========================================================
// BUTTON.TSX · COMPONENTE UI
// O QUE FAZ: BOTÃO REUTILIZÁVEL COM VARIANTE "PRIMARY" (ÂMBAR SÓLIDO)
//            E "GHOST" (BORDA TRANSPARENTE). ACEITA QUALQUER ATRIBUTO HTML.
// QUANDO MEXER: TODA LP — ADICIONE NOVAS VARIANTES AQUI SE PRECISAR.
// ==========================================================
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
}

export default function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 cursor-pointer',
        variant === 'primary' && 'bg-amber text-bg hover:opacity-90',
        variant === 'ghost' && 'border border-fg/20 text-fg hover:border-fg/60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
