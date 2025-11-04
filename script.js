const imagens = [
  'anya.jpg',
  'banguela.webp',
  'elsa.jpg',
  'luffy.jpg',
  'minions.jpg',
  'moana.jpg',
  'rapunzel.jpg',
  'stitch.png',
  'ironman.jpg',                 // 🆕 nova carta
  'spiderman.jpg'    // 🆕 nova carta
];

let primeiraCarta = null;
let segundaCarta = null;
let travar = false;
let tentativas = 0;
let tempo = 0;
let cronometro = null;

const tabuleiro = document.getElementById('gameBoard');
const tempoDisplay = document.getElementById('tempo');
const tentativasDisplay = document.getElementById('tentativas');

const somAcerto = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_8f0eb9de4e.mp3?filename=correct-2-46134.mp3');
const somErro = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_2cbe1e6e42.mp3?filename=wrong-answer-126515.mp3');

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function criarCartas() {
  const pares = [...imagens, ...imagens];
  const embaralhadas = embaralhar(pares);
  tabuleiro.innerHTML = '';

  embaralhadas.forEach(img => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front" style="background-image: url('imagens/${img}')"></div>
        <div class="card-back"></div>
      </div>
    `;
    card.addEventListener('click', virarCarta);
    tabuleiro.appendChild(card);
  });

  tentativas = 0;
  tempo = 0;
  atualizarHUD();

  clearInterval(cronometro);
  cronometro = setInterval(() => {
    tempo++;
    atualizarHUD();
  }, 1000);
}

function virarCarta() {
  if (travar || this.classList.contains('flipped')) return;

  this.classList.add('flipped');

  if (!primeiraCarta) {
    primeiraCarta = this;
  } else {
    segundaCarta = this;
    tentativas++;
    atualizarHUD();
    checarPar();
  }
}

function checarPar() {
  const img1 = primeiraCarta.querySelector('.card-front').style.backgroundImage;
  const img2 = segundaCarta.querySelector('.card-front').style.backgroundImage;

  if (img1 === img2) {
    somAcerto.play();
    primeiraCarta.classList.add('acerto');
    segundaCarta.classList.add('acerto');
    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);
    resetarSelecao();
    verificarFim();
  } else {
    travar = true;
    somErro.play();
    setTimeout(() => {
      primeiraCarta.classList.remove('flipped');
      segundaCarta.classList.remove('flipped');
      resetarSelecao();
    }, 1000);
  }
}

function resetarSelecao() {
  [primeiraCarta, segundaCarta, travar] = [null, null, false];
}

function verificarFim() {
  const todas = document.querySelectorAll('.card');
  const viradas = document.querySelectorAll('.flipped');
  if (todas.length === viradas.length) {
    clearInterval(cronometro);
    setTimeout(() => {
      alert(`🎉 Parabéns! Você completou o jogo em ${tempo}s e ${tentativas} tentativas!`);
      criarCartas();
    }, 800);
  }
}

function atualizarHUD() {
  tempoDisplay.textContent = `⏱️ Tempo: ${tempo}s`;
  tentativasDisplay.textContent = `🎮 Tentativas: ${tentativas}`;
}

criarCartas();



