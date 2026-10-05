/* Shared Let’s Try unit loader */
(function () {
  "use strict";

  const current = document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src)
    : new URL("js/lets-try-unit-loader.js", location.href);
  const projectRoot = new URL("../", current);
  const ASSET_VERSION = "20261005-1243-stable-tens";

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

  function preloadPicture(url) {
    return new Promise((resolve) => {
      const image = new Image();
      let settled = false;

      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      image.onload = async () => {
        try {
          if (typeof image.decode === "function") {
            await image.decode();
          }
        } catch (error) {
          console.warn("Image decode warning:", url, error);
        }
        finish();
      };
      image.onerror = () => {
        console.warn("Unable to preload picture:", url);
        finish();
      };
      image.src = url;

      if (image.complete && image.naturalWidth) {
        image.onload();
      }
    });
  }

  function preloadUnitPictures() {
    const config = window.LETS_TRY_UNIT_CONFIG;
    if (!config || !Array.isArray(config.cards)) return Promise.resolve([]);

    const urls = [...new Set(
      config.cards
        .map((card) => card && card.visual && card.visual.src)
        .filter(Boolean)
    )];

    return Promise.all(urls.map(preloadPicture));
  }

  window.LETS_TRY_PRELOAD_NUMBER_SVGS = preloadNumberSvgs;
  window.LETS_TRY_PRELOAD_UNIT_PICTURES = preloadUnitPictures;

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

  function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    if (!loadingScreen) return;
    loadingScreen.classList.add("loading-complete");
    window.setTimeout(() => loadingScreen.remove(), 260);
  }

  function showLoadingError() {
    const label = document.getElementById("loadingLabel");
    const loadingScreen = document.getElementById("loadingScreen");
    if (label) label.textContent = "Could not load";
    if (loadingScreen) loadingScreen.classList.add("loading-error");
  }

  window.addEventListener("DOMContentLoaded", async () => {
    try {
      await loadScript("js/lets-try-data.js");
      await loadScript(`units/config/${book}-unit${unit}.js`);

      const config = window.LETS_TRY_UNIT_CONFIG;
      const usesNumberSvgs = Boolean(
        config
        && Array.isArray(config.cards)
        && config.cards.some(
          (card) => card && card.visual && card.visual.type === "number-svg"
        )
      );

      const preloadTasks = [preloadUnitPictures()];

      if (usesNumberSvgs && !numberSvgPreloadPromise) {
        numberSvgPreloadPromise = preloadNumberSvgs();
      }
      if (numberSvgPreloadPromise) {
        preloadTasks.push(numberSvgPreloadPromise);
      }

      await Promise.all(preloadTasks);

      await loadScript("js/lets-try-unit.js");
      await loadScript("js/lets-try-ui.js");

      requestAnimationFrame(() => {
        requestAnimationFrame(hideLoadingScreen);
      });
    } catch (error) {
      console.error(error);
      showLoadingError();
      const output = document.getElementById("displayText");
      if (output) output.textContent = "UNIT COULD NOT LOAD";
    }
  }, { once: true });
})();
