// ==========================================================
// UTILS.TS · UTILITÁRIO
// O QUE FAZ: EXPORTA A FUNÇÃO "CN" QUE USA CLSX + TAILWIND-MERGE
//            PARA COMBINAR CLASSES TAILWIND SEM CONFLITOS DE PRIORIDADE.
// QUANDO MEXER: QUASE NUNCA — INFRAESTRUTURA INTERNA DO PROJETO.
// ==========================================================
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
