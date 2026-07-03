// ==========================================================
// ESLINT.CONFIG.MJS · CONFIGURAÇÃO DE LINTING
// O QUE FAZ: ATIVA AS REGRAS DO NEXT.JS (CORE WEB VITALS + TYPESCRIPT)
//            NO ESLINT E IGNORA PASTAS GERADAS (.NEXT, BUILD, OUT).
// QUANDO MEXER: QUASE NUNCA — CRIADO AUTOMATICAMENTE PELO CREATE-NEXT-APP.
// ==========================================================
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  //  Default ignores of eslint-config-next:
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
