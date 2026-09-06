(function () {
  "use strict";
  window.SpanishRPG = window.SpanishRPG || {};
  const D = SpanishRPG.DATA;
  const app = function () { return document.getElementById("app"); };
  const escape = function (value) { const el = document.createElement("div"); el.textContent = value == null ? "" : String(value); return el.innerHTML; };

  function start(hasSave) {
    app().innerHTML = `<section class="screen has-scene start-shell"><div class="title-card"><div class="eyebrow">Una aventura en español</div><h1>El misterio <span>de Salamanca</span></h1><p class="lead">Una carpeta desaparecida. Tres desconocidos. Veinticinco minutos antes de que salga el tren.</p><div class="menu-stack"><button class="btn primary" data-action="new">Nueva partida</button><button class="btn" data-action="continue" ${hasSave ? "" : "disabled"}>Continuar</button><button class="btn ghost" data-action="load">Cargar archivo de partida</button></div><p class="save-note">Tu progreso se guarda automáticamente en este dispositivo.</p></div></section>`;
  }

  function character(selected) {
    app().innerHTML = `<section class="screen setup-shell"><div class="setup-card"><div class="eyebrow">Nueva partida</div><h2>Elige tu personaje</h2><p class="lead">La historia será la misma, pero cada perfil comienza con una pequeña ventaja.</p><label class="field-label" for="player-name">Tu nombre o alias</label><input class="name-input" id="player-name" maxlength="20" autocomplete="off" placeholder="Escribe un nombre"><span class="field-label">Perfil</span><div class="character-grid">${D.characters.map(c => `<button class="character ${selected === c.id ? "selected" : ""}" data-character="${c.id}"><span class="avatar">${c.mark}</span><strong>${c.name}</strong><small>${c.trait}</small></button>`).join("")}</div><button class="btn primary" data-action="begin" ${selected ? "" : "disabled"}>Comenzar la aventura</button> <button class="btn ghost" data-action="home">Volver</button></div></section>`;
  }

  function intro(state) {
    app().innerHTML = `<section class="screen has-scene story-shell"><div class="story-card"><div class="eyebrow">Prólogo · ${state.introIndex + 1} / ${D.intro.length}</div><p>${escape(D.intro[state.introIndex])}</p><button class="btn primary" data-action="intro-next">${state.introIndex === D.intro.length - 1 ? "Entrar en la plaza" : "Continuar"}</button></div></section>`;
  }

  function questPercent(state) { return Object.values(state.quest.steps).filter(Boolean).length * 25; }
  function game(state, activeDialogue) {
    const loc = D.locations[state.location];
    app().innerHTML = `<section class="screen has-scene game"><header class="hud"><div class="brand">El misterio de Salamanca</div><div class="stats"><span class="stat">${escape(state.player.name)}</span><span class="stat">XP ${state.player.xp}</span><span class="stat">◈ ${state.player.coins}</span></div><div class="hud-actions"><button class="btn small ghost" data-action="open-glossary">Glosario</button><button class="btn small" data-action="open-save">Guardar</button></div></header><div class="world"><aside class="panel map-panel"><div class="panel-pad"><h2>Mapa</h2><div class="map-list">${Object.keys(D.locations).map(id => { const item = D.locations[id]; const open = state.unlockedLocations.includes(id); return `<button class="location-btn ${state.location === id ? "active" : ""}" data-location="${id}" ${open ? "" : "disabled"}><strong>${item.name}</strong><span>${open ? item.subtitle : "Bloqueado"}</span></button>`; }).join("")}</div></div></aside><section class="panel scene-panel"><div class="scene"><div class="scene-heading"><h2>${loc.name}</h2><p>${loc.subtitle}</p></div><div class="scene-actions">${sceneActions(state)}</div></div></section><aside class="panel side-panel"><div class="quest-card"><h2>${state.quest.status === "not_started" ? "Sin misión activa" : "La carpeta azul"}</h2><p>${questText(state)}</p><div class="progress-track"><div class="progress-bar" style="width:${questPercent(state)}%"></div></div></div><div class="side-tabs"><button class="tab-btn active" data-tab="clues">Pistas</button><button class="tab-btn" data-tab="inventory">Objetos</button></div><div class="panel-pad panel-content">${sideContent(state, "clues")}</div></aside></div>${activeDialogue && D.dialogue[activeDialogue] ? dialogue(D.dialogue[activeDialogue]) : ""}</section>`;
  }

  function sceneActions(state) {
    if (state.location === "plaza") {
      const buttons = [`<button class="btn" data-talk="luciaStart">Hablar con Lucía</button>`];
      if (state.quest.steps.cafe && state.quest.steps.bookshop && !state.quest.steps.deduction) buttons.push(`<button class="btn primary" data-action="deduce">Identificar a la persona</button>`);
      return buttons.join("");
    }
    if (state.location === "cafe") return `<button class="btn" data-talk="${state.quest.steps.cafe ? "saraDone" : "saraStart"}">Hablar con Sara</button>`;
    return `<button class="btn" data-talk="${state.quest.steps.bookshop ? "tomasDescription" : "tomasStart"}">Hablar con Tomás</button>`;
  }
  function questText(state) {
    if (state.quest.status === "not_started") return "Habla con Lucía junto a la fuente.";
    if (!state.quest.steps.cafe) return "Investiga en el Café Niebla.";
    if (!state.quest.steps.bookshop) return "Busca otra pista en la Librería Atlas.";
    if (!state.quest.steps.deduction) return "Regresa a la plaza e identifica a la persona correcta.";
    return "Misión completada.";
  }
  function sideContent(state, tab) {
    const values = tab === "clues" ? state.clues : state.inventory;
    if (!values.length) return `<p class="empty">Todavía no has encontrado ${tab === "clues" ? "ninguna pista" : "ningún objeto"}.</p>`;
    return `<ul class="list">${values.map(item => `<li><strong>${escape(item.name)}</strong><br>${escape(item.description)}</li>`).join("")}</ul>`;
  }
  function dialogue(node) {
    return `<footer class="dialogue-dock"><div class="dialogue-box"><div class="speaker">${escape(node.speaker)}</div><div><div class="speech">${escape(node.text)}</div>${node.feedback ? `<div class="feedback">${escape(node.feedback)}</div>` : ""}<div class="choices">${(node.choices || []).map((choice, index) => `<button class="choice" data-choice="${index}">${escape(choice.text)}</button>`).join("")}</div></div></div></footer>`;
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
  function saveMenu(savedAt) {
    const when = savedAt ? new Date(savedAt).toLocaleString() : "ahora";
    modal("Guardar partida", `<p>El autoguardado local está activo. Último guardado: <strong>${escape(when)}</strong>.</p><p>Para continuar en otro ordenador, descarga el archivo y guárdalo en OneDrive.</p>`, `<button class="btn primary" data-action="export">Descargar SAVE GAME</button><button class="btn" data-action="load">Cargar archivo</button><button class="btn ghost" data-action="close-modal">Cerrar</button>`);
  }
  function ending(state) {
    app().innerHTML = `<section class="screen has-scene ending"><div class="ending-card"><div class="ending-mark">◇</div><div class="eyebrow">Vertical slice completado</div><h1>Caso resuelto</h1><p class="lead">${escape(state.player.name)}, has identificado a Elena y recuperado la carpeta azul. El tren puede salir a tiempo… pero el mensaje anónimo sigue sin explicación.</p><div class="summary-grid"><div><strong>${state.player.xp}</strong>XP</div><div><strong>${state.clues.length}</strong>pistas</div><div><strong>${state.hintsUsed}</strong>ayudas</div></div><p>Has usado peticiones educadas, precios, descripciones físicas, horas y direcciones para avanzar en la historia.</p><div class="modal-actions" style="justify-content:center"><button class="btn primary" data-action="export">Guardar partida</button><button class="btn" data-action="restart">Jugar otra vez</button><button class="btn ghost" data-action="home">Menú principal</button></div></div></section>`;
  }

  SpanishRPG.UI = { start, character, intro, game, sideContent, modal, closeModal, toast, shop, suspects, glossary, saveMenu, ending };
})();
