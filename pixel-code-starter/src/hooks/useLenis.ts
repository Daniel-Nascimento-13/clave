'use client';
// ==========================================================
// USELENIS.TS · HOOK
// O QUE FAZ: HOOK QUE RETORNA A INSTÂNCIA DO LENIS (SCROLL SUAVE)
//            PARA QUE COMPONENTES FILHOS POSSAM CONTROLAR O SCROLL VIA JS.
// QUANDO MEXER: QUASE NUNCA — SÓ SE PRECISAR PROGRAMAR SCROLL MANUAL.
// ==========================================================
import { useContext } from 'react';
import { LenisContext } from '@/providers/SmoothScroll';

export const useLenis = () => useContext(LenisContext);
