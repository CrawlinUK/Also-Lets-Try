/* Guessing Game — category setup, reveal and word navigation. */
(function (global) {
  "use strict";
  function create({ state, elements, selectedCards, stopAuto, closeGameMenu, activeCategoryIds, openSettings, data, render, syncShapePracticeControls, returnToFlashcards, applyVisual, alignSideNavigation, document, requestAnimationFrame }) {
    function guessCardsForCategory(categoryId) {
      return selectedCards().filter((card) => card.category === categoryId);
    }

    function updateGuessSetupState() {
      const enabled = Boolean(state.guessCategoryId);
      elements.guessSetup.querySelectorAll("[data-guess-mode]").forEach((button) => {
        button.disabled = !enabled;
      });

      elements.guessCategoryOptions.querySelectorAll("[data-guess-category]").forEach((button) => {
        button.classList.toggle("selected", button.dataset.guessCategory === state.guessCategoryId);
        button.setAttribute("aria-pressed", String(button.dataset.guessCategory === state.guessCategoryId));
      });
    }

    function closeGuessSetup() {
      elements.guessSetup.hidden = true;
      if (!elements.settingsPanel.classList.contains("open")) {
        elements.scrim.classList.remove("open");
      }
    }

    function openGuessSetup() {
      stopAuto();
      closeGameMenu();

      const categories = activeCategoryIds();
      if (!categories.length) {
        elements.message.textContent = "Select at least one word first.";
        openSettings();
        return;
      }

      state.guessCategoryId = categories.length === 1 ? categories[0] : null;
      elements.guessCategorySection.hidden = categories.length <= 1;

      const buttons = categories.map((categoryId) => {
        const category = data.getCategory(categoryId);
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.guessCategory = categoryId;
        button.textContent = category ? category.label : categoryId;
        button.setAttribute("aria-pressed", "false");
        return button;
      });
      elements.guessCategoryOptions.replaceChildren(...buttons);

      updateGuessSetupState();
      elements.guessSetup.hidden = false;
      elements.scrim.classList.add("open");
    }

    function startGuess(mode) {
      if (!state.guessCategoryId) return;

      const cards = guessCardsForCategory(state.guessCategoryId);
      if (!cards.length) return;

      state.guessMode = mode;
      state.guessDeck = cards;
      state.guessPosition = 0;
      state.guessRevealed = false;
      state.gameMode = "guess";
      closeGuessSetup();
      render();
    }

    function setGuessCard(index) {
      if (!state.guessDeck.length) return;
      state.guessPosition = (index + state.guessDeck.length) % state.guessDeck.length;
      state.guessRevealed = false;
      renderGuess();
    }

    function nextGuessCard() {
      setGuessCard(state.guessPosition + 1);
    }

    function randomGuessCard() {
      if (!state.guessDeck.length) return;
      if (state.guessDeck.length === 1) {
        setGuessCard(0);
        return;
      }

      let next = state.guessPosition;
      while (next === state.guessPosition) {
        next = Math.floor(Math.random() * state.guessDeck.length);
      }
      setGuessCard(next);
    }

    function renderGuessWordList() {
      const wordButtons = state.guessDeck.map((card, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "guess-word-button";
        button.textContent = card.word;
        button.classList.toggle("current", index === state.guessPosition);
        button.setAttribute("aria-current", index === state.guessPosition ? "true" : "false");
        button.addEventListener("click", () => setGuessCard(index));
        return button;
      });

      const randomButton = document.createElement("button");
      randomButton.type = "button";
      randomButton.className = "guess-random-button";
      randomButton.textContent = "↝";
      randomButton.title = "Random word";
      randomButton.setAttribute("aria-label", "Random word");
      randomButton.addEventListener("click", randomGuessCard);

      const words = document.createElement("div");
      words.className = "guess-word-buttons";
      words.append(...wordButtons);

      elements.guessWordList.replaceChildren(words, randomButton);
      elements.guessWordList.hidden = false;
    }

    function renderGuess() {
      syncShapePracticeControls(null);
      stopAuto();
      document.documentElement.classList.add("guess-focus");
      elements.missingAnswerHints.hidden = true;
      elements.answerArea.hidden = true;
      elements.gameArea.hidden = false;
      elements.floatingTimer.hidden = true;
      elements.autoButton.hidden = true;
      elements.previousButton.hidden = true;
      elements.nextButton.hidden = false;
      elements.nextButton.classList.add("game-action");
      elements.nextButton.dataset.gameAction = "next";
      elements.nextButton.textContent = "";
      elements.nextButton.setAttribute("aria-label", "Next Guess word");
      elements.shuffleButton.hidden = true;
      elements.gameTitle.textContent = "Guess";

      const card = state.guessDeck[state.guessPosition] || null;
      if (!card) {
        returnToFlashcards();
        return;
      }

      renderGuessWordList();

      const stage = document.createElement("div");
      stage.className = "guess-stage";
      stage.classList.toggle("hide-word", state.guessMode === "hideWord");

      let shownWord = null;
      if (state.guessMode === "showWord") {
        shownWord = document.createElement("div");
        shownWord.className = "guess-main-word";
        shownWord.textContent = card.word;
      }

      const reveal = document.createElement("button");
      reveal.type = "button";
      reveal.className = "guess-reveal-area";
      reveal.setAttribute("aria-label", state.guessRevealed ? "Hide picture" : "Show picture");

      if (state.guessRevealed) {
        const picture = document.createElement("div");
        picture.className = "guess-picture";
        applyVisual(picture, card);
        picture.setAttribute("role", "img");
        picture.setAttribute("aria-label", card.word);
        reveal.append(picture);
      } else {
        const prompt = document.createElement("span");
        prompt.className = "guess-tap-prompt";
        prompt.textContent = "Tap here to show";
        reveal.append(prompt);
      }

      reveal.addEventListener("click", () => {
        state.guessRevealed = !state.guessRevealed;
        renderGuess();
      });

      stage.append(reveal);
      if (shownWord) stage.append(shownWord);
      elements.gameArea.replaceChildren(stage);
      elements.counter.textContent = `${state.guessPosition + 1} / ${state.guessDeck.length}`;
      elements.modeLabel.textContent = state.guessMode === "showWord" ? "Guess — Show Word" : "Guess — Hide Word";
      requestAnimationFrame(alignSideNavigation);
    }

    function reset() {
      state.guessCategoryId = null;
      state.guessDeck = [];
      state.guessPosition = 0;
      state.guessRevealed = false;
    }

    function bind() {
      elements.guessCategoryOptions.addEventListener("click", (event) => {
        const button = event.target.closest("[data-guess-category]");
        if (!button) return;
        state.guessCategoryId = button.dataset.guessCategory;
        updateGuessSetupState();
      });

      elements.guessSetup.addEventListener("click", (event) => {
        const button = event.target.closest("[data-guess-mode]");
        if (!button || button.disabled) return;
        startGuess(button.dataset.guessMode);
      });

      elements.guessSetupClose.addEventListener("click", closeGuessSetup);

    }

    return Object.freeze({
      render: renderGuess, open: openGuessSetup, close: closeGuessSetup,
      next: nextGuessCard, random: randomGuessCard, reset, bind
    });
  }
  global.ALTE_GUESSING_GAME = Object.freeze({ create });
})(window);
