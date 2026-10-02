/* Shared Let’s Try unit loader */
(function () {
  "use strict";

  const current = document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src)
    : new URL("js/lets-try-unit-loader.js", location.href);
  const projectRoot = new URL("../", current);

  const params = new URLSearchParams(location.search);
  const book = (params.get("book") || "lt1").toLowerCase();
  const unit = String(Math.max(1, Math.min(9, Number(params.get("unit")) || 5)));

  document.documentElement.classList.add("shared-unit-template");
  document.documentElement.dataset.book = book;
  document.documentElement.dataset.unit = unit;

  function loadScript(relativePath) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const url = new URL(relativePath, projectRoot);
      url.searchParams.set("v", "20261002-1248");
      script.src = url.href;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${relativePath}`));
      document.head.append(script);
    });
  }

  window.addEventListener("DOMContentLoaded", async () => {
    try {
      await loadScript("js/lets-try-data.js");
      await loadScript(`units/config/${book}-unit${unit}.js`);
      await loadScript("js/lets-try-unit.js");
      await loadScript("js/lets-try-ui.js");
    } catch (error) {
      console.error(error);
      const output = document.getElementById("displayText");
      if (output) output.textContent = "UNIT COULD NOT LOAD";
    }
  }, { once: true });
})();
