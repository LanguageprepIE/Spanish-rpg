(function () {
  "use strict";
  const RPG = window.SpanishRPG;
  const D = RPG.DATA;
  let state = RPG.State.fresh();
  let selectedCharacter = null;
  let activeDialogue = null;

  function render() {
    if (state.scene === "start") RPG.UI.start(RPG.Save.hasLocal());
    else if (state.scene === "character") RPG.UI.character(selectedCharacter);
    else if (state.scene === "intro") RPG.UI.intro(state);
    else if (state.scene === "game") RPG.UI.game(state, activeDialogue);
    else if (state.scene === "ending") RPG.UI.ending(state);
  }
  function autosave(message) { RPG.Save.saveLocal(state); if (message) RPG.UI.toast(message); }
  function addUnique(list, item) { if (!list.some(x => x.id === item.id)) list.push(item); }
  function addXP(amount) { state.player.xp += amount; }

  function newGame() { state = RPG.State.fresh(); selectedCharacter = null; state.scene = "character"; render(); }
  function begin() {
    const input = document.getElementById("player-name");
    const name = input && input.value.trim();
    if (!name) { RPG.UI.toast("Escribe un nombre o alias."); input && input.focus(); return; }
    state.player.name = name; state.player.characterId = selectedCharacter;
    if (selectedCharacter === "speaker") state.player.coins += 2;
    if (selectedCharacter === "detective") state.player.xp += 5;
    if (selectedCharacter === "explorer") addUnique(state.clues, { id: "early", name: "Detalle observado", description: "El mensaje se envió exactamente a las 18:05." });
    state.scene = "intro"; autosave(); render();
  }
  function introNext() {
    if (state.introIndex < D.intro.length - 1) state.introIndex += 1;
    else { state.scene = "game"; state.location = "plaza"; }
    autosave(); render();
  }
  function startDialogue(id) { activeDialogue = id; state.conversations[id] = (state.conversations[id] || 0) + 1; render(); }
  function choose(index) {
    const node = D.dialogue[activeDialogue]; const choice = node && node.choices[index]; if (!choice) return;
    if (choice.action === "openShop") { RPG.UI.shop(); return; }
    if (choice.next) { activeDialogue = choice.next; applyCompletion(D.dialogue[choice.next]); }
    if (choice.close) activeDialogue = null;
    autosave(); render();
  }
  function applyCompletion(node) {
    if (!node || !node.complete) return;
    if (node.complete === "startQuest" && !state.quest.steps.lucia) {
      state.quest.status = "active"; state.quest.steps.lucia = true; state.languageProgress.politeRequest = true;
      state.unlockedLocations.push("cafe"); addXP(10);
      addUnique(state.clues, { id: "red", name: "Una prenda roja", description: "La persona llevaba algo rojo, pero no era una camiseta." });
    }
    if (node.complete === "bookshopClue" && !state.quest.steps.bookshop) {
      state.quest.steps.bookshop = true; state.languageProgress.descriptions = true; state.languageProgress.directions = true; addXP(15);
      addUnique(state.clues, { id: "description", name: "Descripción de Tomás", description: "Mujer joven, abrigo rojo, gafas y sin sombrero." });
    }
  }
  function shopChoice(id) {
    const option = D.shop.find(x => x.id === id); if (!option) return;
    if (!option.correct) {
      if (option.price > 5) RPG.UI.toast("Ese pedido cuesta más de 5 €.");
      else RPG.UI.toast("Ese pedido lleva carne. Prueba otra opción.");
      return;
    }
    RPG.UI.closeModal(); state.quest.steps.cafe = true; state.languageProgress.readingPrices = true; addXP(20); state.player.coins += 2;
    addUnique(state.inventory, { id: "receipt", name: "Recibo de la mesa 7", description: "Café Niebla · 18:20. Objeto de misión." });
    addUnique(state.clues, { id: "receipt-clue", name: "Hora y gafas", description: "La persona estuvo en el café a las 18:20 y llevaba gafas redondas." });
    if (!state.unlockedLocations.includes("bookshop")) state.unlockedLocations.push("bookshop");
    activeDialogue = "saraDone"; autosave("Objeto conseguido: recibo de la mesa 7"); render();
  }
  function suspectChoice(id) {
    if (id !== "elena") { state.decisions.wrongSuspects = (state.decisions.wrongSuspects || 0) + 1; RPG.UI.toast("Esa persona contradice al menos una pista. Revisa la hora, la ropa y los accesorios."); return; }
    RPG.UI.closeModal(); state.decisions.finalSuspect = id; state.quest.steps.deduction = true; state.quest.status = "completed"; state.ending = "success"; addXP(30);
    state.achievements.push("Primera investigación"); state.inventory.push({ id: "folder", name: "Carpeta azul", description: "Recuperada en la Plaza Mayor." }); state.scene = "ending";
    autosave(); render();
  }
  function loadFile() { document.getElementById("save-file-input").click(); }
  function resume(loaded) { state = loaded; activeDialogue = null; RPG.Save.saveLocal(state); RPG.UI.closeModal(); render(); RPG.UI.toast("Partida cargada correctamente."); }

  document.addEventListener("click", function (event) {
    const char = event.target.closest("[data-character]");
    if (char) {
      const previousInput = document.getElementById("player-name");
      const draftName = previousInput ? previousInput.value : "";
      selectedCharacter = char.dataset.character;
      RPG.UI.character(selectedCharacter);
      const input = document.getElementById("player-name");
      if (input) { input.value = draftName; input.focus(); }
      return;
    }
    const location = event.target.closest("[data-location]");
    if (location && !location.disabled) { state.location = location.dataset.location; activeDialogue = null; autosave(); render(); return; }
    const talk = event.target.closest("[data-talk]"); if (talk) { startDialogue(talk.dataset.talk); return; }
    const choice = event.target.closest("[data-choice]"); if (choice) { choose(Number(choice.dataset.choice)); return; }
    const shop = event.target.closest("[data-shop]"); if (shop) { shopChoice(shop.dataset.shop); return; }
    const suspect = event.target.closest("[data-suspect]"); if (suspect) { suspectChoice(suspect.dataset.suspect); return; }
    const tab = event.target.closest("[data-tab]");
    if (tab) { document.querySelectorAll(".tab-btn").forEach(x => x.classList.toggle("active", x === tab)); const content = document.querySelector(".panel-content"); if (content) content.innerHTML = RPG.UI.sideContent(state, tab.dataset.tab); return; }
    const action = event.target.closest("[data-action]"); if (!action) return;
    const type = action.dataset.action;
    if (type === "new") newGame();
    else if (type === "home") { state.scene = "start"; render(); }
    else if (type === "continue") { const loaded = RPG.Save.loadLocal(); if (loaded) resume(loaded); }
    else if (type === "begin") begin();
    else if (type === "intro-next") introNext();
    else if (type === "open-save") RPG.UI.saveMenu(state.savedAt);
    else if (type === "open-glossary") RPG.UI.glossary();
    else if (type === "close-modal") RPG.UI.closeModal();
    else if (type === "load") loadFile();
    else if (type === "export") { autosave(); RPG.Save.exportFile(state); RPG.UI.toast("Archivo de partida descargado."); }
    else if (type === "deduce") RPG.UI.suspects();
    else if (type === "shop-hint") { state.hintsUsed += 1; autosave(); RPG.UI.toast("Busca una opción que diga «sin carne» y cueste 5,00 € o menos."); }
    else if (type === "deduction-hint") { state.hintsUsed += 1; autosave(); RPG.UI.toast("La persona estuvo allí a las 18:20, llevaba abrigo rojo y gafas, y no llevaba sombrero."); }
    else if (type === "restart") { RPG.Save.clearLocal(); newGame(); }
  });

  document.getElementById("save-file-input").addEventListener("change", function (event) {
    const file = event.target.files && event.target.files[0]; if (!file) return;
    RPG.Save.importFile(file).then(resume).catch(error => RPG.UI.toast(error.message || "No se pudo cargar la partida.")); event.target.value = "";
  });
  render();
})();
