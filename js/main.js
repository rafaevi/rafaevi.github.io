// ================= CONFIGURAÇÕES =================
// PLACEHOLDER: troque pela data/hora oficial do casamento (fuso -03:00).
const WEDDING_DATE = '2027-01-23T16:00:00-03:00';

// TODO: colocar aqui a URL do Web App do Google Apps Script (ex.: https://script.google.com/macros/s/XXXX/exec).
// Enquanto estiver vazio, a confirmação é apenas simulada.
const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw31no-fzuNMxX2EOndzspyQ4MTqUnRRtAIPzCrTtYeHJ-awtvekuTp96ZiKAOQV9b2JQ/exec';
// =================================================

// Contagem regressiva
(function () {
  const alvo = new Date(WEDDING_DATE).getTime();
  const el = id => document.getElementById(id);
  function tick() {
    let d = Math.max(0, alvo - Date.now()) / 1000;
    el('cd-dias').textContent = Math.floor(d / 86400);
    el('cd-horas').textContent = Math.floor(d % 86400 / 3600);
    el('cd-min').textContent = Math.floor(d % 3600 / 60);
    el('cd-seg').textContent = Math.floor(d % 60);
  }
  tick(); setInterval(tick, 1000);
})();

// Menu mobile
(function () {
  const btn = document.querySelector('.nav-toggle');
  const ul = document.querySelector('.nav-links');
  btn.addEventListener('click', () => {
    const open = ul.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  ul.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ul.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
  }));
})();

// Confirmação de presença
(function () {
  const form = document.getElementById('rsvp-form');
  const input = document.getElementById('nome');
  const msg = document.getElementById('rsvp-msg');
  const ok = document.getElementById('rsvp-success');
  const grid = form.parentElement;
  const btn = form.querySelector('button');
  const msgPadrao = msg.textContent;
  grid.classList.add('solo');

  async function enviar(nome) {
    if (!RSVP_ENDPOINT) {
      await new Promise(r => setTimeout(r, 600)); // simulação
      return { ok: true, nome, mensagem: '' };
    }
    // text/plain evita preflight CORS no Apps Script
    const res = await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ nome })
    });
    return res.json(); // esperado: { ok, nome, mensagem }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nome = input.value.trim();
    if (!nome) return;
    btn.disabled = true; btn.textContent = 'Confirmando...';
    msg.classList.remove('err'); msg.textContent = msgPadrao;
    try {
      const r = await enviar(nome);
      if (r && r.ok) {
        document.getElementById('rsvp-nome').textContent = r.nome || nome;
        grid.classList.remove('solo');
        ok.hidden = false;
        if (r.mensagem) msg.textContent = r.mensagem;
      } else {
        msg.classList.add('err');
        msg.textContent = (r && r.mensagem) || 'Não encontramos seu nome na lista. Confira como está no convite.';
      }
    } catch (err) {
      msg.classList.add('err');
      msg.textContent = 'Ops, algo deu errado. Tente novamente em instantes.';
    } finally {
      btn.disabled = false; btn.textContent = 'Confirmar presença';
    }
  });
})();

// Copiar chave Pix (só dígitos)
(function () {
  const el = document.getElementById('pix-key');
  const chave = (el.dataset.pix || el.textContent).replace(/\D/g, '');
  document.querySelectorAll('.copy-pix').forEach(b => {
    const original = b.innerHTML;
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(chave); b.textContent = 'Copiado!'; }
      catch (e) { b.textContent = 'Chave: ' + chave; }
      b.classList.add('copied');
      setTimeout(() => { b.innerHTML = original; b.classList.remove('copied'); }, 2000);
    });
  });
})();
