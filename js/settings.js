/* Classroom Settings — vocabulary selection, preview, display controls and teacher preferences. */
(function (global) {
  "use strict";
  const TEACHER_PREFERENCES_KEY = "alte.teacherPreferences.v1";
  const LEGACY_PREFERENCES_KEY = "alsoLetsTry.teacherPreferences.v1";

  function clampNumber(value, minimum, maximum, fallback) {
    const number = Number(value);
    return Number.isFinite(number)
      ? Math.max(minimum, Math.min(maximum, number))
      : fallback;
  }

  function readTeacherPreferences(window) {
    const defaults = {
      sizeBalance: 50,
      missingAnswerSize: 10
    };

    try {
      const stored = JSON.parse(window.localStorage.getItem(TEACHER_PREFERENCES_KEY) || window.localStorage.getItem(LEGACY_PREFERENCES_KEY) || "{}");
      return {
        sizeBalance: clampNumber(stored.sizeBalance, 0, 100, defaults.sizeBalance),
        missingAnswerSize: clampNumber(stored.missingAnswerSize, 8, 24, defaults.missingAnswerSize)
      };
    } catch {
      return defaults;
    }
  }

  function create({ state, elements, UNIT_CONFIG, UNIT_CATEGORY_IDS, initialIds, SHAPE_PRACTICE, data, currentCard, selectedCards, applyVisual, renderCardText, buildGameMenu, rebuildDeck, stopAuto, syncShapePracticeControls, render, document, window }) {
    const cardsById = new Map(UNIT_CONFIG.cards.map((card) => [card.id, card]));
    const CATEGORY_IDS = Object.fromEntries(
      UNIT_CATEGORY_IDS.map((categoryId) => [
        categoryId,
        UNIT_CONFIG.cards
          .filter((card) => card.category === categoryId)
          .map((card) => card.id)
      ])
    );

    function saveTeacherPreferences() {
      try {
        window.localStorage.setItem(
          TEACHER_PREFERENCES_KEY,
          JSON.stringify({
            sizeBalance: state.sizeBalance,
            missingAnswerSize: state.missingAnswerSize
          })
        );
      } catch {
        // Keep working normally if storage is unavailable.
      }
    }


    function updateSettingsPreview() {
      if (!elements.settingsPreview) return;

      const card = currentCard() || selectedCards()[0] || UNIT_CONFIG.cards[0] || null;
      const showPicture = state.displayMode !== "text";
      const showText = state.displayMode !== "picture";

      elements.settingsPreview.classList.toggle("picture-only", showPicture && !showText);
      elements.settingsPreview.classList.toggle("text-only", showText && !showPicture);
      elements.settingsPreviewPicture.hidden = !showPicture;
      elements.settingsPreviewText.hidden = !showText;

      if (!card) {
        elements.settingsPreviewPicture.removeAttribute("style");
        elements.settingsPreviewPicture.removeAttribute("aria-label");
        elements.settingsPreviewText.textContent = "No cards";
        return;
      }

      if (showPicture) {
        applyVisual(elements.settingsPreviewPicture, card);
        elements.settingsPreviewPicture.setAttribute("aria-label", card.word);
      }

      if (showText) {
        renderCardText(elements.settingsPreviewText, card);
      }
    }

    function toggleCategory(categoryId) {
      const ids = (CATEGORY_IDS[categoryId] || []).filter((id) => cardsById.has(id));
      if (!ids.length) return;

      const allSelected = ids.every((id) => state.selectedIds.has(id));

      if (allSelected) {
        ids.forEach((id) => state.selectedIds.delete(id));
      } else {
        ids.forEach((id) => state.selectedIds.add(id));
      }

      elements.message.textContent = "";
      syncCardOptions();
      rebuildDeck();
    }

    function buildCardOptions() {
      const fragment = document.createDocumentFragment();

      UNIT_CATEGORY_IDS.forEach((categoryId) => {
        const category = data.getCategory(categoryId);
        const cards = UNIT_CONFIG.cards.filter((card) => card.category === categoryId);
        if (!cards.length) return;

        const group = document.createElement("section");
        group.className = "category-word-group";
        group.dataset.categoryGroup = categoryId;

        const categoryButton = document.createElement("button");
        categoryButton.type = "button";
        categoryButton.className = "category-option";
        categoryButton.textContent = category ? category.label : categoryId;
        categoryButton.dataset.category = categoryId;
        categoryButton.setAttribute("aria-pressed", "false");
        categoryButton.addEventListener("click", () => toggleCategory(categoryId));

        const wordGrid = document.createElement("div");
        wordGrid.className = "category-card-grid";

        cards.forEach((card) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "card-option";
          button.textContent = card.optionLabel || card.word;
          button.title = card.word;
          button.dataset.cardId = card.id;
          button.addEventListener("click", () => toggleCard(card.id));
          wordGrid.append(button);
        });

        group.append(categoryButton, wordGrid);
        fragment.append(group);
      });

      elements.cardOptionGrid.replaceChildren(fragment);
      syncCardOptions();
    }

    function syncCategoryOptions() {
      elements.cardOptionGrid.querySelectorAll("[data-category]").forEach((button) => {
        const ids = (CATEGORY_IDS[button.dataset.category] || []).filter((id) => cardsById.has(id));
        const selectedCount = ids.filter((id) => state.selectedIds.has(id)).length;
        const allSelected = ids.length > 0 && selectedCount === ids.length;
        const noneSelected = selectedCount === 0;
        const partialSelected = !allSelected && !noneSelected;

        button.classList.toggle("all-selected", allSelected);
        button.classList.toggle("partial-selected", partialSelected);
        button.classList.toggle("none-selected", noneSelected);
        button.classList.toggle("selected", allSelected);
        button.setAttribute("aria-pressed", allSelected ? "true" : partialSelected ? "mixed" : "false");
      });
    }

    function syncCardOptions() {
      elements.cardOptionGrid.querySelectorAll("[data-card-id]").forEach((button) => {
        const selected = state.selectedIds.has(button.dataset.cardId);
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      syncCategoryOptions();

      const allSelected =
        UNIT_CONFIG.cards.length > 0 &&
        state.selectedIds.size === UNIT_CONFIG.cards.length;
      elements.selectAllButton.textContent = allSelected ? "Clear all" : "Select all";
      elements.selectAllButton.setAttribute(
        "aria-label",
        allSelected ? "Clear all selected words" : "Select all words"
      );

      updateSettingsPreview();
      buildGameMenu();
    }

    function toggleCard(id) {
      if (state.selectedIds.has(id)) {
        state.selectedIds.delete(id);
      } else {
        state.selectedIds.add(id);
      }

      elements.message.textContent = "";
      syncCardOptions();
      rebuildDeck();
    }

    function openSettings() {
      stopAuto();
      updateSettingsPreview();
      elements.settingsPanel.classList.add("open");
      elements.scrim.classList.add("open");
    }

    function bind() {
      elements.selectAllButton.addEventListener("click", () => {
        const allSelected =
          UNIT_CONFIG.cards.length > 0 &&
          state.selectedIds.size === UNIT_CONFIG.cards.length;

        state.selectedIds = allSelected
          ? new Set()
          : new Set(UNIT_CONFIG.cards.map((card) => card.id));

        elements.message.textContent = "";
        syncCardOptions();
        rebuildDeck();
      });

      elements.resetButton.addEventListener("click", () => {
        stopAuto();
        state.selectedIds = new Set(initialIds);
        state.displayMode = UNIT_CONFIG.defaultDisplayMode || "pictureText";
        state.letterColourMode = UNIT_CONFIG.defaultLetterColourMode || "plain";
        state.schoolShortened = false;
        state.shapeNumberEnabled = false;
        state.shapeColourPhraseEnabled = false;
        state.shapeCount = 1;
        state.shapeColours = SHAPE_PRACTICE
          ? { ...(SHAPE_PRACTICE.defaultColours || {}) }
          : {};
        state.autoSeconds = UNIT_CONFIG.autoSeconds;
        state.countdown = state.autoSeconds;
        const resetDisplayMode = document.querySelector(
          `input[name="displayMode"][value="${state.displayMode}"]`
        );
        if (resetDisplayMode) resetDisplayMode.checked = true;
        const resetLetterColourMode = document.querySelector(
          `input[name="letterColourMode"][value="${state.letterColourMode}"]`
        );
        if (resetLetterColourMode) resetLetterColourMode.checked = true;
        syncShapePracticeControls();
        elements.sizeBalanceRange.value = String(state.sizeBalance);
        elements.missingAnswerSizeRange.value = String(state.missingAnswerSize);
        document.documentElement.style.setProperty(
          "--missing-answer-size",
          `${state.missingAnswerSize}px`
        );
        elements.missingAnswerSizeValue.textContent = `${state.missingAnswerSize} px`;
        syncCardOptions();
        rebuildDeck();
      });

      document.querySelectorAll('input[name="displayMode"]').forEach((radio) => {
        radio.addEventListener("change", () => {
          stopAuto();
          state.displayMode = radio.value;
          state.gameMode = "flashcards";
          render();
        });
      });

      if (elements.schoolShortenButton) {
        elements.schoolShortenButton.addEventListener("click", () => {
          state.schoolShortened = !state.schoolShortened;
          state.gameMode = "flashcards";
          render();
        });
      }

      document.querySelectorAll('input[name="letterColourMode"]').forEach((radio) => {
        radio.addEventListener("change", () => {
          state.letterColourMode = radio.value;
          render();
        });
      });

      if (elements.shapeNumberToggle) {
        elements.shapeNumberToggle.addEventListener("change", () => {
          state.shapeNumberEnabled = elements.shapeNumberToggle.checked;
          if (!state.shapeNumberEnabled) state.shapeCount = 1;
          render();
        });
      }

      if (elements.shapeColourToggle) {
        elements.shapeColourToggle.addEventListener("change", () => {
          state.shapeColourPhraseEnabled = elements.shapeColourToggle.checked;
          render();
        });
      }

      elements.sizeBalanceRange.addEventListener("input", () => {
        state.sizeBalance = Number(elements.sizeBalanceRange.value);
        saveTeacherPreferences();
        render();
      });
      elements.missingAnswerSizeRange.addEventListener("input", () => {
        state.missingAnswerSize = Number(elements.missingAnswerSizeRange.value);
        document.documentElement.style.setProperty("--missing-answer-size", `${state.missingAnswerSize}px`);
        elements.missingAnswerSizeValue.textContent = `${state.missingAnswerSize} px`;
        saveTeacherPreferences();
      });

    }

    function close() {
      elements.settingsPanel.classList.remove("open");
    }

    return Object.freeze({
      open: openSettings, close, bind, buildCardOptions,
      updatePreview: updateSettingsPreview, syncCardOptions
    });
  }
  global.ALTE_SETTINGS = Object.freeze({ create, readTeacherPreferences });
})(window);
