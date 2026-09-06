(function () {
  "use strict";
  window.SpanishRPG = window.SpanishRPG || {};
  const KEY = "spanishRPG.misterioSalamanca.save.v1";

  function stamp(state) { state.savedAt = new Date().toISOString(); return state; }
  function saveLocal(state) {
    try { localStorage.setItem(KEY, JSON.stringify(stamp(state))); return true; }
    catch (error) { console.warn("Local save unavailable", error); return false; }
  }
  function loadLocal() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? SpanishRPG.State.normalise(JSON.parse(raw)) : null;
    } catch (error) { console.warn("Local save invalid", error); return null; }
  }
  function clearLocal() { try { localStorage.removeItem(KEY); } catch (_) {} }
  function exportFile(state) {
    const data = JSON.stringify(stamp(state), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Spanish_RPG_Save.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function importFile(file) {
    return file.text().then(function (text) { return SpanishRPG.State.normalise(JSON.parse(text)); });
  }
  function hasLocal() { return Boolean(loadLocal()); }

  SpanishRPG.Save = { saveLocal: saveLocal, loadLocal: loadLocal, clearLocal: clearLocal, exportFile: exportFile, importFile: importFile, hasLocal: hasLocal };
})();
