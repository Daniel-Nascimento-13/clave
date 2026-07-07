/* ============================================
   CONSTANTES — CONTATO WHATSAPP
   ============================================ */
export const WHATSAPP_NUMBER = "5551993607042";

export const WHATSAPP_MESSAGE =
  "Olá! Espero que esteja tudo bem.\n\n" +
  "Tenho interesse em anunciar com a Clave e gostaria de receber mais informações sobre as opções de divulgação disponíveis.\n\n" +
  "Aguardo seu retorno. Obrigado!";

export function getWhatsappLink(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}