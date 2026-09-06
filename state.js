(function () {
  "use strict";
  window.SpanishRPG = window.SpanishRPG || {};

  function freshState() {
    return {
      schemaVersion: 1,
      gameId: "misterio-salamanca",
      savedAt: null,
      player: { name: "", characterId: null, xp: 0, coins: 5 },
      chapter: "vertical-slice",
      scene: "start",
      introIndex: 0,
      location: "plaza",
      playerPosition: 18,
      quest: { id: "blue-folder", status: "not_started", steps: { lucia: false, cafe: false, bookshop: false, deduction: false } },
      unlockedLocations: ["plaza"],
      inventory: [],
      clues: [],
      decisions: {},
      conversations: {},
      achievements: [],
      languageProgress: { politeRequest: false, readingPrices: false, descriptions: false, directions: false },
      hintsUsed: 0,
      ending: null
    };
  }

  function normalise(candidate) {
    if (!candidate || typeof candidate !== "object") throw new Error("El archivo no contiene una partida válida.");
    if (candidate.gameId !== "misterio-salamanca") throw new Error("Este archivo pertenece a otro juego.");
    if (candidate.schemaVersion !== 1) throw new Error("Esta versión de la partida todavía no es compatible.");
    const base = freshState();
    return Object.assign(base, candidate, {
      player: Object.assign(base.player, candidate.player || {}),
      quest: Object.assign(base.quest, candidate.quest || {}, { steps: Object.assign(base.quest.steps, candidate.quest && candidate.quest.steps || {}) }),
      languageProgress: Object.assign(base.languageProgress, candidate.languageProgress || {})
    });
  }

  SpanishRPG.State = { fresh: freshState, normalise: normalise };
})();
