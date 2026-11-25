/* Lights Off — shared, remembered ALT-e display preference. */
(function (global) {
  "use strict";
  const key = "alte.theme.v1";
  const root = document.documentElement;
  let dark = false;

  function read() {
    try { return global.localStorage.getItem(key) === "dark"; }
    catch { return false; }
  }

  function updateButtons() {
    document.querySelectorAll(".alte-lights-toggle").forEach(button => {
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "Turn lights on" : "Turn lights off");
      button.title = dark ? "Turn lights on" : "Turn lights off";
      button.querySelector(".alte-lights-label").textContent = dark ? "Lights On" : "Lights Off";
    });
  }

  function apply(value, persist = false) {
    dark = Boolean(value);
    root.dataset.theme = dark ? "dark" : "light";
    if (persist) {
      try { global.localStorage.setItem(key, dark ? "dark" : "light"); } catch {}
    }
    updateButtons();
  }

  function addButton(target, panel = false) {
    if (!target || target.querySelector(".alte-lights-toggle")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "alte-lights-toggle" + (panel ? " alte-lights-panel" : "");
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6m-5 3h4M8 15c0-2-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 7v1H8z"/></svg><span class="alte-lights-label"></span>';
    button.addEventListener("click", () => apply(!dark, true));
    if (panel && target.lastElementChild) target.insertBefore(button, target.lastElementChild);
    else target.append(button);
  }

  function mount() {
    addButton(document.querySelector(".site-header-inner") || document.querySelector("header"));
    addButton(document.querySelector(".settings-heading"), true);
    updateButtons();
  }

  apply(read());
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, {once:true});
  else mount();
  global.addEventListener("storage", event => {
    if (event.key === key || event.key === null) apply(read());
  });
  global.ALTE_THEME = Object.freeze({ mount });
})(window);
