import { gsap } from './gsap.js';

/* ============================================
   PALAVRA GIRATÓRIA (LOOP INFINITO)
   ============================================ */

/* TROCA UMA PALAVRA POR OUTRA DENTRO DE UM TEXTO, EM LOOP CONTÍNUO. DIFERENTE
   DO roulette-title.js (QUE REVELA O TÍTULO UMA VEZ SÓ, LETRA POR LETRA), ESTA
   FUNÇÃO ANIMA UM CICLO INFINITO DE PALAVRAS EMPILHADAS VERTICALMENTE.

   TÉCNICA: A PRIMEIRA PALAVRA É DUPLICADA NO FINAL DA FITA. QUANDO A ANIMAÇÃO
   CHEGA NESSA CÓPIA FINAL, A FITA É REPOSICIONADA NO TOPO (y:0) SEM TRANSIÇÃO
   VISÍVEL — PADRÃO USADO EM QUALQUER CARROSSEL/ROTATOR DE TEXTO INFINITO,
   EVITA O "PULO" DE VOLTA DA ÚLTIMA PALAVRA PARA A PRIMEIRA. */

/* RETORNA UMA FUNÇÃO kill() QUE PARA O LOOP. TAMBÉM A GUARDA EM el._wordFlipKill
   E, SE JÁ EXISTIR UMA DE UMA CHAMADA ANTERIOR SOBRE O MESMO ELEMENTO, MATA-A
   ANTES DE RECRIAR — ASSIM CHAMAR initWordFlip 2× NO MESMO EL (EX.: SE UM DIA
   FOR MOVIDA PRA DENTRO DO openOverlay) NÃO ACUMULA CADEIAS step() RODANDO EM
   PARALELO. INOFENSIVO NO FLUXO ATUAL (CHAMADA 1× NO BOOT), MAS BLINDA O FUTURO. */
export function initWordFlip(el, { interval = 2.2, duration = 0.6 } = {}) {
  // MATA QUALQUER LOOP ANTERIOR NESTE MESMO ELEMENTO ANTES DE RECRIAR
  if (typeof el._wordFlipKill === 'function') el._wordFlipKill();

  const words = (el.dataset.words || '').split(',').map((w) => w.trim()).filter(Boolean);
  if (words.length < 2) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // MONTA A FITA: PALAVRAS ORIGINAIS + CÓPIA DA PRIMEIRA NO FINAL
  const track = document.createElement('div');
  track.className = 'clv-sobre__flip-track';

  const loopWords = [...words, words[0]];
  loopWords.forEach((word) => {
    const line = document.createElement('span');
    line.className = 'clv-sobre__flip-word';
    line.textContent = word;
    track.appendChild(line);
  });

  el.textContent = '';
  el.appendChild(track);

  let alive = true;
  let posTween = null; // TWEEN DE POSIÇÃO (eixo Y) — MATÁVEL VIA kill()
  let widthTween = null; // TWEEN DE LARGURA DA JANELA — SINCRONIZADO COM O DE Y

  // MEDE E ANIMA SÓ DEPOIS QUE AS FONTES CARREGAM: MEDIR offsetWidth COM A FONTE
  // AINDA NÃO APLICADA DARIA LARGURAS ERRADAS (TEXTO MAIS ESTREITO/LARGO).
  const start = () => {
    if (!alive) return;

    const wordEls = Array.from(track.children);
    // LARGURA REAL DE CADA PALAVRA NA FITA (INCLUI A CÓPIA DUPLICADA NO FINAL)
    const widths = wordEls.map((w) => w.offsetWidth);

    // JANELA COMEÇA EXATAMENTE NA LARGURA DA PRIMEIRA PALAVRA (SEM ESPAÇO SOBRANDO)
    gsap.set(el, { width: widths[0] });

    if (reduce) return; // FICA PARADA NA PRIMEIRA PALAVRA, SEM LOOP

    const lineHeight = wordEls[0].offsetHeight;
    let index = 0;

    function step() {
      if (!alive) return;
      index += 1;

      // OS DOIS TWEENS COMPARTILHAM duration/delay/ease → RODAM SINCRONIZADOS:
      // A FITA SOBE ENQUANTO A JANELA "RESPIRA" (ENCOLHE/ESTICA) PARA A PRÓXIMA
      // LARGURA, SEM ESPAÇO SOBRANDO NEM "ao público" PULANDO.
      posTween = gsap.to(track, {
        y: -index * lineHeight,
        duration,
        ease: 'power1.inOut',
        delay: interval,
        onComplete: () => {
          if (index === loopWords.length - 1) {
            // CHEGOU NA CÓPIA FINAL (= PRIMEIRA PALAVRA): VOLTA AO TOPO SEM ANIMAR
            gsap.set(track, { y: 0 });
            index = 0;
          }
          step();
        },
      });

      widthTween = gsap.to(el, {
        width: widths[index],
        duration,
        ease: 'power1.inOut',
        delay: interval,
      });
    }

    step();
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    start();
  }

  // GUARDA/EXPÕE O kill(): PARA A CADEIA (alive=false) E MATA OS TWEENS PENDENTES
  // (POSIÇÃO E LARGURA), INCLUSIVE O delay/PAUSA AINDA NÃO INICIADO.
  const kill = () => {
    alive = false;
    if (posTween) posTween.kill();
    if (widthTween) widthTween.kill();
    delete el._wordFlipKill;
  };
  el._wordFlipKill = kill;
  return kill;
}
