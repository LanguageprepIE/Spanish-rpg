(function () {
  "use strict";
  window.SpanishRPG = window.SpanishRPG || {};
  const D = SpanishRPG.DATA;
  const app = function () { return document.getElementById("app"); };
  const escape = function (value) { const el = document.createElement("div"); el.textContent = value == null ? "" : String(value); return el.innerHTML; };
  const ASSET_BASE = document.querySelector('link[href^="css/"]') ? "assets/" : "";

  function start(hasSave) {
    app().innerHTML = `<section class="screen has-scene start-shell"><div class="title-card"><div class="eyebrow">A Spanish mystery adventure</div><h1>El misterio <span>de Salamanca</span></h1><p class="lead">A missing folder. Three strangers. Twenty-five minutes before the train leaves.</p><div class="menu-stack"><button class="btn primary" data-action="new">New game</button><button class="btn" data-action="continue" ${hasSave ? "" : "disabled"}>Continue</button><button class="btn ghost" data-action="load">Load save file</button></div><p class="save-note">Progress is saved automatically on this device.</p></div></section>`;
  }

  function character(selected) {
    app().innerHTML = `<section class="screen setup-shell"><div class="setup-card"><div class="eyebrow">New game</div><h2>Choose your investigator style</h2><p class="lead">You will play as our original student investigator. Choose her strongest skill.</p><label class="field-label" for="player-name">Name or alias</label><input class="name-input" id="player-name" maxlength="20" autocomplete="off" placeholder="Enter a name"><span class="field-label">Special skill</span><div class="character-grid">${D.characters.map(c => `<button class="character ${selected === c.id ? "selected" : ""}" data-character="${c.id}"><span class="avatar">${c.mark}</span><strong>${c.name}</strong><small>${c.trait}</small></button>`).join("")}</div><button class="btn primary" data-action="begin" ${selected ? "" : "disabled"}>Start the adventure</button> <button class="btn ghost" data-action="home">Back</button></div></section>`;
  }

  function intro(state) {
    app().innerHTML = `<section class="screen has-scene story-shell"><div class="story-card"><div class="eyebrow">Prologue · ${state.introIndex + 1} / ${D.intro.length}</div><p>${escape(D.intro[state.introIndex])}</p><button class="btn primary" data-action="intro-next">${state.introIndex === D.intro.length - 1 ? "Enter Plaza Mayor" : "Continue"}</button></div></section>`;
  }

  function questPercent(state) { return Object.values(state.quest.steps).filter(Boolean).length * 25; }
  function game(state, activeDialogue) {
    const loc = D.locations[state.location];
    app().innerHTML = `<section class="screen game adventure-game"><header class="hud"><div><div class="brand">El misterio de Salamanca</div><small class="place-name">${loc.name}</small></div><div class="objective"><span>Current objective</span><strong>${questText(state)}</strong></div><div class="stats"><span class="stat">XP ${state.player.xp}</span><span class="stat">◈ ${state.player.coins}</span></div><div class="hud-actions"><button class="btn small ghost" data-action="mission-help">Help</button><button class="btn small" data-action="open-save">Save</button></div></header><div class="adventure-stage stage-${state.location}" data-walk-stage style="--scene-bg:url('${ASSET_BASE}${sceneBackground(state.location)}')"><div class="sky-shade"></div>${stageCharacters(state)}${stageExits(state)}${stageObjects(state)}<div class="player-wrap" style="--player-x:${state.playerPosition || 18}%"><img class="player-character" src="${ASSET_BASE}player-investigator.png" alt="Your investigator"></div><div class="walk-prompt">Tap the ground to walk · Tap people and objects to interact</div><div class="scene-curtain"><span>${loc.name}</span></div></div><footer class="adventure-bar"><button class="verb active">Walk</button><button class="verb">Look</button><button class="verb">Talk</button><button class="verb">Use</button><div class="quick-items"><strong>Inventory</strong><span>${state.inventory.length ? state.inventory.map(i => escape(i.name)).join(" · ") : "Empty"}</span></div><button class="btn small ghost" data-action="open-glossary">Word help</button></footer>${activeDialogue && D.dialogue[activeDialogue] ? dialogue(D.dialogue[activeDialogue]) : ""}</section>`;
  }

  function sceneBackground(location) {
    return location === "cafe" ? "scene-cafe.jpg" : location === "bookshop" ? "scene-bookshop.jpg" : "scene-plaza.jpg";
  }

  function stageCharacters(state) {
    if (state.location === "plaza") return `<button class="npc-on-stage lucia-stage" data-npc="luciaStart" data-x="67" aria-label="Talk to Lucía"><img src="${ASSET_BASE}lucia.png" alt="Lucía"><span>Lucía</span></button>${state.quest.steps.cafe && state.quest.steps.bookshop && !state.quest.steps.deduction ? `<button class="deduction-marker" data-action="deduce">Identify the courier</button>` : ""}`;
    if (state.location === "cafe") return `<button class="npc-on-stage sara-stage" data-npc="${state.quest.steps.cafe ? "saraDone" : "saraStart"}" data-x="69" aria-label="Talk to Sara"><img src="${ASSET_BASE}sara.png" alt="Sara"><span>Sara</span></button>`;
    return `<button class="npc-on-stage tomas-stage" data-npc="${state.quest.steps.bookshop ? "tomasDescription" : "tomasStart"}" data-x="68" aria-label="Talk to Tomás"><img src="${ASSET_BASE}tomas.png" alt="Tomás"><span>Tomás</span></button>`;
  }
  function stageExits(state) {
    if (state.location === "plaza") {
      return `${state.unlockedLocations.includes("cafe") ? `<button class="stage-exit cafe-exit" data-travel="cafe" data-x="82"><strong>Café Niebla</strong><span>Enter</span></button>` : ""}${state.unlockedLocations.includes("bookshop") ? `<button class="stage-exit bookshop-exit" data-travel="bookshop" data-x="12"><strong>Librería Atlas</strong><span>Enter</span></button>` : ""}`;
    }
    return `<button class="stage-exit plaza-exit" data-travel="plaza" data-x="10"><strong>Plaza Mayor</strong><span>Exit</span></button>`;
  }
  function stageObjects(state) {
    if (state.location === "plaza") return `<button class="object-hotspot fountain-hotspot" data-inspect="fountain" data-x="50" aria-label="Examine the fountain"><span>Examine fountain</span></button>`;
    if (state.location === "cafe") return `<button class="object-hotspot menu-hotspot" data-inspect="menu" data-x="55" aria-label="Examine the menu"><span>Read menu</span></button>`;
    return `<button class="object-hotspot shelves-hotspot" data-inspect="shelves" data-x="43" aria-label="Examine the shelves"><span>Examine shelves</span></button>`;
  }
  function questText(state) {
    if (state.quest.status === "not_started") return "Walk over to Lucía and ask what she saw.";
    if (!state.quest.steps.cafe) return "Enter Café Niebla and speak to Sara.";
    if (!state.quest.steps.bookshop) return "Follow the new lead to Librería Atlas.";
    if (!state.quest.steps.deduction) return "Return to the plaza and identify the correct person.";
    return "Mission complete.";
  }
  function sideContent(state, tab) {
    const values = tab === "clues" ? state.clues : state.inventory;
    if (!values.length) return `<p class="empty">Nothing here yet.</p>`;
    return `<ul class="list">${values.map(item => `<li><strong>${escape(item.name)}</strong><br>${escape(item.description)}</li>`).join("")}</ul>`;
  }
  function dialogue(node) {
    return `<footer class="dialogue-dock"><div class="dialogue-box"><div class="speaker">${escape(node.speaker)}<small>Choose a reply in Spanish</small></div><div><div class="speech">${escape(node.text)}</div>${node.feedback ? `<div class="feedback">${escape(node.feedback)}</div>` : ""}<div class="choices">${(node.choices || []).map((choice, index) => `<button class="choice" data-choice="${index}">${escape(choice.text)}</button>`).join("")}</div></div></div></footer>`;
  }
  function modal(title, body, actions) {
    document.body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" data-modal><section class="modal" role="dialog" aria-modal="true" aria-label="${escape(title)}"><h2>${escape(title)}</h2>${body}<div class="modal-actions">${actions || `<button class="btn" data-action="close-modal">Cerrar</button>`}</div></section></div>`);
  }
  function closeModal() { const el = document.querySelector("[data-modal]"); if (el) el.remove(); }
  function toast(message) { const old = document.querySelector(".toast"); if (old) old.remove(); document.body.insertAdjacentHTML("beforeend", `<div class="toast" role="status">${escape(message)}</div>`); setTimeout(() => { const el = document.querySelector(".toast"); if (el) el.remove(); }, 2600); }
  function shop() {
    modal("El pedido de la mesa 4", `<p>Elige una opción <strong>sin carne</strong> que no cueste más de <strong>5 €</strong>.</p><div class="shop-options">${D.shop.map(o => `<button class="shop-option" data-shop="${o.id}"><span><strong>${o.name}</strong><br><small>${o.detail}</small></span><strong>${o.price.toFixed(2).replace(".", ",")} €</strong></button>`).join("")}</div>`, `<button class="btn ghost" data-action="shop-hint">Pista</button><button class="btn" data-action="close-modal">Volver</button>`);
  }
  function suspects() {
    modal("¿Quién tiene la carpeta?", `<p>Compara todas las pistas. Solo una persona coincide.</p><div class="suspect-grid">${D.suspects.map(s => `<button class="suspect" data-suspect="${s.id}"><span class="suspect-badge">${s.mark}</span><span><strong>${s.name}</strong><br><small>${s.description}</small></span></button>`).join("")}</div>`, `<button class="btn ghost" data-action="deduction-hint">Revisar pista clave</button><button class="btn" data-action="close-modal">Todavía no</button>`);
  }
  function glossary() {
    modal("Glosario limitado", `<p>Consulta palabras clave cuando las necesites. Las frases completas no se traducen.</p><ul class="list">${Object.keys(D.glossary).map(k => `<li><strong>${k}</strong> — ${D.glossary[k]}</li>`).join("")}</ul>`);
  }
  function missionHelp(state) {
    const help = state.quest.status === "not_started" ? "Lucía may have seen the person carrying the blue folder. Walk to her and choose a polite Spanish question." : !state.quest.steps.cafe ? "Lucía's clue points to Café Niebla. Tap the café entrance, talk to Sara and read her order carefully." : !state.quest.steps.bookshop ? "You have the café receipt. Return to Plaza Mayor and enter Librería Atlas for another clue." : "Compare the time, clothes and accessories in your clues.";
    modal("What am I trying to do?", `<p>${help}</p><p><strong>Language rule:</strong> the mission guidance is in English, but conversations and clues stay in Spanish.</p>`);
  }
  function inspect(id) {
    const content = id === "fountain" ? `<p>La fuente está en el centro de la plaza. Hay una moneda brillante junto al agua.</p><p class="support-line"><strong>Useful words:</strong> fuente = fountain · junto a = next to</p>` : id === "menu" ? `<p><strong>MENÚ</strong></p><p>Tortilla española — 3,80 €<br>Agua — 1,00 €<br>Bocadillo de jamón — 4,60 €<br>Zumo de naranja — 1,90 €</p><p class="support-line">Sara needs an order with no meat for no more than €5.</p>` : `<p>Las novelas están a la izquierda. Los libros de historia están al fondo, al lado de la lámpara verde.</p><p class="support-line"><strong>Useful words:</strong> izquierda = left · al fondo = at the back</p>`;
    modal("Look", content);
  }
  function saveMenu(savedAt) {
    const when = savedAt ? new Date(savedAt).toLocaleString() : "ahora";
    modal("Guardar partida", `<p>El autoguardado local está activo. Último guardado: <strong>${escape(when)}</strong>.</p><p>Para continuar en otro ordenador, descarga el archivo y guárdalo en OneDrive.</p>`, `<button class="btn primary" data-action="export">Descargar SAVE GAME</button><button class="btn" data-action="load">Cargar archivo</button><button class="btn ghost" data-action="close-modal">Cerrar</button>`);
  }
  function ending(state) {
    app().innerHTML = `<section class="screen has-scene ending"><div class="ending-card"><div class="ending-mark">◇</div><div class="eyebrow">Vertical slice completado</div><h1>Caso resuelto</h1><p class="lead">${escape(state.player.name)}, has identificado a Elena y recuperado la carpeta azul. El tren puede salir a tiempo… pero el mensaje anónimo sigue sin explicación.</p><div class="summary-grid"><div><strong>${state.player.xp}</strong>XP</div><div><strong>${state.clues.length}</strong>pistas</div><div><strong>${state.hintsUsed}</strong>ayudas</div></div><p>Has usado peticiones educadas, precios, descripciones físicas, horas y direcciones para avanzar en la historia.</p><div class="modal-actions" style="justify-content:center"><button class="btn primary" data-action="export">Guardar partida</button><button class="btn" data-action="restart">Jugar otra vez</button><button class="btn ghost" data-action="home">Menú principal</button></div></div></section>`;
  }

  SpanishRPG.UI = { start, character, intro, game, sideContent, modal, closeModal, toast, shop, suspects, glossary, missionHelp, inspect, saveMenu, ending };
})();
