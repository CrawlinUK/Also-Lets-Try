/* Flash Cards — presentation, navigation, automatic playback and responsive sizing. */
(function (global) {
  "use strict";
  function create({ state, elements, UNIT_CONFIG, currentCard, syncShapePracticeControls, applyVisual, cardText, renderCardText, render, shuffled, alignSideNavigation, document, window, requestAnimationFrame, getComputedStyle, ResizeObserver, setInterval, clearInterval }) {
    function showFlashcardLayout() {
      document.documentElement.classList.remove("guess-focus");
      elements.missingAnswerHints.hidden = true;
      elements.guessWordList.hidden = true;
      elements.shuffleButton.hidden = false;
      elements.answerArea.hidden = false;
      elements.gameArea.hidden = true;
      elements.floatingTimer.hidden = false;
      elements.autoButton.hidden = false;
      elements.previousButton.hidden = false;
      elements.nextButton.hidden = false;
      elements.previousButton.classList.remove("game-action");
      elements.nextButton.classList.remove("game-action");
      elements.previousButton.textContent = "";
      elements.nextButton.textContent = "";
      delete elements.nextButton.dataset.gameAction;
      elements.previousButton.setAttribute("aria-label", "Previous card");
      elements.nextButton.setAttribute("aria-label", "Next card");
      elements.gameTitle.textContent = "";
    }

    // Responsive typography is owned by CSS viewport units/clamp().
    // Clear any stale inline values left by older builds, then let the browser
    // recalculate fluid text continuously as the viewport changes.
    function fitFlashcardText() {
      const text = elements.displayText;
      if (!text) return;
      text.style.removeProperty("font-size");
      text.style.removeProperty("white-space");
      text.style.removeProperty("max-width");
    }

    // Fit each flashcard picture into the space left after its text.
    // Sprite sheets need the exact artwork aspect ratio, so never stretch
    // the picture frame simply to fill both width and height.
    function fitFlashcardArtwork() {
      fitFlashcardText();
      const frame = elements.pictureFrame;
      const card = currentCard();
      if (!card || elements.answerArea.hidden || state.gameMode !== "flashcards"
          || state.displayMode === "text") {
        frame.style.removeProperty("width");
        frame.style.removeProperty("height");
        return;
      }

      const ratioText = card.visual?.aspectRatio || UNIT_CONFIG.pictureAspectRatio || "1 / 1";
      const parts = String(ratioText).split("/").map(Number);
      const ratio = parts.length === 2 && parts[0] > 0 && parts[1] > 0
        ? parts[0] / parts[1] : Number(ratioText);
      if (!Number.isFinite(ratio) || ratio <= 0) return;

      const area = elements.answerArea;
      const dimensions = area.getBoundingClientRect();
      if (!dimensions.width || !dimensions.height) return;

      const styles = getComputedStyle(area);
      const horizontalPadding = (parseFloat(styles.paddingLeft) || 0)
        + (parseFloat(styles.paddingRight) || 0);
      const verticalPadding = (parseFloat(styles.paddingTop) || 0)
        + (parseFloat(styles.paddingBottom) || 0);
      const textVisible = getComputedStyle(elements.displayText).display !== "none";
      const textHeight = textVisible ? elements.displayText.getBoundingClientRect().height : 0;
      const gap = textVisible ? (parseFloat(styles.rowGap) || 0) : 0;

      // Use nearly all of the stage that remains after the word/phrase.
      // The card still keeps a small safety border; the header and controls
      // are not reduced. The picture/text balance preference still applies.
      const availableWidth = Math.max(0, dimensions.width - horizontalPadding) * .985;
      const availableHeight = Math.max(0,
        dimensions.height - verticalPadding - textHeight - gap - 24) * .98;
      if (availableWidth < 40 || availableHeight < 40) {
        // Don't leave a previous card's oversized picture in place.
        frame.style.width = "0px";
        frame.style.height = "0px";
        return;
      }

      const scale = Number(getComputedStyle(document.documentElement)
        .getPropertyValue("--picture-scale")) || 1;
      const width = Math.min(availableWidth, availableHeight * ratio)
        * Math.min(1, Math.max(.4, scale));
      frame.style.aspectRatio = ratioText;
      frame.style.width = Math.floor(width) + "px";
      frame.style.height = Math.floor(width / ratio) + "px";
    }

    let artworkFitScheduled = false;
    function scheduleFlashcardArtworkFit() {
      // Changes of cards or the display mode can precede the final layout
      // and web-font metrics. Fit once, then verify in the next frame after
      // everything has had a chance to settle (without a resize event).
      if (artworkFitScheduled) return;
      artworkFitScheduled = true;
      requestAnimationFrame(() => {
        fitFlashcardArtwork();
        requestAnimationFrame(() => {
          artworkFitScheduled = false;
          fitFlashcardArtwork();
        });
      });
    }

    function renderFlashcards() {
      showFlashcardLayout();

      const card = currentCard();
      const effectiveMode = state.displayMode;

      elements.flashcard.classList.toggle("picture-only", effectiveMode === "picture");
      elements.flashcard.classList.toggle("text-only", effectiveMode === "text");

      if (!card) {
        syncShapePracticeControls(null);
        elements.cardPicture.removeAttribute("style");
        elements.displayText.textContent = "NO CARDS AVAILABLE";
        elements.counter.textContent = "0 / 0";
        elements.modeLabel.textContent = "Flashcard mode";
        return;
      }

      syncShapePracticeControls(card);
      applyVisual(elements.cardPicture, card);
      elements.cardPicture.setAttribute("aria-label", cardText(card));
      renderCardText(elements.displayText, card);
      scheduleFlashcardArtworkFit();
      elements.counter.textContent = `${state.position + 1} / ${state.deck.length}`;
      elements.modeLabel.textContent = "Flashcard mode";
      elements.shuffleButton.textContent = "Shuffle";
      updateTimerDisplay();
      requestAnimationFrame(alignSideNavigation);
    }

    function nextCard() {
      if (!state.deck.length) return;
      state.position = (state.position + 1) % state.deck.length;
      render();
    }

    function previousCard() {
      if (!state.deck.length) return;
      state.position = (state.position - 1 + state.deck.length) % state.deck.length;
      render();
    }

    function shuffle() {
      const currentId = currentCard() ? currentCard().id : null;
      state.deck = shuffled(state.deck);

      if (currentId && state.deck.length > 1 && state.deck[0].id === currentId) {
        [state.deck[0], state.deck[1]] = [state.deck[1], state.deck[0]];
      }

      state.position = 0;
      render();
    }

    function updateTimerDisplay() {
      const running = Boolean(state.autoTimer)
        || elements.autoButton.classList.contains("active");
      const shown = running ? state.countdown : state.autoSeconds;
      elements.timerValue.textContent = `${shown} sec`;

      // Pulse the countdown once per second and lock both timer buttons
      // while automatic playback is running. Keyboard changes are guarded too.
      elements.floatingTimer.classList.toggle("is-counting", running);
      elements.timerDownButton.disabled = running;
      elements.timerUpButton.disabled = running;
    }

    function stopAuto() {
      if (state.autoTimer) clearInterval(state.autoTimer);
      if (state.countdownTimer) clearInterval(state.countdownTimer);
      state.autoTimer = null;
      state.countdownTimer = null;
      state.countdown = state.autoSeconds;
      elements.autoButton.classList.remove("active");
      elements.autoButton.textContent = "";
      elements.autoButton.setAttribute("aria-label", "Start automatic flashcards");
      elements.autoButton.title = "Start automatic flashcards";
      updateTimerDisplay();
    }

    function startAuto() {
      if (state.gameMode !== "flashcards") return;

      state.countdown = state.autoSeconds;
      elements.autoButton.classList.add("active");
      elements.autoButton.textContent = "";
      elements.autoButton.setAttribute("aria-label", "Stop automatic flashcards");
      elements.autoButton.title = "Stop automatic flashcards";
      updateTimerDisplay();

      state.countdownTimer = setInterval(() => {
        state.countdown -= 1;
        if (state.countdown <= 0) state.countdown = state.autoSeconds;
        updateTimerDisplay();
      }, 1000);

      state.autoTimer = setInterval(() => {
        nextCard();
        state.countdown = state.autoSeconds;
        updateTimerDisplay();
      }, state.autoSeconds * 1000);
    }

    function toggleAuto() {
      if (state.autoTimer) stopAuto();
      else startAuto();
    }

    function changeTimer(amount) {
      // Timer duration is adjustable only while playback is stopped.
      // This also blocks keyboard + / - changes during playback.
      if (state.autoTimer || elements.autoButton.classList.contains("active")) return;
      state.autoSeconds = Math.max(
        UNIT_CONFIG.autoSecondsMinimum,
        Math.min(UNIT_CONFIG.autoSecondsMaximum, state.autoSeconds + amount)
      );
      stopAuto();
    }

    function bindLayout() {
      // Refit after rotation, window resizing and font/layout changes.
      if (typeof ResizeObserver === "function") {
        const artLayoutObserver = new ResizeObserver(scheduleFlashcardArtworkFit);
        // Do not observe displayText: fitting it changes its own dimensions.
        // Observing the stage and the window is sufficient.
        artLayoutObserver.observe(elements.answerArea);
      }
      if (document.fonts) {
        // Fonts may finish loading *after* the first flashcard was measured.
        // Both the initial readiness and subsequent loads must trigger a fit.
        if (document.fonts.ready) {
          document.fonts.ready.then(scheduleFlashcardArtworkFit);
        }
        if (typeof document.fonts.addEventListener === "function") {
          document.fonts.addEventListener("loadingdone", scheduleFlashcardArtworkFit);
          document.fonts.addEventListener("loadingerror", scheduleFlashcardArtworkFit);
        }
      }
      window.addEventListener("resize", () => {
        scheduleFlashcardArtworkFit();
        requestAnimationFrame(alignSideNavigation);
      });

    }

    return Object.freeze({
      render: renderFlashcards, next: nextCard, previous: previousCard, shuffle,
      stopAuto, toggleAuto, changeTimer, fitArtwork: fitFlashcardArtwork, bindLayout
    });
  }
  global.ALTE_FLASH_CARDS = Object.freeze({ create });
})(window);
