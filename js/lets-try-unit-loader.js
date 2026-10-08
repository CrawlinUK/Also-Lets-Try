/* Shared Let’s Try unit loader */
(function () {
  "use strict";

  const current = document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src)
    : new URL("js/lets-try-unit-loader.js", location.href);
  const projectRoot = new URL("../", current);
  const ASSET_VERSION = "20261008-1638-shape-memory-random";

  const params = new URLSearchParams(location.search);
  const book = (params.get("book") || "lt1").toLowerCase();
  const unit = String(Math.max(1, Math.min(9, Number(params.get("unit")) || 5)));

  document.documentElement.classList.add("shared-unit-template");
  document.documentElement.dataset.book = book;
  document.documentElement.dataset.unit = unit;

  window.LETS_TRY_ASSET_VERSION = ASSET_VERSION;
  window.LETS_TRY_NUMBER_SVG_VERSION = ASSET_VERSION;

  function registerAssetCache() {
    if (!("serviceWorker" in navigator) || location.protocol !== "https:") return;
    const workerUrl = new URL("sw.js", projectRoot);
    workerUrl.searchParams.set("v", ASSET_VERSION);
    navigator.serviceWorker.register(workerUrl.href, {
      scope: projectRoot.pathname,
      updateViaCache: "none"
    }).catch((error) => {
      console.warn("Asset cache registration warning:", error);
    });
  }

  registerAssetCache();

  function versionAssetUrl(value) {
    try {
      const url = new URL(value, location.href);
      if (url.origin === location.origin) {
        url.searchParams.set("v", ASSET_VERSION);
      }
      return url.href;
    } catch (error) {
      return value;
    }
  }

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
            return response.text();
          })
          .then((source) => ({ digit, source }))
          .catch((error) => {
            console.warn(error);
            return { digit, source: "" };
          })
      )
    );
  }

  function installNumberSprite(items) {
    if (!Array.isArray(items) || document.getElementById("letsTryNumberSprite")) return;

    const ns = "http://www.w3.org/2000/svg";
    const sprite = document.createElementNS(ns, "svg");
    sprite.id = "letsTryNumberSprite";
    sprite.setAttribute("aria-hidden", "true");
    sprite.setAttribute("width", "0");
    sprite.setAttribute("height", "0");
    sprite.style.position = "absolute";
    sprite.style.width = "0";
    sprite.style.height = "0";
    sprite.style.overflow = "hidden";

    const defs = document.createElementNS(ns, "defs");
    const parser = new DOMParser();

    items.forEach(({ digit, source }) => {
      if (!source) return;
      const parsed = parser.parseFromString(source, "image/svg+xml");
      const artwork = parsed.getElementById("artwork");
      if (!artwork) return;

      const group = document.createElementNS(ns, "g");
      group.id = `number-digit-${digit}`;
      Array.from(artwork.attributes).forEach((attribute) => {
        if (attribute.name !== "id") {
          group.setAttribute(attribute.name, attribute.value);
        }
      });
      Array.from(artwork.childNodes).forEach((node) => {
        group.append(document.importNode(node, true));
      });
      defs.append(group);
    });

    sprite.append(defs);
    document.body.append(sprite);
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
        .map((card) => {
          const visual = card && card.visual;
          if (!visual || !visual.src) return null;
          visual.src = versionAssetUrl(visual.src);
          return visual.src;
        })
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

      if (numberSvgPreloadPromise) {
        installNumberSprite(await numberSvgPreloadPromise);
      }

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
