/* Shared Let’s Try unit loader */
(function () {
  "use strict";

  const current = document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src)
    : new URL("js/lets-try-unit-loader.js", location.href);
  const projectRoot = new URL("../", current);
  const ASSET_VERSION = "20261002-1334-number-baseline";

  const params = new URLSearchParams(location.search);
  const book = (params.get("book") || "lt1").toLowerCase();
  const unit = String(Math.max(1, Math.min(9, Number(params.get("unit")) || 5)));

  document.documentElement.classList.add("shared-unit-template");
  document.documentElement.dataset.book = book;
  document.documentElement.dataset.unit = unit;

  window.LETS_TRY_NUMBER_SVG_VERSION = ASSET_VERSION;

  function numberSvgUrl(digit) {
    const url = new URL(`images/numbers/${digit}.svg`, projectRoot);
    url.searchParams.set("v", ASSET_VERSION);
    return url.href;
  }

  function preloadNumberSvgs() {
    return Promise.all(
      Array.from({ length: 10 }, (_, digit) =>
        fetch(numberSvgUrl(digit), { cache: "force-cache" })
          .then((response) => {
            if (!response.ok) throw new Error(`Unable to preload digit ${digit}`);
            return response.arrayBuffer();
          })
          .catch((error) => {
            console.warn(error);
            return null;
          })
      )
    );
  }

  window.LETS_TRY_PRELOAD_NUMBER_SVGS = preloadNumberSvgs;

  let numberSvgPreloadPromise =
    book === "lt1" && unit === "3"
      ? preloadNumberSvgs()
      : null;

  function loadScript(relativePath) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const url = new URL(relativePath, projectRoot);
      url.searchParams.set("v", ASSET_VERSION);
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

      const usesNumberSvgs = Boolean(
        window.LETS_TRY_UNIT_CONFIG
        && Array.isArray(window.LETS_TRY_UNIT_CONFIG.cards)
        && window.LETS_TRY_UNIT_CONFIG.cards.some(
          (card) => card && card.visual && card.visual.type === "number-svg"
        )
      );

      if (usesNumberSvgs && !numberSvgPreloadPromise) {
        numberSvgPreloadPromise = preloadNumberSvgs();
      }
      if (numberSvgPreloadPromise) {
        await numberSvgPreloadPromise;
      }

      await loadScript("js/lets-try-unit.js");
      await loadScript("js/lets-try-ui.js");
    } catch (error) {
      console.error(error);
      const output = document.getElementById("displayText");
      if (output) output.textContent = "UNIT COULD NOT LOAD";
    }
  }, { once: true });
})();
