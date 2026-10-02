(() => {
  "use strict";

  const root = document.documentElement;
  const currentScriptUrl = document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src)
    : new URL("js/lets-try-ui.js", location.href);
  const uiAsset = (name) => new URL("../images/ui/" + name, currentScriptUrl).href;
  const IMAGE_ICONS = {
    home: uiAsset("AlsoHomeSweet.svg"),
    back: uiAsset("AlsoBackArrow.svg"),
    settings: uiAsset("AlsoCogSettings.svg")
  };
  let queued = false;
  let mutating = false;

  const ICONS = {
    previous: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fill" d="m8 5 11 7-11 7z"/></svg>',
    stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="fill" x="7" y="7" width="10" height="10" rx="1"/></svg>',
    game: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 8.5h9c2.2 0 3.9 1.6 4.4 4l.8 4.1c.4 2.2-2.1 3.6-3.6 2l-2.3-2.5H8.2l-2.3 2.5c-1.5 1.6-4 .2-3.6-2l.8-4.1c.5-2.4 2.2-4 4.4-4Z"/><path d="M7 11v4M5 13h4"/><circle class="fill" cx="16.5" cy="12" r="1"/><circle class="fill" cx="18.5" cy="14" r="1"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h2.5c5.5 0 5.5 10 11 10H20"/><path d="m17 14 3 3-3 3"/><path d="M4 17h2.5c2 0 3.2-1.3 4.3-3"/><path d="M14.5 8c.8-.6 1.7-1 3-1H20"/><path d="m17 4 3 3-3 3"/></svg>',
    fullscreen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M4 16v4h4M20 16v4h-4"/></svg>',
    exitFullscreen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5"/></svg>'
  };

  function icon(name) {
    if (IMAGE_ICONS[name]) {
      return '<span class="ui-icon"><img src="' + IMAGE_ICONS[name] + '" alt="" aria-hidden="true"></span>';
    }
    return '<span class="ui-icon">' + ICONS[name] + '</span>';
  }

  function cleanLabel(value) {
    return String(value || "")
      .replace(/[\p{Extended_Pictographic}\uFE0F↝]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function iconOnly(button, name, label) {
    if (!button) return;
    const current = button.dataset.uiIcon;
    if (current === name && button.querySelector(".ui-icon")) return;
    mutating = true;
    button.innerHTML = icon(name);
    button.dataset.uiIcon = name;
    button.setAttribute("aria-label", label);
    button.title = label;
    mutating = false;
  }

  function iconLabel(button, name, fallbackLabel) {
    if (!button) return;
    const existingSpan = button.querySelector(".ui-button-label");
    const label = cleanLabel(existingSpan ? existingSpan.textContent : button.textContent) || fallbackLabel;
    if (button.dataset.uiIcon === name && existingSpan && existingSpan.textContent === label) return;
    mutating = true;
    button.innerHTML = icon(name) + '<span class="ui-button-label"></span>';
    button.querySelector(".ui-button-label").textContent = label;
    button.dataset.uiIcon = name;
    mutating = false;
  }

  function alignSideNavigation() {
    const flashcard = document.querySelector(".flashcard");
    if (!flashcard) return;
    const rect = flashcard.getBoundingClientRect();
    ["previousButton", "nextButton"].forEach((id) => {
      const button = document.getElementById(id);
      if (!button || button.hidden) return;
      button.style.top = rect.top + "px";
      button.style.height = rect.height + "px";
    });
  }

  function fitDisplayText() {
    const element = document.getElementById("displayText");
    if (!element || element.hidden || !element.parentElement) return;

    element.style.removeProperty("font-size");
    const available = Math.max(0, element.parentElement.clientWidth - 4);
    if (!available) return;

    const base = parseFloat(getComputedStyle(element).fontSize);
    if (!Number.isFinite(base)) return;

    if (element.scrollWidth <= available) return;

    let low = Math.max(38, base * 0.52);
    let high = base;

    for (let i = 0; i < 9; i += 1) {
      const mid = (low + high) / 2;
      element.style.fontSize = mid + "px";
      if (element.scrollWidth > available) high = mid;
      else low = mid;
    }

    element.style.fontSize = low + "px";
  }

  function fitGuessWord() {
    const element = document.querySelector(".guess-main-word");
    if (!element || !element.parentElement) return;

    element.style.removeProperty("font-size");
    const available = Math.max(0, element.parentElement.clientWidth - 28);
    if (!available) return;

    const base = parseFloat(getComputedStyle(element).fontSize);
    if (!Number.isFinite(base) || element.scrollWidth <= available) return;

    let low = Math.max(28, base * .46);
    let high = base;
    for (let i = 0; i < 9; i += 1) {
      const mid = (low + high) / 2;
      element.style.fontSize = mid + "px";
      if (element.scrollWidth > available) high = mid;
      else low = mid;
    }
    element.style.fontSize = low + "px";
  }

  function updateTimer() {
    const value = document.getElementById("timerValue");
    if (!value) return;
    const match = value.textContent.match(/\d+/);
    if (!match) return;
    const seconds = match[0];
    if (value.dataset.seconds !== seconds) value.dataset.seconds = seconds;
    value.setAttribute("aria-label", seconds + (seconds === "1" ? " second" : " seconds"));
  }

  function updateGameFocus() {
    const title = document.getElementById("gameTitle") || document.getElementById("mainPrompt");
    const active = Boolean(title && title.textContent.trim());
    root.classList.toggle("game-focus", active);
    return active;
  }

  function updateControls() {
    const gameActive = updateGameFocus();
    const menu = document.getElementById("menuButton");
    iconOnly(menu, gameActive ? "back" : "home", gameActive ? "Back to flashcards" : "Home");

    const previous = document.getElementById("previousButton");
    if (previous && !previous.classList.contains("game-action")) {
      iconOnly(previous, "previous", "Previous card");
    }

    const next = document.getElementById("nextButton");
    if (next && next.classList.contains("game-action")) {
      if (next.dataset.gameAction === "next") {
        iconOnly(next, "next", "Next Guess word");
      } else {
        delete next.dataset.uiIcon;
      }
    } else if (next) {
      iconOnly(next, "next", "Next card");
    }

    const auto = document.getElementById("autoButton");
    if (auto) {
      iconOnly(auto, auto.classList.contains("active") ? "stop" : "play",
        auto.classList.contains("active") ? "Stop automatic flashcards" : "Start automatic flashcards");
    }

    iconLabel(document.getElementById("gameButton"), "game", "Game");
    iconOnly(document.getElementById("settingsButton"), "settings", "Settings");
    iconLabel(document.getElementById("shuffleButton"), "shuffle", "Shuffle");

    updateTimer();
    requestAnimationFrame(() => {
      alignSideNavigation();
      fitDisplayText();
      fitGuessWord();
    });
  }

  function queueUpdate() {
    if (mutating || queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      updateControls();
    });
  }

  function setViewportHeight() {
    const viewport = window.visualViewport;
    const height = viewport ? viewport.height : window.innerHeight;
    root.style.setProperty("--viewport-height", Math.round(height) + "px");
    root.classList.toggle("is-landscape", window.innerWidth >= window.innerHeight);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      alignSideNavigation();
      fitDisplayText();
      fitGuessWord();
    });
  }

  function setupFullscreen() {
    const app = document.getElementById("appScreen");
    const bar = document.querySelector(".control-bar");
    if (!app || !bar || document.querySelector(".fullscreen-button")) return;

    const target = document.documentElement;
    const request = target.requestFullscreen || target.webkitRequestFullscreen;
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (!request || !exit) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "control quiet fullscreen-button";
    button.setAttribute("aria-label", "Enter fullscreen");
    button.title = "Enter fullscreen";

    function isFullscreen() {
      return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function render() {
      const active = isFullscreen();
      button.innerHTML = icon(active ? "exitFullscreen" : "fullscreen");
      button.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
      button.title = active ? "Exit fullscreen" : "Enter fullscreen";
      root.classList.toggle("is-fullscreen", active);
      setViewportHeight();
    }

    button.addEventListener("click", async () => {
      try {
        if (isFullscreen()) {
          await exit.call(document);
        } else {
          await request.call(target);
        }
      } catch (_) {
        button.hidden = true;
      }
    });

    document.addEventListener("fullscreenchange", render);
    document.addEventListener("webkitfullscreenchange", render);
    bar.append(button);
    render();
  }

  function setupObserver() {
    const observer = new MutationObserver(queueUpdate);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class", "hidden"]
    });
  }

  function init() {
    const isIPad =
      /iPad/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    root.classList.toggle("is-ipad", isIPad);

    setViewportHeight();
    setupFullscreen();
    updateControls();
    setupObserver();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        fitDisplayText();
        fitGuessWord();
      });
    }

    if ("ResizeObserver" in window) {
      const answerArea = document.getElementById("answerArea");
      const gameArea = document.getElementById("gameArea");
      if (answerArea) new ResizeObserver(fitDisplayText).observe(answerArea);
      if (gameArea) new ResizeObserver(fitGuessWord).observe(gameArea);
    }

    window.addEventListener("resize", setViewportHeight, { passive: true });
    window.addEventListener("orientationchange", () => {
      setTimeout(setViewportHeight, 80);
      setTimeout(setViewportHeight, 320);
    }, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setViewportHeight, { passive: true });
      window.visualViewport.addEventListener("scroll", setViewportHeight, { passive: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();