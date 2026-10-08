document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SITE = window.SITE || {};
  const LETTERS = window.LETTERS || {};

  /* ---------- Nomi ---------- */
  if (SITE.name) {
    $(".home-title").textContent = `Hey, ${SITE.name}.`;
    $("#letter-greeting").textContent = `Dear ${SITE.name},`;
  }
  if (SITE.signature) $("#letter-signature").innerHTML = `Love,<br>${SITE.signature}`;

  /* ---------- Stelle di sfondo ---------- */
  const bg = $("#background");
  for (let i = 0; i < 55; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 6 + "s";
    s.style.animationDuration = 4 + Math.random() * 6 + "s";
    bg.appendChild(s);
  }

  /* ---------- Navigazione tra schermate ---------- */
  let current = null;

  async function show(name) {
    const next = $(`#screen-${name}`);
    if (!next || next === current) return;

    stopAudio();

    if (current) {
      current.classList.remove("is-visible");
      await wait(reduceMotion ? 0 : 450);
      current.hidden = true;
    }
    next.hidden = false;
    window.scrollTo(0, 0);
    next.getBoundingClientRect(); // forza il browser a "vedere" lo stato iniziale
    next.classList.add("is-visible");
    current = next;
  }

  $$("[data-go]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      show(el.dataset.go);
    })
  );

  /* ---------- 1. Loading ---------- */
  const phrases = [
    "checking memories...",
    "collecting stupid things...",
    "looking for something to make you smile...",
    "almost there...",
    "okay, found it."
  ];

  async function runLoader() {
    const fill = $("#loading-bar-fill");
    const pct = $("#loading-percent");
    const phrase = $("#loading-phrase");
    const bar = $(".loading-bar");
    const duration = reduceMotion ? 800 : 5500;
    const start = performance.now();
    let lastPhrase = -1;

    await new Promise((resolve) => {
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 2); // parte veloce, rallenta alla fine
        const value = Math.round(eased * 100);
        fill.style.width = value + "%";
        pct.textContent = value + "%";
        bar.setAttribute("aria-valuenow", value);

        const idx = Math.min(Math.floor(t * phrases.length), phrases.length - 1);
        if (idx !== lastPhrase) {
          lastPhrase = idx;
          phrase.textContent = phrases[idx];
        }
        t < 1 ? requestAnimationFrame(tick) : resolve();
      }
      requestAnimationFrame(tick);
    });

    phrase.textContent = "ready.";
    await wait(reduceMotion ? 100 : 900);
    show("home");
  }

  // La schermata di loading è l'unica visibile all'inizio
  current = $("#screen-loading");
  current.getBoundingClientRect();
  current.classList.add("is-visible");
  runLoader();

  /* ---------- 2. Home: check-in "how are you today?" ---------- */
  $$(".mood-button").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.dataset.letter) return openLetter(btn.dataset.letter, "home");
      const reply = $("#mood-reply");
      reply.hidden = true;
      reply.textContent = btn.dataset.reply;
      reply.getBoundingClientRect();
      reply.hidden = false; // riavvia l'animazione
    })
  );

  $("#finale-button").addEventListener("click", () => show("finale"));

  /* ---------- 3. Lettere: sblocco in base alla data ---------- */
  const today = new Date();
  const unlockDate = (card) => new Date(card.dataset.unlock + "T00:00:00");

  $$(".letter-card[data-locked='true']").forEach((card) => {
    if (unlockDate(card) <= today) {
      card.dataset.locked = "false";
      card.classList.remove("is-locked");
      $(".card-status", card).textContent = "open me";
    }
  });

  $$(".letter-card").forEach((card) =>
    card.addEventListener("click", () => {
      if (card.dataset.locked === "true") {
        const when = unlockDate(card).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
        $(".card-status", card).textContent = `🔒 opens on ${when}`;
        card.classList.remove("shake");
        card.getBoundingClientRect();
        card.classList.add("shake");
        return;
      }
      openLetter(card.dataset.letter);
    })
  );

  /* ---------- 4. Lettera: busta, testo, canzone ---------- */
  const envelope = $("#envelope");
  const paper = $("#letter-paper");
  const player = $("#player");
  const audio = $("#player-audio");
  const toggle = $("#player-toggle");
  const progress = $("#player-progress");
  let letterBackTo = "open-when";

  async function openLetter(id, backTo = "open-when") {
    const data = LETTERS[id];
    if (!data) return;
    letterBackTo = backTo;
    $("#screen-letter .back-button").dataset.go = backTo;

    // Riempio la carta
    $("#letter-title").textContent = data.title;
    $("#letter-body").innerHTML = "";
    data.body.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      $("#letter-body").appendChild(p);
    });
    setupPlayer(data.song);

    // Stato iniziale: busta chiusa, carta nascosta
    paper.hidden = true;
    envelope.hidden = false;
    envelope.classList.remove("is-open", "is-gone");

    await show("letter");

    // Sequenza: la busta si apre → sparisce → compare la lettera
    if (reduceMotion) {
      envelope.hidden = true;
      paper.hidden = false;
      return;
    }
    await wait(500);
    envelope.classList.add("is-open");
    await wait(1300);
    envelope.classList.add("is-gone");
    await wait(600);
    envelope.hidden = true;
    paper.hidden = false;
  }

  /* ---------- Player (niente autoplay) ---------- */
  function setupPlayer(song) {
    stopAudio();
    audio.removeAttribute("src");
    progress.value = 0;
    toggle.textContent = "▶";
    if (!song) {
      player.hidden = true;
      return;
    }
    player.hidden = false;
    $("#player-song").textContent = song.title;
    $("#player-artist").textContent = song.artist;
    audio.src = song.src;
  }

  function stopAudio() {
    if (!audio.paused) audio.pause();
    toggle.textContent = "▶";
  }

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        toggle.textContent = "❚❚";
        toggle.setAttribute("aria-label", "Pause");
      }).catch(() => {
        $(".player-label").textContent = "song file not found";
      });
    } else {
      stopAudio();
      toggle.setAttribute("aria-label", "Play");
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 100;
  });
  audio.addEventListener("ended", () => {
    toggle.textContent = "▶";
    progress.value = 0;
  });
  progress.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
  });
});