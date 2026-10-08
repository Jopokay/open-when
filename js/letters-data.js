/*
  Qui scrivi le lettere. Per ognuna:
  - title: titolo piccolo in cima alla carta
  - body: lista di paragrafi (ogni stringa = un paragrafo)
  - song: { title, artist, src } oppure null se non vuoi la canzone
    (metti i file mp3 in assets/audio/ e scrivi il percorso in src)
  Le chiavi (sad, miss-me, ...) devono coincidere con data-letter nell'HTML.
*/
window.SITE = {
  name: "[name]",        // il suo nome (sostituisce [name] nell'HTML)
  signature: "[your name]"  // il tuo nome (sostituisce [your name])
};

window.LETTERS = {
  "sad": {
    title: "Open when you're sad",
    body: [
      "I don't know what happened today, but I hope this helps a little.",
      "[Write the rest here.]"
    ],
    song: { title: "Song name", artist: "Artist", src: "assets/audio/sad.mp3" }
  },
  "cant-sleep": {
    title: "Open when you can't sleep",
    body: ["[Something quiet and calm.]"],
    song: { title: "Song name", artist: "Artist", src: "assets/audio/sleep.mp3" }
  },
  "miss-me": {
    title: "Open when you miss me",
    body: ["[Write your letter here.]"],
    song: { title: "Song name", artist: "Artist", src: "assets/audio/miss-me.mp3" }
  },
  "angry": {
    title: "Open when you're angry at me",
    body: [
      "Okay, before you decide to block me, hear me out...",
      "[Write the rest here.]"
    ],
    song: null
  },
  "pretty": {
    title: "Open when you don't feel pretty",
    body: ["[Write your letter here.]"],
    song: null
  },
  "song": {
    title: "Open when you need a song",
    body: ["[One line about why you picked it.]"],
    song: { title: "Song name", artist: "Artist", src: "assets/audio/song.mp3" }
  },
  "laugh": {
    title: "Open when you need to laugh",
    body: ["[A joke, a stupid story, anything.]"],
    song: null
  },
  "what-i-think": {
    title: "Open when you want to know what I think about you",
    body: ["[Write your letter here.]"],
    song: null
  },
  "birthday": {
    title: "Open on your birthday",
    body: ["[Write your letter here.]"],
    song: null
  },
  "100-days": {
    title: "Open on our 100th day",
    body: ["[Write your letter here.]"],
    song: null
  },
  "special": {
    title: "Something special",
    body: ["[Write your letter here.]"],
    song: null
  }
};