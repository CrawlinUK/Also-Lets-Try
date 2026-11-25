
    (() => {
      "use strict";

      const UNIT_CONFIG = window.ALTE_UNIT_CONFIG;
      if (!UNIT_CONFIG || !Array.isArray(UNIT_CONFIG.cards)) {
        throw new Error("Shared unit config was not loaded.");
      }

      const UNIT_CATEGORY_IDS = window.ALTE_UNIT_CATEGORY_IDS
        || [...new Set(UNIT_CONFIG.cards.map((card) => card.category).filter(Boolean))];
      const SHAPE_PRACTICE = UNIT_CONFIG.shapePractice || null;
      // This class scopes the shape practice layout to whichever lesson or
      // standalone category actually enables the shared controls.
      document.documentElement.classList.toggle(
        "shape-practice-mode", Boolean(SHAPE_PRACTICE)
      );
      const SHAPE_NUMBER_WORDS = Object.freeze({
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five"
      });

      const appHost = document.getElementById("alteApp");
      if (!appHost) {
        throw new Error("Shared unit app host was not found.");
      }
      appHost.innerHTML = "<header class=\"site-header\">\n    <div class=\"site-header-inner\">\n      <button class=\"menu-button\" id=\"menuButton\" type=\"button\" aria-label=\"Return to unit menu\"></button>\n\n      <div class=\"site-title\">\n        <span class=\"unit-word\">Unit</span>\n        <span class=\"unit-number\" id=\"unitNumber\"></span>\n        <span class=\"unit-name\" id=\"unitName\"></span>\n      </div>\n\n      <div class=\"game-title\" id=\"gameTitle\" aria-live=\"polite\"></div>\n    </div>\n  </header>\n\n  <main class=\"app\" id=\"appScreen\">\n    <section class=\"flashcard\" id=\"flashcard\" aria-live=\"polite\">\n      <div class=\"flashcard-stage\">\n        <div class=\"answer-area\" id=\"answerArea\">\n          <div class=\"picture-frame\" id=\"pictureFrame\">\n            <div class=\"card-picture\" id=\"cardPicture\" role=\"img\"></div>\n          </div>\n          <div class=\"display-text\" id=\"displayText\"></div>\n        </div>\n\n        <div class=\"game-area\" id=\"gameArea\" hidden></div>\n      </div>\n\n    </section>\n\n    <button class=\"side-nav side-previous\" id=\"previousButton\" type=\"button\" aria-label=\"Previous card\"></button>\n    <button class=\"side-nav side-next\" id=\"nextButton\" type=\"button\" aria-label=\"Next card\"></button>\n    <aside class=\"missing-answer-hints\" id=\"missingAnswerHints\" aria-label=\"Teacher Missing Game answers\" hidden></aside>\n    <aside class=\"guess-word-list\" id=\"guessWordList\" aria-label=\"Guess game word list\" hidden></aside>\n\n    <nav class=\"control-bar\" aria-label=\"Flashcard controls\">\n      <div class=\"card-counter\">\n        <strong id=\"counter\">1 / 1</strong>\n        <span id=\"modeLabel\">Flashcard mode</span>\n      </div>\n\n      <button class=\"control shuffle\" id=\"shuffleButton\" type=\"button\">Shuffle</button>\n      <button class=\"control quiet\" id=\"phraseSwitchButton\" type=\"button\" hidden></button>\n\n      <div class=\"game-menu-wrap\">\n        <button class=\"control quiet game-menu-button\" id=\"gameButton\" type=\"button\"\n                aria-haspopup=\"true\" aria-expanded=\"false\">Tools</button>\n        <div class=\"game-menu\" id=\"gameMenu\" hidden></div>\n      </div>\n\n      <div class=\"floating-timer timer-control\" id=\"floatingTimer\" aria-label=\"Automatic timer\">\n        <button id=\"timerDownButton\" type=\"button\" aria-label=\"Decrease timer\">−</button>\n        <span class=\"timer-value\" id=\"timerValue\">3 sec</span>\n        <button id=\"timerUpButton\" type=\"button\" aria-label=\"Increase timer\">+</button>\n      </div>\n\n      <button class=\"floating-auto\" id=\"autoButton\" type=\"button\"\n              aria-label=\"Start automatic flashcards\" title=\"Start automatic flashcards\"></button>\n\n      <button class=\"control quiet settings-icon-button\" id=\"settingsButton\" type=\"button\" aria-label=\"Settings\">Settings</button>\n    </nav>\n\n    <div class=\"keyboard-help collapsed\" id=\"keyboardHelp\">\n      <div class=\"keyboard-help-text\">\n        ← / → = previous / next<br>\n        Space / Enter = next<br>\n        A = start / stop auto<br>\n        R = shuffle<br>\n        G = tools<br>\n        ↑ / ↓ = timer up / down<br>\n        Esc = close menus / help\n      </div>\n      <div class=\"keyboard-help-icon\">!</div>\n    </div>\n  </main>\n\n  <div class=\"scrim\" id=\"scrim\"></div>\n\n  <div class=\"guess-setup\" id=\"guessSetup\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"guessSetupTitle\" hidden>\n    <div class=\"guess-setup-card\">\n      <button class=\"guess-setup-close\" id=\"guessSetupClose\" type=\"button\" aria-label=\"Close Guess setup\">×</button>\n      <h2 id=\"guessSetupTitle\">Guess</h2>\n      <section class=\"guess-category-section\" id=\"guessCategorySection\">\n        <p>Please choose a category</p>\n        <div class=\"guess-category-options\" id=\"guessCategoryOptions\"></div>\n      </section>\n      <section class=\"guess-mode-section\">\n        <p>Choose a screen mode</p>\n        <div class=\"guess-mode-options\">\n          <button type=\"button\" data-guess-mode=\"showWord\">Show Word</button>\n          <button type=\"button\" data-guess-mode=\"hideWord\">Hide Word<small>All words will be listed on the left.</small></button>\n        </div>\n      </section>\n    </div>\n  </div>\n\n  <aside class=\"settings-panel\" id=\"settingsPanel\" aria-label=\"Settings\">\n    <div class=\"settings-heading\">\n      <h2>Settings</h2>\n      <button class=\"close-button\" id=\"closeSettingsButton\" type=\"button\" aria-label=\"Close settings\">×</button>\n    </div>\n\n    <section class=\"setting-section display-mode-section\">\n      <h3>Display mode</h3>\n      <div class=\"segmented display-mode-options\">\n        <label>\n          <input type=\"radio\" name=\"displayMode\" value=\"pictureText\" checked>\n          <span id=\"pictureTextLabel\">Picture + text</span>\n        </label>\n        <label>\n          <input type=\"radio\" name=\"displayMode\" value=\"picture\">\n          <span id=\"pictureOnlyLabel\">Picture only</span>\n        </label>\n        <label class=\"picture-sentence-option\" id=\"pictureSentenceOption\">\n          <input type=\"radio\" name=\"displayMode\" value=\"pictureSentence\">\n          <span id=\"pictureSentenceLabel\">Picture + sentence</span>\n        </label>\n        <label>\n          <input type=\"radio\" name=\"displayMode\" value=\"text\">\n          <span id=\"textOnlyLabel\">Text only</span>\n        </label>\n      </div>\n    </section>\n\n    <div class=\"settings-preview\" id=\"settingsPreview\" aria-label=\"Display preview\">\n      <div class=\"settings-preview-picture\" id=\"settingsPreviewPicture\" role=\"img\"></div>\n      <div class=\"settings-preview-text\" id=\"settingsPreviewText\"></div>\n    </div>\n\n    <section class=\"setting-section selection-section\">\n      <div class=\"setting-actions setting-actions-top\">\n        <button id=\"selectAllButton\" type=\"button\">Select all</button>\n        <button id=\"resetButton\" type=\"button\">Reset</button>\n      </div>\n      <p class=\"message\" id=\"message\"></p>\n      <div class=\"category-word-groups\" id=\"cardOptionGrid\"></div>\n    </section>\n\n    <section class=\"setting-section secondary-setting-section\">\n      <h3>Image / text size</h3>\n      <div class=\"balance-labels\" aria-hidden=\"true\">\n        <span id=\"balancePictureLabel\">Image</span>\n        <span id=\"balanceTextLabel\">Text</span>\n      </div>\n      <div class=\"balance-slider\">\n        <span>◀</span>\n        <input id=\"sizeBalanceRange\" type=\"range\" min=\"0\" max=\"100\" value=\"50\" step=\"5\"\n               aria-label=\"Image and text size balance\">\n        <span>▶</span>\n      </div>\n    </section>\n\n    <section class=\"setting-section secondary-setting-section\">\n      <h3>Missing Game teacher hint answer size</h3>\n      <div class=\"missing-answer-size-row\">\n        <input id=\"missingAnswerSizeRange\" type=\"range\" min=\"8\" max=\"24\" value=\"10\" step=\"1\"\n               aria-label=\"Missing Game teacher hint answer size\">\n        <output class=\"missing-answer-size-value\" id=\"missingAnswerSizeValue\" for=\"missingAnswerSizeRange\">10 px</output>\n      </div>\n    </section>\n\n  </aside>";

      // These two phrases belong in Unit 2 Settings, not in the footer.
      const phraseOptionAnchor = document.getElementById("pictureSentenceOption");
      if (phraseOptionAnchor) {
        phraseOptionAnchor.insertAdjacentHTML("afterend", `
          <label class="picture-its-option" hidden>
            <input type="radio" name="displayMode" value="pictureIts">
            <span id="pictureItsLabel">Picture + It’s</span>
          </label>
          <label class="picture-lets-option" hidden>
            <input type="radio" name="displayMode" value="pictureLets">
            <span id="pictureLetsLabel">Picture + Let’s</span>
          </label>`);
      }

      const settingsPreviewNode = document.getElementById("settingsPreview");
      if (settingsPreviewNode) {
        settingsPreviewNode.insertAdjacentHTML(
          "afterend",
          `<section class="setting-section letter-colour-section" id="letterColourSection" hidden>
            <h3>Letter colour</h3>
            <div class="segmented display-mode-options">
              <label>
                <input type="radio" name="letterColourMode" value="plain" checked>
                <span>Plain</span>
              </label>
              <label>
                <input type="radio" name="letterColourMode" value="colour">
                <span>Colour</span>
              </label>
            </div>
          </section>`
        );
      }

      if (settingsPreviewNode) {
        settingsPreviewNode.insertAdjacentHTML("afterend", `
          <section class="setting-section school-shortening-section" id="schoolShortenSection" hidden>
            <h3>Office names</h3>
            <button type="button" class="school-shortening-button" id="schoolShortenButton"
              aria-pressed="false">Remove “school” from office names</button>
          </section>`);
      }

      if (SHAPE_PRACTICE) {
        const displayOptionsNode = document.querySelector(".display-mode-options");
        if (displayOptionsNode) {
          displayOptionsNode.classList.add("shape-practice-display-options");

          const pictureTextLabel = displayOptionsNode.querySelector('input[value="pictureText"]')?.closest("label");
          const pictureLabel = displayOptionsNode.querySelector('input[value="picture"]')?.closest("label");
          const textLabel = displayOptionsNode.querySelector('input[value="text"]')?.closest("label");
          if (pictureTextLabel) pictureTextLabel.classList.add("shape-display-half");
          if (pictureLabel) pictureLabel.classList.add("shape-display-half");
          if (textLabel) textLabel.classList.add("shape-display-half");

          displayOptionsNode.insertAdjacentHTML(
            "beforeend",
            `<label class="shape-practice-setting shape-number-setting">
              <input type="checkbox" id="shapeNumberToggle">
              <span>Number</span>
            </label>
            <label class="shape-practice-setting shape-colour-setting">
              <input type="checkbox" id="shapeColourToggle">
              <span>Colour</span>
            </label>`
          );
        }

        const flashcardNode = document.getElementById("flashcard");
        if (flashcardNode) {
          flashcardNode.insertAdjacentHTML(
            "beforeend",
            `<aside class="shape-practice-tower shape-number-tower" id="shapeNumberTower"
                    aria-label="Number of shapes" hidden></aside>
             <aside class="shape-practice-tower shape-colour-tower" id="shapeColourTower"
                    aria-label="Shape colour" hidden></aside>`
          );
        }
      }

      const $ = (id) => document.getElementById(id);
      const elements = {
        flashcard: $("flashcard"),
        unitNumber: $("unitNumber"),
        unitName: $("unitName"),
        gameTitle: $("gameTitle"),
        menuButton: $("menuButton"),
        answerArea: $("answerArea"),
        pictureFrame: $("pictureFrame"),
        cardPicture: $("cardPicture"),
        displayText: $("displayText"),
        gameArea: $("gameArea"),
        floatingTimer: $("floatingTimer"),
        timerDownButton: $("timerDownButton"),
        timerUpButton: $("timerUpButton"),
        timerValue: $("timerValue"),
        autoButton: $("autoButton"),
        previousButton: $("previousButton"),
        nextButton: $("nextButton"),
        counter: $("counter"),
        modeLabel: $("modeLabel"),
        shuffleButton: $("shuffleButton"),
        phraseSwitchButton: $("phraseSwitchButton"),
        gameButton: $("gameButton"),
        gameMenu: $("gameMenu"),
        settingsButton: $("settingsButton"),
        keyboardHelp: $("keyboardHelp"),
        scrim: $("scrim"),
        settingsPanel: $("settingsPanel"),
        closeSettingsButton: $("closeSettingsButton"),
        settingsPreview: $("settingsPreview"),
        settingsPreviewPicture: $("settingsPreviewPicture"),
        settingsPreviewText: $("settingsPreviewText"),
        cardOptionGrid: $("cardOptionGrid"),
        selectAllButton: $("selectAllButton"),
        resetButton: $("resetButton"),
        message: $("message"),
        sizeBalanceRange: $("sizeBalanceRange"),
        missingAnswerHints: $("missingAnswerHints"),
        guessWordList: $("guessWordList"),
        guessSetup: $("guessSetup"),
        guessSetupClose: $("guessSetupClose"),
        guessCategorySection: $("guessCategorySection"),
        guessCategoryOptions: $("guessCategoryOptions"),
        missingAnswerSizeRange: $("missingAnswerSizeRange"),
        missingAnswerSizeValue: $("missingAnswerSizeValue"),
        pictureSentenceOption: $("pictureSentenceOption"),
        pictureSentenceLabel: $("pictureSentenceLabel"),
        schoolShortenSection: $("schoolShortenSection"),
        schoolShortenButton: $("schoolShortenButton"),
        letterColourSection: $("letterColourSection"),
        shapePracticeSection: $("shapePracticeSection"),
        shapeNumberToggle: $("shapeNumberToggle"),
        shapeColourToggle: $("shapeColourToggle"),
        shapeNumberTower: $("shapeNumberTower"),
        shapeColourTower: $("shapeColourTower")
      };

      const textbookIds = UNIT_CONFIG.cards
        .filter((card) => card.textbook)
        .map((card) => card.id);

      const initialIds = textbookIds.length
        ? textbookIds
        : UNIT_CONFIG.cards.slice(0, 1).map((card) => card.id);

      const teacherPreferences = window.ALTE_SETTINGS.readTeacherPreferences(window);

      const state = {
        selectedIds: new Set(initialIds),
        deck: [],
        position: 0,
        displayMode: UNIT_CONFIG.defaultDisplayMode || "pictureText",
        letterColourMode: UNIT_CONFIG.defaultLetterColourMode || "plain",
        schoolShortened: false,
        phraseSwitchMode:
          UNIT_CONFIG.phraseSwitch && UNIT_CONFIG.phraseSwitch.initial
            ? UNIT_CONFIG.phraseSwitch.initial
            : (
                UNIT_CONFIG.phraseSwitch
                && Array.isArray(UNIT_CONFIG.phraseSwitch.modes)
                && UNIT_CONFIG.phraseSwitch.modes[0]
                ? UNIT_CONFIG.phraseSwitch.modes[0].id
                : ""
              ),
        shapeNumberEnabled: false,
        shapeColourPhraseEnabled: false,
        shapeCount: 1,
        shapeColours: SHAPE_PRACTICE
          ? { ...(SHAPE_PRACTICE.defaultColours || {}) }
          : {},
        gameMode: "flashcards",
        sizeBalance: teacherPreferences.sizeBalance,
        missingAnswerSize: teacherPreferences.missingAnswerSize,
        autoSeconds: UNIT_CONFIG.autoSeconds,
        countdown: UNIT_CONFIG.autoSeconds,
        autoTimer: null,
        countdownTimer: null,
        missingOrder: [],
        hiddenMissingIds: new Set(),
        flashBoardInk: [],
        flashBoardUndo: [],
        flashBoardRedo: [],
        flashBoardPenColour: "#e53935",
        flashBoardCardScale: 1,
        flashBoardLabelsVisible: true,
        flashBoardPositions: new Map(),
        flashBoardBinned: new Set(),
        flashBoardTexts: [],
        flashBoardPluralCards: new Set(),
        flashBoardLayers: new Map(),
        flashBoardLayerCounter: 0,
        keywordOrder: [],
        keywordSelectedIds: new Set(),
        guessCategoryId: null,
        guessMode: "showWord",
        guessDeck: [],
        guessPosition: 0,
        guessRevealed: false,
      };

      const { applyVisual, classroomWord, cardText, renderCardText } = window.ALTE_PRESENTATION.create({
        state, UNIT_CONFIG, SHAPE_PRACTICE, data: ALTE_DATA,
        isShapePracticeCard, shapeColourName, shapePracticeText, document
      });
      const { visualRatio, optimalGameShape, setGridShape } = window.ALTE_GRID_LAYOUT.create({
        UNIT_CONFIG, ResizeObserver: window.ResizeObserver, requestAnimationFrame
      });

      const flashCards = window.ALTE_FLASH_CARDS.create({
        state, elements, UNIT_CONFIG, currentCard, syncShapePracticeControls, applyVisual,
        cardText, renderCardText, render, shuffled, alignSideNavigation,
        document, window, requestAnimationFrame, getComputedStyle,
        ResizeObserver: window.ResizeObserver, setInterval, clearInterval
      });

      const { missing: missingGame, keyword: keywordGame } = window.ALTE_GRID_GAMES.create({
        state, elements, selectedCards, showGridGameLayout, applyVisual,
        setGridShape, alignSideNavigation, shuffled, document, requestAnimationFrame
      });

      const guessingGame = window.ALTE_GUESSING_GAME.create({
        state, elements, selectedCards, stopAuto: flashCards.stopAuto, closeGameMenu, activeCategoryIds,
        openSettings: () => settings.open(), data: ALTE_DATA, render, syncShapePracticeControls, returnToFlashcards,
        applyVisual, alignSideNavigation, document, requestAnimationFrame
      });

      const flashBoard = window.ALTE_FLASH_BOARD.create({
        state, elements, selectedCards, showGridGameLayout, applyVisual, visualRatio,
        optimalGameShape, alignSideNavigation, document, window, requestAnimationFrame
      });

      const settings = window.ALTE_SETTINGS.create({
        state, elements, UNIT_CONFIG, UNIT_CATEGORY_IDS, initialIds, SHAPE_PRACTICE,
        data: ALTE_DATA, currentCard, selectedCards, applyVisual, renderCardText,
        buildGameMenu, rebuildDeck, stopAuto: flashCards.stopAuto, syncShapePracticeControls,
        render, document, window
      });

      function isShapePracticeCard(card) {
        return Boolean(SHAPE_PRACTICE && card && card.category === "shapes");
      }

      function shapeColourName(card) {
        if (!isShapePracticeCard(card)) return "";
        return (
          state.shapeColours[card.id]
          || (card.visual && card.visual.defaultColourName)
          || (SHAPE_PRACTICE.defaultColours && SHAPE_PRACTICE.defaultColours[card.id])
          || ""
        );
      }

      function shapeColourEntries() {
        if (!SHAPE_PRACTICE) return [];
        const colourCategoryId = SHAPE_PRACTICE.colourCategoryId || "colours";
        const colourCategory = ALTE_DATA.getCategory(colourCategoryId);
        const entries = (colourCategory ? colourCategory.items : []).filter((entry) => entry.hex);
        const byId = new Map(entries.map((entry) => [entry.id, entry]));
        const requestedOrder = Array.isArray(SHAPE_PRACTICE.colourOrder)
          ? SHAPE_PRACTICE.colourOrder
          : [];

        const ordered = requestedOrder
          .map((id) => byId.get(id))
          .filter(Boolean);
        const used = new Set(ordered.map((entry) => entry.id));
        const remaining = entries.filter((entry) => !used.has(entry.id));
        return [...ordered, ...remaining];
      }

      function randomiseShapeColours() {
        if (!SHAPE_PRACTICE) return;
        const shapeCards = UNIT_CONFIG.cards.filter((card) => card.category === "shapes");
        const colourIds = shuffled(shapeColourEntries().map((entry) => entry.id));

        shapeCards.forEach((card, index) => {
          if (colourIds[index]) {
            state.shapeColours[card.id] = colourIds[index];
          }
        });
      }

      function shapePracticeText(card) {
        if (!isShapePracticeCard(card)) return card ? card.word : "";

        const parts = [];
        const count = state.shapeNumberEnabled ? state.shapeCount : 1;

        if (state.shapeNumberEnabled) {
          parts.push(SHAPE_NUMBER_WORDS[count] || String(count));
        }
        if (state.shapeColourPhraseEnabled) {
          const colourName = shapeColourName(card);
          if (colourName) parts.push(colourName.replace(/-/g, " "));
        }

        const noun = count === 1 ? card.word : `${card.word}s`;
        parts.push(noun);
        return parts.join(" ");
      }

      function buildShapePracticeControls() {
        if (!SHAPE_PRACTICE || !elements.shapeNumberTower || !elements.shapeColourTower) return;

        const counts = Array.isArray(SHAPE_PRACTICE.counts) && SHAPE_PRACTICE.counts.length
          ? SHAPE_PRACTICE.counts
          : [1, 2, 3, 4, 5];

        const numberButtons = counts.map((count) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "shape-number-choice";
          button.dataset.shapeCount = String(count);
          button.textContent = String(count);
          button.setAttribute("aria-label", `${count} shape${count === 1 ? "" : "s"}`);
          button.addEventListener("click", () => {
            state.shapeCount = count;
            render();
          });
          return button;
        });
        elements.shapeNumberTower.replaceChildren(...numberButtons);

        const colourButtons = [];
        const randomButton = document.createElement("button");
        randomButton.type = "button";
        randomButton.className = "shape-colour-choice shape-colour-random";
        randomButton.title = "Random colours";
        randomButton.setAttribute("aria-label", "Randomise all shape colours");
        randomButton.addEventListener("click", () => {
          randomiseShapeColours();
          render();
        });
        colourButtons.push(randomButton);

        shapeColourEntries().forEach((entry) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "shape-colour-choice";
          button.dataset.shapeColour = entry.id;
          button.style.setProperty("--swatch-colour", entry.hex);
          button.title = entry.id.replace(/-/g, " ");
          button.setAttribute("aria-label", `Use ${entry.id.replace(/-/g, " ")} for this shape`);
          if (entry.id === "white") button.classList.add("light-swatch");
          button.addEventListener("click", () => {
            const card = currentCard();
            if (!isShapePracticeCard(card)) return;
            state.shapeColours[card.id] = entry.id;
            render();
          });
          colourButtons.push(button);
        });
        elements.shapeColourTower.replaceChildren(...colourButtons);
      }

      function syncShapePracticeControls(card = currentCard()) {
        if (!SHAPE_PRACTICE) return;

        if (elements.shapeNumberToggle) {
          elements.shapeNumberToggle.checked = state.shapeNumberEnabled;
        }
        if (elements.shapeColourToggle) {
          elements.shapeColourToggle.checked = state.shapeColourPhraseEnabled;
        }

        const showTowers = state.gameMode === "flashcards" && isShapePracticeCard(card);
        if (elements.shapeNumberTower) {
          elements.shapeNumberTower.hidden = !showTowers || !state.shapeNumberEnabled;
          elements.shapeNumberTower.querySelectorAll("[data-shape-count]").forEach((button) => {
            const selected = Number(button.dataset.shapeCount) === state.shapeCount;
            button.classList.toggle("selected", selected);
            button.setAttribute("aria-pressed", String(selected));
          });
        }

        if (elements.shapeColourTower) {
          elements.shapeColourTower.hidden = !showTowers;
          const selectedColour = isShapePracticeCard(card) ? shapeColourName(card) : "";
          elements.shapeColourTower.querySelectorAll("[data-shape-colour]").forEach((button) => {
            const selected = button.dataset.shapeColour === selectedColour;
            button.classList.toggle("selected", selected);
            button.setAttribute("aria-pressed", String(selected));
          });
        }
      }

      function shuffled(items) {
        const result = [...items];
        for (let index = result.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
        }
        return result;
      }

      function phraseSwitchModeConfig() {
        const config = UNIT_CONFIG.phraseSwitch;
        if (!config || !Array.isArray(config.modes)) return null;
        return config.modes.find((mode) => mode.id === state.phraseSwitchMode) || config.modes[0] || null;
      }

      function phraseSwitchCardActive(card) {
        const config = UNIT_CONFIG.phraseSwitch;
        // An explicit All words mode always respects the teacher's selections.
        // Other modes remain optional focus filters for specific phrases.
        if (!config || state.phraseSwitchMode === "all") return true;
        if (!card.phraseMode) return config.includeUnassigned !== false;
        return card.phraseMode === state.phraseSwitchMode;
      }

      function syncPhraseSwitchButton() {
        if (!elements.phraseSwitchButton) return;
        const config = UNIT_CONFIG.phraseSwitch;
        const mode = phraseSwitchModeConfig();
        elements.phraseSwitchButton.hidden = !config || !mode;
        if (!config || !mode) return;
        elements.phraseSwitchButton.textContent = mode.label || mode.id;
        elements.phraseSwitchButton.setAttribute(
          "aria-label",
          `Phrase: ${mode.label || mode.id}. Switch phrase.`
        );
      }

      function togglePhraseSwitch() {
        const config = UNIT_CONFIG.phraseSwitch;
        if (!config || !Array.isArray(config.modes) || config.modes.length < 2) return;
        const index = Math.max(0, config.modes.findIndex((mode) => mode.id === state.phraseSwitchMode));
        const next = config.modes[(index + 1) % config.modes.length];
        state.phraseSwitchMode = next.id;
        syncPhraseSwitchButton();
        rebuildDeck();
      }

      function selectedCards() {
        return UNIT_CONFIG.cards.filter(
          (card) => state.selectedIds.has(card.id) && phraseSwitchCardActive(card)
        );
      }

      function currentCard() {
        return state.deck[state.position] || null;
      }

      function activeCategoryIds() {
        return [...new Set(
          selectedCards()
            .map((card) => card.category)
            .filter(Boolean)
        )];
      }

      function builtInGameEnabled(gameId) {
        return !UNIT_CONFIG.games || UNIT_CONFIG.games[gameId] !== false;
      }

      function makeGameMenuButton(label, attributes = {}) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        Object.entries(attributes).forEach(([name, value]) => {
          button.dataset[name] = value;
        });
        return button;
      }

      function buildGameMenu() {
        const fragment = document.createDocumentFragment();

        [
          ["missing", "Missing game"],
          ["keyword", "Keyword game"],
          ["guess", "Guess"],
          ["flashboard", "Flash Board"]
        ].forEach(([id, label]) => {
          if (builtInGameEnabled(id)) {
            fragment.append(makeGameMenuButton(label, { game: id }));
          }
        });

        const relevantExtras = ALTE_DATA.getExtraGamesForCategories(activeCategoryIds());
        relevantExtras.forEach((game) => {
          const button = makeGameMenuButton(game.name, { extraGame: game.id });
          button.classList.add("extra-game-button");
          fragment.append(button);
        });

        if (ALTE_DATA.getAllExtraGames().length) {
          const offTopicButton = makeGameMenuButton("Off topic games", { action: "offTopicGames" });
          offTopicButton.classList.add("off-topic-games-button");
          fragment.append(offTopicButton);
        }

        fragment.append(makeGameMenuButton("Back to flashcards", { game: "flashcards" }));
        elements.gameMenu.replaceChildren(fragment);
      }

      function openExtraGame(gameId) {
        const game = ALTE_DATA.getExtraGame(gameId);
        if (!game) return;
        closeGameMenu();
        window.open(game.url, "_blank", "noopener,noreferrer");
      }

      function initialisePage() {
        document.documentElement.classList.add("shared-unit-template");
        document.documentElement.dataset.book = UNIT_CONFIG.bookId || "book1";
        document.documentElement.dataset.unit = String(UNIT_CONFIG.unitNumber);
        document.title = UNIT_CONFIG.browserTitle;
        document.documentElement.style.setProperty("--unit-colour", UNIT_CONFIG.unitColour);
        document.documentElement.style.setProperty("--unit-number-colour", UNIT_CONFIG.unitNumberColour);
        document.documentElement.style.setProperty("--picture-ratio", UNIT_CONFIG.pictureAspectRatio);

        const unitWord = document.querySelector(".site-title .unit-word");
        if (unitWord) unitWord.textContent = "Unit";
        elements.unitNumber.textContent = UNIT_CONFIG.unitNumber;
        elements.unitName.textContent = UNIT_CONFIG.unitTitle;
        syncPhraseSwitchButton();
        const displayLabels = UNIT_CONFIG.displayModeLabels || {};
        const configuredDisplayModes =
          Array.isArray(UNIT_CONFIG.displayModes) && UNIT_CONFIG.displayModes.length
            ? UNIT_CONFIG.displayModes
            : ["pictureText", "picture", "pictureSentence", "text"];
        const allowedDisplayModes = new Set(configuredDisplayModes);
        const displayModeSection = document.querySelector(".display-mode-section");
        document.querySelectorAll('input[name="displayMode"]').forEach((radio) => {
          const label = radio.closest("label");
          if (label) label.hidden = !allowedDisplayModes.has(radio.value);
          radio.checked = radio.value === state.displayMode;
        });
        if (displayModeSection) {
          displayModeSection.hidden = configuredDisplayModes.length <= 1;
        }

        if (elements.letterColourSection) {
          elements.letterColourSection.hidden = !UNIT_CONFIG.letterColourControl;
          elements.letterColourSection.querySelectorAll('input[name="letterColourMode"]').forEach((radio) => {
            radio.checked = radio.value === state.letterColourMode;
          });
        }

        if (elements.schoolShortenSection) {
          elements.schoolShortenSection.hidden = !UNIT_CONFIG.schoolShortenSetting;
        }

        const pictureTextLabel = $("pictureTextLabel");
        const pictureOnlyLabel = $("pictureOnlyLabel");
        const textOnlyLabel = $("textOnlyLabel");
        if (pictureTextLabel && displayLabels.pictureText) pictureTextLabel.textContent = displayLabels.pictureText;
        if (pictureOnlyLabel && displayLabels.picture) pictureOnlyLabel.textContent = displayLabels.picture;
        if (textOnlyLabel && displayLabels.text) textOnlyLabel.textContent = displayLabels.text;
        if ($("pictureItsLabel") && displayLabels.pictureIts) $("pictureItsLabel").textContent = displayLabels.pictureIts;
        if ($("pictureLetsLabel") && displayLabels.pictureLets) $("pictureLetsLabel").textContent = displayLabels.pictureLets;

        if (elements.pictureSentenceOption) {
          const showPictureSentence = UNIT_CONFIG.showPictureSentenceMode !== false;
          elements.pictureSentenceOption.hidden = !showPictureSentence;
          if (showPictureSentence && elements.pictureSentenceLabel) {
            elements.pictureSentenceLabel.textContent =
              displayLabels.pictureSentence ||
              `Picture + ${UNIT_CONFIG.sentenceLabel || "sentence"}`;
          }
        }

        const balanceLabels = UNIT_CONFIG.balanceLabels || {};
        const balancePictureLabel = $("balancePictureLabel");
        const balanceTextLabel = $("balanceTextLabel");
        if (balancePictureLabel && balanceLabels.picture) balancePictureLabel.textContent = balanceLabels.picture;
        if (balanceTextLabel && balanceLabels.text) balanceTextLabel.textContent = balanceLabels.text;

        state.autoSeconds = Math.max(
          UNIT_CONFIG.autoSecondsMinimum,
          Math.min(UNIT_CONFIG.autoSecondsMaximum, UNIT_CONFIG.autoSeconds)
        );
        state.countdown = state.autoSeconds;

        elements.sizeBalanceRange.value = String(state.sizeBalance);
        elements.missingAnswerSizeRange.value = String(state.missingAnswerSize);
        elements.missingAnswerSizeValue.textContent = `${state.missingAnswerSize} px`;
        document.documentElement.style.setProperty(
          "--missing-answer-size",
          `${state.missingAnswerSize}px`
        );

        buildShapePracticeControls();
        syncShapePracticeControls();

        buildGameMenu();
        settings.buildCardOptions();
        rebuildDeck();
      }

      function rebuildDeck() {
        flashCards.stopAuto();
        let cards = selectedCards();
        // When the current phrase has no selected cards, follow the selected
        // vocabulary into a phrase that does. This fixes Weather-only
        // selections opening an empty "Let's ~" deck in Book 2 Unit 2.
        const modes = UNIT_CONFIG.phraseSwitch?.modes;
        if (!cards.length && Array.isArray(modes)) {
          const previous = state.phraseSwitchMode;
          for (const mode of modes) {
            if (mode.id === previous) continue;
            state.phraseSwitchMode = mode.id;
            const available = selectedCards();
            if (available.length) {
              cards = available;
              syncPhraseSwitchButton();
              break;
            }
          }
          if (!cards.length) state.phraseSwitchMode = previous;
        }
        state.deck = cards;
        state.position = 0;
        resetGameState();
        render();
      }

      function resetGameState() {
        missingGame.reset();
        keywordGame.reset();
        guessingGame.reset();
      }

      function updateSizing() {
        const offset = (state.sizeBalance - 50) / 50;
        const pictureScale = 1 - (offset * .30);
        const textScale = 1 + (offset * .30);
        document.documentElement.style.setProperty("--picture-scale", pictureScale);
        document.documentElement.style.setProperty("--text-scale", textScale);
      }

      function render() {
        document.documentElement.classList.toggle("flash-board-mode",state.gameMode === "flashboard");
        if (state.gameMode !== "flashboard") {
          flashBoard.cleanup();
        }
        if (elements.schoolShortenButton) {
          elements.schoolShortenButton.setAttribute("aria-pressed", String(state.schoolShortened));
          elements.schoolShortenButton.textContent = state.schoolShortened
            ? "Restore “school” to office names"
            : "Remove “school” from office names";
        }
        closeGameMenu();
        updateSizing();
        settings.updatePreview();

        if (state.gameMode === "missing") {
          missingGame.render();
          return;
        }

        if (state.gameMode === "keyword") {
          keywordGame.render();
          return;
        }

        if (state.gameMode === "flashboard") {
          flashBoard.render();
          return;
        }

        if (state.gameMode === "guess") {
          guessingGame.render();
          return;
        }

        flashCards.render();
      }

      function showGridGameLayout() {
        document.documentElement.classList.remove("guess-focus");
        syncShapePracticeControls(null);
        elements.guessWordList.hidden = true;
        elements.shuffleButton.hidden = false;
        flashCards.stopAuto();
        elements.answerArea.hidden = true;
        elements.gameArea.hidden = false;
        elements.floatingTimer.hidden = true;
        elements.autoButton.hidden = true;
        elements.previousButton.hidden = true;
        elements.nextButton.hidden = false;
        elements.nextButton.classList.add("game-action");
      }

      function setGameMode(mode) {
        flashCards.stopAuto();
        closeGameMenu();

        if (mode === "flashcards") {
          returnToFlashcards();
          return;
        }

        if (mode === "guess") {
          guessingGame.open();
          return;
        }

        state.gameMode = mode;

        if (mode === "missing") {
          missingGame.start();
          return;
        }

        if (mode === "flashboard") {
          flashBoard.prepare();
        }

        if (mode === "keyword") {
          keywordGame.prepare();
        }

        render();
      }

      function returnToFlashcards() {
        flashCards.stopAuto();
        state.gameMode = "flashcards";
        resetGameState();
        render();
      }

      function shuffleAction() {
        flashCards.stopAuto();
        if (state.gameMode === "flashboard") {
          flashBoard.resetLayout();
          return;
        }

        if (state.gameMode === "missing") {
          missingGame.randomise();
          return;
        }

        if (state.gameMode === "keyword") {
          keywordGame.randomise();
          return;
        }

        if (state.gameMode === "guess") {
          guessingGame.random();
          return;
        }

        flashCards.shuffle();
      }

      function alignSideNavigation() {
        const rect = elements.flashcard.getBoundingClientRect();
        const top = Math.max(0, rect.top);
        const height = Math.max(80, Math.min(rect.height, window.innerHeight - top));

        [elements.previousButton, elements.nextButton].forEach((button) => {
          button.style.top = `${top}px`;
          button.style.height = `${height}px`;
        });
      }

      function closePanels() {
        settings.close();
        elements.guessSetup.hidden = true;
        elements.scrim.classList.remove("open");
        closeGameMenu();
      }

      function toggleGameMenu() {
        const willOpen = elements.gameMenu.hidden;
        if (willOpen) buildGameMenu();
        elements.gameMenu.hidden = !willOpen;
        elements.gameButton.setAttribute("aria-expanded", String(willOpen));
      }

      function closeGameMenu() {
        elements.gameMenu.hidden = true;
        elements.gameButton.setAttribute("aria-expanded", "false");
      }

      elements.menuButton.addEventListener("click", () => {
        if (state.gameMode !== "flashcards") {
          returnToFlashcards();
          return;
        }
        window.location.href = UNIT_CONFIG.menuFile;
      });

      elements.previousButton.addEventListener("click", () => {
        elements.keyboardHelp.classList.add("collapsed");
        if (state.gameMode === "flashcards" || state.gameMode === "guess") {
          flashCards.stopAuto();
          flashCards.previous();
        }
      });

      elements.nextButton.addEventListener("click", () => {
        elements.keyboardHelp.classList.add("collapsed");
        if (state.gameMode === "missing") missingGame.hideOneMore();
        else if (state.gameMode === "keyword") keywordGame.selectRandomKeyword();
        else if (state.gameMode === "guess") guessingGame.next();
        else if (state.gameMode === "flashcards") {
          flashCards.stopAuto();
          flashCards.next();
        }
      });

      elements.shuffleButton.addEventListener("click", shuffleAction);
      if (elements.phraseSwitchButton) {
        elements.phraseSwitchButton.addEventListener("click", togglePhraseSwitch);
      }
      elements.autoButton.addEventListener("click", flashCards.toggleAuto);
      elements.timerDownButton.addEventListener("click", () => flashCards.changeTimer(-1));
      elements.timerUpButton.addEventListener("click", () => flashCards.changeTimer(1));
      elements.gameButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleGameMenu();
      });

      elements.gameMenu.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button || !elements.gameMenu.contains(button)) return;

        if (button.dataset.game) {
          setGameMode(button.dataset.game);
          return;
        }

        if (button.dataset.extraGame) {
          openExtraGame(button.dataset.extraGame);
          return;
        }

        if (button.dataset.action === "offTopicGames") {
          closeGameMenu();
          window.open(ALTE_DATA.getExtraGamesPageUrl(), "_blank", "noopener,noreferrer");
        }
      });

      guessingGame.bind();

      elements.settingsButton.addEventListener("click", settings.open);

      elements.closeSettingsButton.addEventListener("click", closePanels);
      elements.scrim.addEventListener("click", closePanels);
      elements.keyboardHelp.addEventListener("click", () => {
        elements.keyboardHelp.classList.toggle("collapsed");
      });

      document.addEventListener("click", (event) => {
        if (!elements.gameMenu.contains(event.target) && event.target !== elements.gameButton) {
          closeGameMenu();
        }
      });

      settings.bind();

      document.addEventListener("keydown", (event) => {
        if (event.target?.closest?.("input, textarea, select, [contenteditable], #flashBoardTextDialog")) return;
        if (document.getElementById("flashBoardTextDialog")) return;
        if (event.key === "Escape") {
          elements.keyboardHelp.classList.add("collapsed");
          closePanels();
          return;
        }

        if (elements.settingsPanel.classList.contains("open") || !elements.guessSetup.hidden) return;

        if (state.gameMode === "guess") {
          if (event.key === "ArrowRight" || event.code === "Space" || event.key === "Enter") {
            event.preventDefault();
            guessingGame.next();
          } else if (event.key.toLowerCase() === "r") {
            guessingGame.random();
          }
          return;
        }

        if (state.gameMode === "missing") {
          if (event.key === "ArrowRight" || event.code === "Space" || event.key === "Enter") {
            event.preventDefault();
            missingGame.hideOneMore();
          } else if (event.key.toLowerCase() === "r") {
            shuffleAction();
          } else if (event.key.toLowerCase() === "g") {
            toggleGameMenu();
          }
          return;
        }

        if (state.gameMode === "keyword") {
          if (event.key === "ArrowRight" || event.code === "Space" || event.key === "Enter") {
            event.preventDefault();
            keywordGame.selectRandomKeyword();
          } else if (event.key.toLowerCase() === "r") {
            shuffleAction();
          } else if (event.key.toLowerCase() === "g") {
            toggleGameMenu();
          }
          return;
        }

        if (event.key === "ArrowRight" || event.code === "Space" || event.key === "Enter") {
          event.preventDefault();
          flashCards.stopAuto();
          flashCards.next();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          flashCards.stopAuto();
          flashCards.previous();
        } else if (event.key.toLowerCase() === "r") {
          shuffleAction();
        } else if (event.key.toLowerCase() === "a") {
          flashCards.toggleAuto();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          flashCards.changeTimer(1);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          flashCards.changeTimer(-1);
        } else if (event.key.toLowerCase() === "g") {
          toggleGameMenu();
        }
      });

      flashCards.bindLayout();

      initialisePage();
    })();
  