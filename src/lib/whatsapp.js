/* ============================================
   CONSTANTES — CONTATO WHATSAPP
   ============================================ */

export const WHATSAPP_NUMBER = "5551993607042";

export const WHATSAPP_CONTACT = "Artur"; // quem atende — troque aqui

export const WHATSAPP_GREETING = `Olá, ${WHATSAPP_CONTACT}! Tudo bem?`;

export const WHATSAPP_MESSAGE =
  `${WHATSAPP_GREETING}\n\nGostaria de saber mais sobre como anunciar com a CLAVE.`;

export function getWhatsappLink(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}