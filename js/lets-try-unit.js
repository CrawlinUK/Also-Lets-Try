
    (() => {
      "use strict";

      const UNIT_CONFIG = window.LETS_TRY_UNIT_CONFIG;
      if (!UNIT_CONFIG || !Array.isArray(UNIT_CONFIG.cards)) {
        throw new Error("Shared unit config was not loaded.");
      }

      const UNIT_CATEGORY_IDS = window.LETS_TRY_UNIT_CATEGORY_IDS
        || [...new Set(UNIT_CONFIG.cards.map((card) => card.category).filter(Boolean))];
      const PLACEHOLDER_IMAGE = "";
      const SHAPE_PRACTICE = UNIT_CONFIG.shapePractice || null;
      const SHAPE_NUMBER_WORDS = Object.freeze({
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five"
      });

      const appHost = document.getElementById("letsTryApp");
      if (!appHost) {
        throw new Error("Shared unit app host was not found.");
      }
      appHost.innerHTML = "<header class=\"site-header\">\n    <div class=\"site-header-inner\">\n      <button class=\"menu-button\" id=\"menuButton\" type=\"button\" aria-label=\"Return to unit menu\"></button>\n\n      <div class=\"site-title\">\n        <span class=\"unit-word\">Unit</span>\n        <span class=\"unit-number\" id=\"unitNumber\"></span>\n        <span class=\"unit-name\" id=\"unitName\"></span>\n      </div>\n\n      <div class=\"game-title\" id=\"gameTitle\" aria-live=\"polite\"></div>\n    </div>\n  </header>\n\n  <main class=\"app\" id=\"appScreen\">\n    <section class=\"flashcard\" id=\"flashcard\" aria-live=\"polite\">\n      <div class=\"flashcard-stage\">\n        <div class=\"answer-area\" id=\"answerArea\">\n          <div class=\"picture-frame\" id=\"pictureFrame\">\n            <div class=\"card-picture\" id=\"cardPicture\" role=\"img\"></div>\n          </div>\n          <div class=\"display-text\" id=\"displayText\"></div>\n        </div>\n\n        <div class=\"game-area\" id=\"gameArea\" hidden></div>\n      </div>\n\n      <button class=\"floating-auto\" id=\"autoButton\" type=\"button\"\n              aria-label=\"Start automatic flashcards\" title=\"Start automatic flashcards\"></button>\n    </section>\n\n    <button class=\"side-nav side-previous\" id=\"previousButton\" type=\"button\" aria-label=\"Previous card\"></button>\n    <button class=\"side-nav side-next\" id=\"nextButton\" type=\"button\" aria-label=\"Next card\"></button>\n    <aside class=\"missing-answer-hints\" id=\"missingAnswerHints\" aria-label=\"Teacher Missing Game answers\" hidden></aside>\n    <aside class=\"guess-word-list\" id=\"guessWordList\" aria-label=\"Guess game word list\" hidden></aside>\n\n    <nav class=\"control-bar\" aria-label=\"Flashcard controls\">\n      <div class=\"card-counter\">\n        <strong id=\"counter\">1 / 1</strong>\n        <span id=\"modeLabel\">Flashcard mode</span>\n      </div>\n\n      <button class=\"control shuffle\" id=\"shuffleButton\" type=\"button\">Shuffle</button>\n\n      <div class=\"game-menu-wrap\">\n        <button class=\"control quiet game-menu-button\" id=\"gameButton\" type=\"button\"\n                aria-haspopup=\"true\" aria-expanded=\"false\">Game</button>\n        <div class=\"game-menu\" id=\"gameMenu\" hidden></div>\n      </div>\n\n      <div class=\"floating-timer timer-control\" id=\"floatingTimer\" aria-label=\"Automatic timer\">\n        <button id=\"timerDownButton\" type=\"button\" aria-label=\"Decrease timer\">−</button>\n        <span class=\"timer-value\" id=\"timerValue\">3 sec</span>\n        <button id=\"timerUpButton\" type=\"button\" aria-label=\"Increase timer\">+</button>\n      </div>\n\n      <button class=\"control quiet settings-icon-button\" id=\"settingsButton\" type=\"button\" aria-label=\"Settings\">Settings</button>\n    </nav>\n\n    <div class=\"keyboard-help collapsed\" id=\"keyboardHelp\">\n      <div class=\"keyboard-help-text\">\n        ← / → = previous / next<br>\n        Space / Enter = next<br>\n        A = start / stop auto<br>\n        R = shuffle<br>\n        G = games<br>\n        ↑ / ↓ = timer up / down<br>\n        Esc = close menus / help\n      </div>\n      <div class=\"keyboard-help-icon\">!</div>\n    </div>\n  </main>\n\n  <div class=\"image-diagnostic-toolbar\" id=\"imageDiagnosticToolbar\" hidden>\n    <strong class=\"image-diagnostic-card-label\" id=\"imageDiagnosticCardLabel\">Image diagnosis</strong>\n    <label class=\"image-diagnostic-zoom-control\">\n      <span>Zoom</span>\n      <input id=\"imageDiagnosticZoomRange\" type=\"range\" min=\"25\" max=\"400\" value=\"100\" step=\"1\" aria-label=\"Diagnostic image zoom\">\n      <span class=\"image-diagnostic-number-wrap\">\n        <input id=\"imageDiagnosticZoomNumber\" type=\"number\" min=\"25\" max=\"400\" value=\"100\" step=\"0.1\" inputmode=\"decimal\" aria-label=\"Diagnostic image zoom percent\">\n        <span>%</span>\n      </span>\n    </label>\n  </div>\n\n  <div class=\"scrim\" id=\"scrim\"></div>\n\n  <div class=\"guess-setup\" id=\"guessSetup\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"guessSetupTitle\" hidden>\n    <div class=\"guess-setup-card\">\n      <button class=\"guess-setup-close\" id=\"guessSetupClose\" type=\"button\" aria-label=\"Close Guess setup\">×</button>\n      <h2 id=\"guessSetupTitle\">Guess</h2>\n      <section class=\"guess-category-section\" id=\"guessCategorySection\">\n        <p>Please choose a category</p>\n        <div class=\"guess-category-options\" id=\"guessCategoryOptions\"></div>\n      </section>\n      <section class=\"guess-mode-section\">\n        <p>Choose a screen mode</p>\n        <div class=\"guess-mode-options\">\n          <button type=\"button\" data-guess-mode=\"showWord\">Show Word</button>\n          <button type=\"button\" data-guess-mode=\"hideWord\">Hide Word<small>All words will be listed on the left.</small></button>\n        </div>\n      </section>\n    </div>\n  </div>\n\n  <aside class=\"settings-panel\" id=\"settingsPanel\" aria-label=\"Settings\">\n    <div class=\"settings-heading\">\n      <h2>Settings</h2>\n      <button class=\"close-button\" id=\"closeSettingsButton\" type=\"button\" aria-label=\"Close settings\">×</button>\n    </div>\n\n    <section class=\"setting-section display-mode-section\">\n      <h3>Display mode</h3>\n      <div class=\"segmented display-mode-options\">\n        <label>\n          <input type=\"radio\" name=\"displayMode\" value=\"pictureText\" checked>\n          <span id=\"pictureTextLabel\">Picture + text</span>\n        </label>\n        <label>\n          <input type=\"radio\" name=\"displayMode\" value=\"picture\">\n          <span id=\"pictureOnlyLabel\">Picture only</span>\n        </label>\n        <label class=\"picture-sentence-option\" id=\"pictureSentenceOption\">\n          <input type=\"radio\" name=\"displayMode\" value=\"pictureSentence\">\n          <span id=\"pictureSentenceLabel\">Picture + sentence</span>\n        </label>\n        <label>\n          <input type=\"radio\" name=\"displayMode\" value=\"text\">\n          <span id=\"textOnlyLabel\">Text only</span>\n        </label>\n      </div>\n    </section>\n\n    <div class=\"settings-preview\" id=\"settingsPreview\" aria-label=\"Display preview\">\n      <div class=\"settings-preview-picture\" id=\"settingsPreviewPicture\" role=\"img\"></div>\n      <div class=\"settings-preview-text\" id=\"settingsPreviewText\"></div>\n    </div>\n\n    <section class=\"setting-section selection-section\">\n      <div class=\"setting-actions setting-actions-top\">\n        <button id=\"selectAllButton\" type=\"button\">Select all</button>\n        <button id=\"resetButton\" type=\"button\">Reset</button>\n      </div>\n      <p class=\"message\" id=\"message\"></p>\n      <div class=\"category-word-groups\" id=\"cardOptionGrid\"></div>\n    </section>\n\n    <section class=\"setting-section secondary-setting-section\">\n      <h3>Image / text size</h3>\n      <div class=\"balance-labels\" aria-hidden=\"true\">\n        <span id=\"balancePictureLabel\">Image</span>\n        <span id=\"balanceTextLabel\">Text</span>\n      </div>\n      <div class=\"balance-slider\">\n        <span>◀</span>\n        <input id=\"sizeBalanceRange\" type=\"range\" min=\"0\" max=\"100\" value=\"50\" step=\"5\"\n               aria-label=\"Image and text size balance\">\n        <span>▶</span>\n      </div>\n    </section>\n\n    <section class=\"setting-section secondary-setting-section\">\n      <h3>Missing Game teacher hint answer size</h3>\n      <div class=\"missing-answer-size-row\">\n        <input id=\"missingAnswerSizeRange\" type=\"range\" min=\"8\" max=\"24\" value=\"10\" step=\"1\"\n               aria-label=\"Missing Game teacher hint answer size\">\n        <output class=\"missing-answer-size-value\" id=\"missingAnswerSizeValue\" for=\"missingAnswerSizeRange\">10 px</output>\n      </div>\n    </section>\n\n    <section class=\"setting-section secondary-setting-section image-diagnostic-setting\">\n      <h3>Image diagnosis</h3>\n      <div class=\"image-diagnostic-actions\">\n        <button id=\"imageDiagnosticToggle\" type=\"button\" aria-pressed=\"false\">Image diagnosis</button>\n        <button id=\"imageDiagnosticExport\" type=\"button\">Export changes</button>\n      </div>\n      <p class=\"image-diagnostic-note\">Temporary development tool — this diagnostic tool will be removed on release/completion.</p>\n    </section>\n  </aside>";

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
      const cardsById = new Map(UNIT_CONFIG.cards.map((card) => [card.id, card]));
      const CATEGORY_IDS = Object.fromEntries(
        UNIT_CATEGORY_IDS.map((categoryId) => [
          categoryId,
          UNIT_CONFIG.cards
            .filter((card) => card.category === categoryId)
            .map((card) => card.id)
        ])
      );

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
        imageDiagnosticToggle: $("imageDiagnosticToggle"),
        imageDiagnosticExport: $("imageDiagnosticExport"),
        imageDiagnosticToolbar: $("imageDiagnosticToolbar"),
        imageDiagnosticCardLabel: $("imageDiagnosticCardLabel"),
        imageDiagnosticZoomRange: $("imageDiagnosticZoomRange"),
        imageDiagnosticZoomNumber: $("imageDiagnosticZoomNumber"),
        pictureSentenceOption: $("pictureSentenceOption"),
        pictureSentenceLabel: $("pictureSentenceLabel"),
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

      const TEACHER_PREFERENCES_KEY = "alsoLetsTry.teacherPreferences.v1";
      const IMAGE_DIAGNOSIS_STORAGE_KEY = "alsoLetsTry.imageDiagnosis.v1";
      const IMAGE_DIAGNOSIS_MIN_ZOOM = 25;
      const IMAGE_DIAGNOSIS_MAX_ZOOM = 400;
      const imageDiagnosticAspectRatios = new Map();

      function clampNumber(value, minimum, maximum, fallback) {
        const number = Number(value);
        return Number.isFinite(number)
          ? Math.max(minimum, Math.min(maximum, number))
          : fallback;
      }

      function readTeacherPreferences() {
        const defaults = {
          sizeBalance: 50,
          missingAnswerSize: 10
        };

        try {
          const stored = JSON.parse(window.localStorage.getItem(TEACHER_PREFERENCES_KEY) || "{}");
          return {
            sizeBalance: clampNumber(stored.sizeBalance, 0, 100, defaults.sizeBalance),
            missingAnswerSize: clampNumber(stored.missingAnswerSize, 8, 24, defaults.missingAnswerSize)
          };
        } catch {
          return defaults;
        }
      }

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


      function readImageDiagnosisAdjustments() {
        try {
          const value = JSON.parse(window.localStorage.getItem(IMAGE_DIAGNOSIS_STORAGE_KEY) || "{}");
          return value && typeof value === "object" && !Array.isArray(value) ? value : {};
        } catch {
          return {};
        }
      }

      function saveImageDiagnosisAdjustments() {
        try {
          window.localStorage.setItem(
            IMAGE_DIAGNOSIS_STORAGE_KEY,
            JSON.stringify(state.imageDiagnosticAdjustments)
          );
        } catch {
          // Keep diagnosis working for this page if storage is unavailable.
        }
      }

      function cleanDiagnosticSource(value) {
        if (!value) return "";
        try {
          const url = new URL(value, location.href);
          url.searchParams.delete("v");
          return url.origin === location.origin
            ? url.pathname.replace(/^\//, "")
            : url.href;
        } catch {
          return String(value);
        }
      }

      function diagnosticKey(card) {
        if (!card) return "";
        return `${UNIT_CONFIG.bookId || "lt1"}:${UNIT_CONFIG.unitNumber}:${card.id}`;
      }

      function isDiagnosticImageCard(card) {
        const visual = card && card.visual;
        return Boolean(
          visual
          && visual.src
          && visual.type !== "text"
          && visual.type !== "number-svg"
          && visual.type !== "shape-svg"
        );
      }

      function roundDiagnostic(value, digits = 3) {
        const factor = 10 ** digits;
        return Math.round(Number(value || 0) * factor) / factor;
      }

      function diagnosticAdjustment(card, create = false) {
        if (!isDiagnosticImageCard(card)) return null;
        const key = diagnosticKey(card);
        let adjustment = state.imageDiagnosticAdjustments[key];

        if (!adjustment && create) {
          const visual = card.visual || {};
          adjustment = {
            bookId: UNIT_CONFIG.bookId || "lt1",
            unitNumber: String(UNIT_CONFIG.unitNumber),
            cardId: card.id,
            category: card.category || "",
            word: card.word || "",
            source: cleanDiagnosticSource(visual.src),
            baseSize: visual.size || "contain",
            basePosition: visual.position || "center",
            zoomPercent: 100,
            offsetXPercent: 0,
            offsetYPercent: 0
          };
          state.imageDiagnosticAdjustments[key] = adjustment;
        }
        return adjustment || null;
      }

      function diagnosticHasChange(adjustment) {
        return Boolean(
          adjustment
          && (
            Math.abs(Number(adjustment.zoomPercent || 100) - 100) > 0.0001
            || Math.abs(Number(adjustment.offsetXPercent || 0)) > 0.0001
            || Math.abs(Number(adjustment.offsetYPercent || 0)) > 0.0001
          )
        );
      }

      function normalisePositionToken(value, axis) {
        const token = String(value || "").trim().toLowerCase();
        if (/^-?\d+(?:\.\d+)?%$/.test(token)) return token;
        if (axis === "x") {
          if (token === "left") return "0%";
          if (token === "right") return "100%";
        } else {
          if (token === "top") return "0%";
          if (token === "bottom") return "100%";
        }
        return "50%";
      }

      function diagnosticPositionPair(value) {
        const parts = String(value || "center").trim().split(/\s+/).filter(Boolean);
        if (parts.length <= 1) {
          const only = parts[0] || "center";
          if (only === "top" || only === "bottom") {
            return ["50%", normalisePositionToken(only, "y")];
          }
          return [normalisePositionToken(only, "x"), "50%"];
        }
        return [
          normalisePositionToken(parts[0], "x"),
          normalisePositionToken(parts[1], "y")
        ];
      }

      function ensureDiagnosticAspectRatio(card) {
        if (!card || !card.visual || !card.visual.src) return;
        const source = card.visual.src;
        if (imageDiagnosticAspectRatios.has(source)) return;

        const image = new Image();
        image.onload = () => {
          if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            imageDiagnosticAspectRatios.set(source, image.naturalWidth / image.naturalHeight);
            if (state.imageDiagnosticEnabled) {
              document.querySelectorAll('[data-diagnostic-image="true"]').forEach((node) => {
                const nodeCard = cardsById.get(node.dataset.diagnosticCardId);
                if (nodeCard && nodeCard.visual && nodeCard.visual.src === source) {
                  applyImageDiagnosticAdjustment(node, nodeCard);
                }
              });
            }
          }
        };
        image.src = source;
      }

      function diagnosticBackgroundSize(card, element, adjustment) {
        const visual = card.visual || {};
        const baseSize = String(visual.size || "contain").trim();
        const zoom = clampNumber(
          adjustment ? adjustment.zoomPercent : 100,
          IMAGE_DIAGNOSIS_MIN_ZOOM,
          IMAGE_DIAGNOSIS_MAX_ZOOM,
          100
        );
        const factor = zoom / 100;

        const pairMatch = baseSize.match(/^(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/);
        if (pairMatch) {
          return `${roundDiagnostic(Number(pairMatch[1]) * factor)}% ${roundDiagnostic(Number(pairMatch[2]) * factor)}%`;
        }

        const singleMatch = baseSize.match(/^(-?\d+(?:\.\d+)?)%$/);
        if (singleMatch) {
          return `${roundDiagnostic(Number(singleMatch[1]) * factor)}% auto`;
        }

        if (zoom === 100) return baseSize;

        ensureDiagnosticAspectRatio(card);
        const imageRatio = imageDiagnosticAspectRatios.get(visual.src);
        const rect = element.getBoundingClientRect();
        const boxRatio = rect.width > 0 && rect.height > 0 ? rect.width / rect.height : 1;

        if (imageRatio && imageRatio < boxRatio) {
          return `auto ${roundDiagnostic(zoom)}%`;
        }
        return `${roundDiagnostic(zoom)}% auto`;
      }

      function diagnosticBackgroundPosition(card, adjustment) {
        const visual = card.visual || {};
        const [baseX, baseY] = diagnosticPositionPair(visual.position || "center");
        const offsetX = roundDiagnostic(adjustment ? adjustment.offsetXPercent : 0);
        const offsetY = roundDiagnostic(adjustment ? adjustment.offsetYPercent : 0);
        return `calc(${baseX} + ${offsetX}%) calc(${baseY} + ${offsetY}%)`;
      }

      function applyImageDiagnosticAdjustment(element, card) {
        if (!element || !isDiagnosticImageCard(card)) return;
        const visual = card.visual || {};
        element.style.backgroundSize = visual.size || "contain";
        element.style.backgroundPosition = visual.position || "center";

        if (!state.imageDiagnosticEnabled) return;
        const adjustment = diagnosticAdjustment(card, false);
        if (!adjustment) return;

        element.style.backgroundSize = diagnosticBackgroundSize(card, element, adjustment);
        element.style.backgroundPosition = diagnosticBackgroundPosition(card, adjustment);
      }

      function diagnosticVisibleCard() {
        const nodes = [...document.querySelectorAll('[data-diagnostic-image="true"]')]
          .filter((node) => !node.hidden && node.getClientRects().length);

        let node = nodes.find(
          (candidate) => candidate.dataset.diagnosticKey === state.imageDiagnosticActiveKey
        );
        if (!node) node = nodes[0] || null;
        if (!node) return null;

        const card = cardsById.get(node.dataset.diagnosticCardId) || null;
        if (card) state.imageDiagnosticActiveKey = diagnosticKey(card);
        return card;
      }

      function syncImageDiagnosticToolbar() {
        const toolbar = elements.imageDiagnosticToolbar;
        if (!toolbar) return;

        const settingsOpen = elements.settingsPanel.classList.contains("open");
        if (!state.imageDiagnosticEnabled || settingsOpen) {
          toolbar.hidden = true;
          return;
        }

        const card = diagnosticVisibleCard();
        if (!card) {
          toolbar.hidden = true;
          return;
        }

        const adjustment = diagnosticAdjustment(card, false);
        const zoom = adjustment ? adjustment.zoomPercent : 100;
        elements.imageDiagnosticCardLabel.textContent =
          `${card.word || card.id} · drag image to position`;
        elements.imageDiagnosticZoomRange.value = String(zoom);
        elements.imageDiagnosticZoomNumber.value = String(roundDiagnostic(zoom, 1));
        toolbar.hidden = false;
      }

      function syncImageDiagnosticExportButton() {
        if (!elements.imageDiagnosticExport) return;
        const changed = Object.values(state.imageDiagnosticAdjustments).some(diagnosticHasChange);
        elements.imageDiagnosticExport.disabled = !changed;
      }

      function updateActiveDiagnosticZoom(rawValue) {
        const card = diagnosticVisibleCard();
        if (!card) return;

        const zoom = clampNumber(
          rawValue,
          IMAGE_DIAGNOSIS_MIN_ZOOM,
          IMAGE_DIAGNOSIS_MAX_ZOOM,
          100
        );
        const adjustment = diagnosticAdjustment(card, true);
        adjustment.zoomPercent = roundDiagnostic(zoom, 1);

        if (!diagnosticHasChange(adjustment)) {
          delete state.imageDiagnosticAdjustments[diagnosticKey(card)];
        }

        saveImageDiagnosisAdjustments();
        document.querySelectorAll('[data-diagnostic-image="true"]').forEach((node) => {
          if (node.dataset.diagnosticCardId === card.id) {
            applyImageDiagnosticAdjustment(node, card);
          }
        });
        syncImageDiagnosticToolbar();
        syncImageDiagnosticExportButton();
      }

      function imageDiagnosisExportText() {
        const changes = Object.values(state.imageDiagnosticAdjustments)
          .filter(diagnosticHasChange)
          .sort((a, b) =>
            String(a.bookId).localeCompare(String(b.bookId))
            || String(a.unitNumber).localeCompare(String(b.unitNumber), undefined, { numeric: true })
            || String(a.cardId).localeCompare(String(b.cardId))
          )
          .map((entry) => ({
            bookId: entry.bookId,
            unitNumber: entry.unitNumber,
            cardId: entry.cardId,
            category: entry.category,
            word: entry.word,
            source: entry.source,
            baseSize: entry.baseSize,
            basePosition: entry.basePosition,
            zoomPercent: roundDiagnostic(entry.zoomPercent, 1),
            offsetXPercent: roundDiagnostic(entry.offsetXPercent),
            offsetYPercent: roundDiagnostic(entry.offsetYPercent)
          }));

        return [
          "Also Let’s Try — Image Diagnosis Export",
          "Temporary development data. The diagnostic UI is intended to be removed on release/completion.",
          `Generated: ${new Date().toISOString()}`,
          "",
          JSON.stringify({ version: 1, changes }, null, 2),
          ""
        ].join("\n");
      }

      function exportImageDiagnosis() {
        const text = imageDiagnosisExportText();
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        const stamp = new Date().toISOString().slice(0, 10);
        anchor.href = url;
        anchor.download = `also-lets-try-image-diagnosis-${stamp}.txt`;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      const teacherPreferences = readTeacherPreferences();

      const state = {
        selectedIds: new Set(initialIds),
        deck: [],
        position: 0,
        displayMode: UNIT_CONFIG.defaultDisplayMode || "pictureText",
        letterColourMode: UNIT_CONFIG.defaultLetterColourMode || "plain",
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
        keywordOrder: [],
        keywordSelectedIds: new Set(),
        guessCategoryId: null,
        guessMode: "showWord",
        guessDeck: [],
        guessPosition: 0,
        guessRevealed: false,
        imageDiagnosticEnabled: false,
        imageDiagnosticAdjustments: readImageDiagnosisAdjustments(),
        imageDiagnosticActiveKey: null,
        imageDiagnosticDrag: null
      };

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
        const colourCategory = LETS_TRY_DATA.getCategory(colourCategoryId);
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

      function selectedCards() {
        return UNIT_CONFIG.cards.filter((card) => state.selectedIds.has(card.id));
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
          ["guess", "Guess"]
        ].forEach(([id, label]) => {
          if (builtInGameEnabled(id)) {
            fragment.append(makeGameMenuButton(label, { game: id }));
          }
        });

        const relevantExtras = LETS_TRY_DATA.getExtraGamesForCategories(activeCategoryIds());
        relevantExtras.forEach((game) => {
          const button = makeGameMenuButton(game.name, { extraGame: game.id });
          button.classList.add("extra-game-button");
          fragment.append(button);
        });

        if (LETS_TRY_DATA.getAllExtraGames().length) {
          const offTopicButton = makeGameMenuButton("Off topic games", { action: "offTopicGames" });
          offTopicButton.classList.add("off-topic-games-button");
          fragment.append(offTopicButton);
        }

        fragment.append(makeGameMenuButton("Back to flashcards", { game: "flashcards" }));
        elements.gameMenu.replaceChildren(fragment);
      }

      function openExtraGame(gameId) {
        const game = LETS_TRY_DATA.getExtraGame(gameId);
        if (!game) return;
        closeGameMenu();
        window.open(game.url, "_blank", "noopener,noreferrer");
      }

      function initialisePage() {
        document.documentElement.classList.add("shared-unit-template");
        document.documentElement.dataset.book = UNIT_CONFIG.bookId || "lt1";
        document.documentElement.dataset.unit = String(UNIT_CONFIG.unitNumber);
        document.title = UNIT_CONFIG.browserTitle;
        document.documentElement.style.setProperty("--unit-colour", UNIT_CONFIG.unitColour);
        document.documentElement.style.setProperty("--unit-number-colour", UNIT_CONFIG.unitNumberColour);
        document.documentElement.style.setProperty("--picture-ratio", UNIT_CONFIG.pictureAspectRatio);

        elements.unitNumber.textContent = UNIT_CONFIG.unitNumber;
        elements.unitName.textContent = UNIT_CONFIG.unitTitle;
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

        const pictureTextLabel = $("pictureTextLabel");
        const pictureOnlyLabel = $("pictureOnlyLabel");
        const textOnlyLabel = $("textOnlyLabel");
        if (pictureTextLabel && displayLabels.pictureText) pictureTextLabel.textContent = displayLabels.pictureText;
        if (pictureOnlyLabel && displayLabels.picture) pictureOnlyLabel.textContent = displayLabels.picture;
        if (textOnlyLabel && displayLabels.text) textOnlyLabel.textContent = displayLabels.text;

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
        syncImageDiagnosticExportButton();

        buildGameMenu();
        buildCardOptions();
        rebuildDeck();
      }

      const NUMBER_DIGIT_BOUNDS = Object.freeze({
        "0": { x: 263.321, width: 273.358 },
        "1": { x: 286.000, width: 168.000 },
        "2": { x: 265.882, width: 263.514 },
        "3": { x: 266.000, width: 273.500 },
        "4": { x: 230.395, width: 294.209 },
        "5": { x: 247.428, width: 281.645 },
        "6": { x: 257.406, width: 276.694 },
        "7": { x: 271.000, width: 258.000 },
        "8": { x: 265.598, width: 248.805 },
        "9": { x: 257.406, width: 276.694 }
      });
      const NUMBER_DIGIT_GAP = 50;
      const NUMBER_SOURCE_Y = 150;
      const NUMBER_SOURCE_HEIGHT = 500;
      const NUMBER_MULTI_SLOT_WIDTH = 380 / 1.16;

      function numberUseHref(digit, visual) {
        const localId = `number-digit-${digit}`;
        if (document.getElementById(localId)) return `#${localId}`;

        const digitUrl = new URL(`${digit}.svg`, visual.digitBase);
        if (visual.digitVersion) digitUrl.searchParams.set("v", visual.digitVersion);
        digitUrl.hash = "artwork";
        return digitUrl.href;
      }

      function applyVisual(element, card) {
        const visual = card && card.visual ? card.visual : {};
        const textVisual = visual.type === "text";
        const numberVisual = visual.type === "number-svg";
        const shapeVisual = visual.type === "shape-svg";
        const aspectRatio = visual.aspectRatio || UNIT_CONFIG.pictureAspectRatio || "1 / 1";
        const ratioParts = String(aspectRatio).split("/").map((part) => Number(part.trim()));
        const ratioValue = ratioParts.length === 2 && ratioParts[0] > 0 && ratioParts[1] > 0
          ? ratioParts[0] / ratioParts[1]
          : Number(aspectRatio) || 1;

        element.replaceChildren();
        element.style.aspectRatio = aspectRatio;
        element.style.setProperty("--visual-ratio", String(ratioValue));
        element.classList.toggle("text-visual", textVisual);
        element.classList.toggle("number-svg-visual", numberVisual);
        element.classList.toggle("shape-practice-visual", shapeVisual);
        element.dataset.diagnosticCardId = card && card.id ? card.id : "";
        element.dataset.diagnosticKey = card ? diagnosticKey(card) : "";
        element.dataset.diagnosticImage = isDiagnosticImageCard(card) ? "true" : "false";

        if (shapeVisual) {
          const isShapeCard = isShapePracticeCard(card);
          const usePracticeModifiers = state.gameMode === "flashcards" && isShapeCard;
          const count = usePracticeModifiers && state.shapeNumberEnabled ? state.shapeCount : 1;
          const defaultColourName =
            (visual.defaultColourName
              || (SHAPE_PRACTICE && SHAPE_PRACTICE.defaultColours && SHAPE_PRACTICE.defaultColours[card.id])
              || "");
          const colourName = isShapeCard ? shapeColourName(card) : defaultColourName;
          const useDefaultArtwork = colourName === defaultColourName;
          const colourValue = colourName && typeof LETS_TRY_DATA.getColourValue === "function"
            ? LETS_TRY_DATA.getColourValue(colourName)
            : null;

          element.style.backgroundImage = "none";
          element.style.backgroundSize = "";
          element.style.backgroundPosition = "";
          element.style.transform = "none";
          element.style.clipPath = "none";
          element.style.color = "";
          element.dataset.shapeCount = String(count);

          const copies = [];
          for (let index = 0; index < count; index += 1) {
            const copy = document.createElement("div");
            copy.className = "shape-practice-copy";

            if (useDefaultArtwork) {
              copy.classList.add("default-artwork");
              copy.style.backgroundImage = `url("${visual.src || PLACEHOLDER_IMAGE}")`;
            } else {
              copy.classList.add("recoloured-artwork");
              const maskUrl = `url("${visual.src || PLACEHOLDER_IMAGE}")`;

              function makeMaskLayer(className, backgroundColour) {
                const layer = document.createElement("span");
                layer.className = `shape-practice-mask-layer ${className}`;
                layer.style.backgroundColor = backgroundColour;
                layer.style.maskImage = maskUrl;
                layer.style.webkitMaskImage = maskUrl;
                return layer;
              }

              if (colourName === "white") {
                copy.classList.add("white-artwork");
                copy.append(
                  makeMaskLayer("shape-practice-white-outline", "#7f8a90"),
                  makeMaskLayer("shape-practice-fill-layer", colourValue || "#F8F8F4")
                );
              } else {
                copy.append(
                  makeMaskLayer("shape-practice-fill-layer", colourValue || "#999999")
                );
              }
            }

            copies.push(copy);
          }
          element.replaceChildren(...copies);
          return;
        }

        if (numberVisual) {
          const digits = Array.from(String(visual.text || card?.id || ""));
          element.classList.toggle("number-multi-digit", digits.length === 2);
          element.classList.toggle("number-triple-digit", digits.length >= 3);
          element.style.setProperty("--number-digit-count", String(Math.max(1, digits.length)));
          element.style.backgroundImage = "none";
          element.style.backgroundSize = "";
          element.style.backgroundPosition = "";
          element.style.transform = "none";
          element.style.clipPath = "none";

          const validDigits = digits.filter((digit) => /\d/.test(digit));

          if (validDigits.length > 1) {
            const glyphs = validDigits.map((digit) => ({
              digit,
              bounds: NUMBER_DIGIT_BOUNDS[digit] || { x: 210, width: 380 }
            }));
            const contentWidth = glyphs.reduce((sum, glyph) => sum + glyph.bounds.width, 0)
              + NUMBER_DIGIT_GAP * Math.max(0, glyphs.length - 1);
            const canvasWidth = Math.max(NUMBER_MULTI_SLOT_WIDTH * glyphs.length, contentWidth);
            const anchorWidth = glyphs.length === 2
              ? glyphs[0].bounds.width + NUMBER_DIGIT_GAP + NUMBER_DIGIT_BOUNDS["0"].width
              : contentWidth;
            let cursor = (canvasWidth - anchorWidth) / 2;

            const run = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            run.classList.add("number-svg-run");
            run.setAttribute("viewBox", `0 0 ${canvasWidth} ${NUMBER_SOURCE_HEIGHT}`);
            run.setAttribute("preserveAspectRatio", "xMidYMid meet");
            run.setAttribute("aria-hidden", "true");

            glyphs.forEach(({ digit, bounds }) => {
              const glyph = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              glyph.classList.add("number-svg-glyph");
              glyph.setAttribute("x", String(cursor));
              glyph.setAttribute("y", "0");
              glyph.setAttribute("width", String(bounds.width));
              glyph.setAttribute("height", String(NUMBER_SOURCE_HEIGHT));
              glyph.setAttribute(
                "viewBox",
                `${bounds.x} ${NUMBER_SOURCE_Y} ${bounds.width} ${NUMBER_SOURCE_HEIGHT}`
              );
              glyph.setAttribute("preserveAspectRatio", "xMidYMid meet");
              glyph.style.color = visual.colour || "#FFDE23";

              const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
              use.setAttribute("href", numberUseHref(digit, visual));
              glyph.append(use);
              run.append(glyph);

              cursor += bounds.width + NUMBER_DIGIT_GAP;
            });

            element.append(run);
            return;
          }

          validDigits.forEach((digit) => {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.classList.add("number-svg-digit");
            svg.setAttribute("viewBox", "210 150 380 500");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svg.setAttribute("aria-hidden", "true");
            svg.style.color = visual.colour || "#FFDE23";

            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute("href", numberUseHref(digit, visual));
            svg.append(use);
            element.append(svg);
          });
          return;
        }

        element.classList.remove("number-multi-digit", "number-triple-digit");
        element.textContent = textVisual ? String(visual.text ?? card?.alternate ?? card?.word ?? "") : "";

        if (textVisual) {
          element.style.color = "";
          if (
            state.letterColourMode === "colour"
            && visual.alphabetLetter
            && typeof LETS_TRY_DATA.getAlphabetColour === "function"
          ) {
            element.style.color = LETS_TRY_DATA.getAlphabetColour(visual.alphabetLetter) || "";
          }
          element.style.backgroundImage = "none";
          element.style.backgroundSize = "";
          element.style.backgroundPosition = "";
          element.style.transform = "none";
          element.style.clipPath = "none";
          return;
        }

        element.style.backgroundImage = `url("${visual.src || PLACEHOLDER_IMAGE}")`;
        element.style.backgroundSize = visual.size || "contain";
        element.style.backgroundPosition = visual.position || "center";
        element.style.transform = visual.flip ? "scaleX(-1)" : "scaleX(1)";
        element.style.clipPath = visual.cropTop
          ? `inset(${Number(visual.cropTop)}% 0 0 0)`
          : "none";
        applyImageDiagnosticAdjustment(element, card);
      }

      function cardText(card) {
        if (!card) return "SELECT A CARD";
        if (isShapePracticeCard(card)) return shapePracticeText(card);
        if (state.displayMode === "pictureSentence") return card.sentence || card.word;
        return card.word;
      }

      function renderCardText(element, card) {
        const text = cardText(card);
        element.replaceChildren();

        if (
          card
          && state.displayMode === "pictureSentence"
          && card.underlineToken
        ) {
          const token = String(card.underlineToken);
          const needle = ` ${token} `;
          const index = text.indexOf(needle);

          if (index >= 0) {
            element.append(document.createTextNode(text.slice(0, index + 1)));
            const underline = document.createElement("u");
            underline.className = "phrase-emphasis";
            underline.textContent = token;
            element.append(underline);
            element.append(document.createTextNode(text.slice(index + needle.length - 1)));
            return;
          }
        }

        element.textContent = text;
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
          const category = LETS_TRY_DATA.getCategory(categoryId);
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

      function rebuildDeck() {
        stopAuto();
        state.deck = selectedCards();
        state.position = 0;
        resetGameState();
        render();
      }

      function resetGameState() {
        state.missingOrder = [];
        state.hiddenMissingIds.clear();
        state.keywordOrder = [];
        state.keywordSelectedIds.clear();
        state.guessCategoryId = null;
        state.guessDeck = [];
        state.guessPosition = 0;
        state.guessRevealed = false;
      }

      function updateSizing() {
        const offset = (state.sizeBalance - 50) / 50;
        const pictureScale = 1 - (offset * .30);
        const textScale = 1 + (offset * .30);
        document.documentElement.style.setProperty("--picture-scale", pictureScale);
        document.documentElement.style.setProperty("--text-scale", textScale);
      }

      function render() {
        closeGameMenu();
        updateSizing();
        updateSettingsPreview();

        if (state.gameMode === "missing") {
          renderMissing();
          syncImageDiagnosticToolbar();
          return;
        }

        if (state.gameMode === "keyword") {
          renderKeyword();
          syncImageDiagnosticToolbar();
          return;
        }

        if (state.gameMode === "guess") {
          renderGuess();
          syncImageDiagnosticToolbar();
          return;
        }

        renderFlashcards();
        syncImageDiagnosticToolbar();
      }

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

      function showGridGameLayout() {
        document.documentElement.classList.remove("guess-focus");
        syncShapePracticeControls(null);
        elements.guessWordList.hidden = true;
        elements.shuffleButton.hidden = false;
        stopAuto();
        elements.answerArea.hidden = true;
        elements.gameArea.hidden = false;
        elements.floatingTimer.hidden = true;
        elements.autoButton.hidden = true;
        elements.previousButton.hidden = true;
        elements.nextButton.hidden = false;
        elements.nextButton.classList.add("game-action");
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
        elements.counter.textContent = `${state.position + 1} / ${state.deck.length}`;
        elements.modeLabel.textContent = "Flashcard mode";
        elements.shuffleButton.textContent = "Shuffle";
        updateTimerDisplay();
        requestAnimationFrame(alignSideNavigation);
      }

      function gridShape(count) {
        let columns;
        if (count <= 1) columns = 1;
        else if (count <= 4) columns = 2;
        else if (count <= 6) columns = 3;
        else if (count <= 8) columns = 4;
        else if (count === 9) columns = 3;
        else if (count <= 20) columns = 5;
        else if (count === 21) columns = 7;
        else if (count <= 32) columns = 8;
        else columns = 9;

        return {
          columns,
          rows: Math.max(1, Math.ceil(count / columns))
        };
      }

      function setGridShape(grid, count) {
        const shape = gridShape(count);
        grid.style.setProperty("--grid-cols", shape.columns);
        grid.style.setProperty("--grid-rows", shape.rows);
      }


      function reverseText(value) {
        return Array.from(String(value)).reverse().join("");
      }

      function updateMissingAnswerHints() {
        const cardMap = new Map(selectedCards().map((card) => [card.id, card]));
        const lines = state.missingOrder
          .map((id, index) => ({ card: cardMap.get(id), position: index + 1 }))
          .filter((item) => item.card && state.hiddenMissingIds.has(item.card.id))
          .map((item) => `${reverseText(item.card.teacherAnswer || item.card.word)}${item.position}`);
        elements.missingAnswerHints.replaceChildren(...lines.map((line) => {
          const row = document.createElement("div");
          row.textContent = line;
          return row;
        }));
        elements.missingAnswerHints.hidden = state.gameMode !== "missing" || lines.length === 0;
      }

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
          const category = LETS_TRY_DATA.getCategory(categoryId);
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

      function renderMissing() {
        showGridGameLayout();
        elements.gameTitle.textContent = "What’s missing?";
        elements.nextButton.dataset.gameAction = "hide";
        elements.nextButton.textContent = "HIDE +";
        elements.nextButton.setAttribute("aria-label", "Hide one more card");

        const cards = selectedCards();
        const cardMap = new Map(cards.map((card) => [card.id, card]));

        if (!state.missingOrder.length || state.missingOrder.length !== cards.length) {
          state.missingOrder = cards.map((card) => card.id);
        }

        const grid = document.createElement("div");
        grid.className = "game-grid";
        setGridShape(grid, cards.length);

        state.missingOrder.forEach((id) => {
          const card = cardMap.get(id);
          if (!card) return;

          const tile = document.createElement("button");
          tile.type = "button";
          tile.className = "game-tile";
          tile.classList.toggle("covered", state.hiddenMissingIds.has(id));

          const picture = document.createElement("div");
          picture.className = "game-picture";
          applyVisual(picture, card);
          picture.setAttribute("role", "img");
          picture.setAttribute("aria-label", card.word);

          tile.append(picture);
          tile.addEventListener("click", () => {
            if (state.hiddenMissingIds.has(id)) state.hiddenMissingIds.delete(id);
            else state.hiddenMissingIds.add(id);
            renderMissing();
          });

          grid.append(tile);
        });

        elements.gameArea.replaceChildren(grid);
        updateMissingAnswerHints();
        elements.counter.textContent = `${cards.length - state.hiddenMissingIds.size} / ${cards.length}`;
        elements.modeLabel.textContent = "Missing game";
        elements.shuffleButton.textContent = "Randomise";
        requestAnimationFrame(alignSideNavigation);
      }

      function hideOneMore() {
        const visible = state.missingOrder.filter((id) => !state.hiddenMissingIds.has(id));
        if (!visible.length) return;
        const id = visible[Math.floor(Math.random() * visible.length)];
        state.hiddenMissingIds.add(id);
        renderMissing();
      }

      function renderKeyword() {
        elements.missingAnswerHints.hidden = true;
        showGridGameLayout();
        elements.gameTitle.textContent = "Keyword game";
        elements.nextButton.dataset.gameAction = "pick";
        elements.nextButton.textContent = "PICK";
        elements.nextButton.setAttribute("aria-label", "Randomly pick a keyword");

        const cards = selectedCards();
        const cardMap = new Map(cards.map((card) => [card.id, card]));

        if (!state.keywordOrder.length || state.keywordOrder.length !== cards.length) {
          state.keywordOrder = cards.map((card) => card.id);
        }

        const grid = document.createElement("div");
        grid.className = "game-grid";
        setGridShape(grid, cards.length);

        state.keywordOrder.forEach((id) => {
          const card = cardMap.get(id);
          if (!card) return;

          const tile = document.createElement("button");
          tile.type = "button";
          tile.className = "game-tile";
          tile.classList.toggle("selected", state.keywordSelectedIds.has(id));

          const picture = document.createElement("div");
          picture.className = "game-picture";
          applyVisual(picture, card);
          picture.setAttribute("role", "img");
          picture.setAttribute("aria-label", card.word);

          tile.append(picture);
          tile.addEventListener("click", () => {
            if (state.keywordSelectedIds.has(id)) state.keywordSelectedIds.delete(id);
            else state.keywordSelectedIds.add(id);
            renderKeyword();
          });

          grid.append(tile);
        });

        elements.gameArea.replaceChildren(grid);
        elements.counter.textContent = `${state.keywordSelectedIds.size} / ${cards.length}`;
        elements.modeLabel.textContent = "Keywords selected";
        elements.shuffleButton.textContent = "Randomise";
        requestAnimationFrame(alignSideNavigation);
      }

      function selectRandomKeyword() {
        if (!state.keywordOrder.length) return;
        const id = state.keywordOrder[Math.floor(Math.random() * state.keywordOrder.length)];
        state.keywordSelectedIds.clear();
        state.keywordSelectedIds.add(id);
        renderKeyword();
      }

      function setGameMode(mode) {
        stopAuto();
        closeGameMenu();

        if (mode === "flashcards") {
          returnToFlashcards();
          return;
        }

        if (mode === "guess") {
          openGuessSetup();
          return;
        }

        state.gameMode = mode;

        if (mode === "missing") {
          state.missingOrder = selectedCards().map((card) => card.id);
          state.hiddenMissingIds.clear();
          hideOneMore();
          return;
        }

        if (mode === "keyword") {
          state.keywordOrder = selectedCards().map((card) => card.id);
          state.keywordSelectedIds.clear();
        }

        render();
      }

      function returnToFlashcards() {
        stopAuto();
        state.gameMode = "flashcards";
        resetGameState();
        render();
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

      function shuffleAction() {
        stopAuto();

        if (state.gameMode === "missing") {
          const original = state.missingOrder.length
            ? [...state.missingOrder]
            : selectedCards().map((card) => card.id);
          state.missingOrder = shuffled(original);
          if (
            state.missingOrder.length > 1 &&
            state.missingOrder.every((id, index) => id === original[index])
          ) {
            [state.missingOrder[0], state.missingOrder[1]] =
              [state.missingOrder[1], state.missingOrder[0]];
          }
          renderMissing();
          return;
        }

        if (state.gameMode === "keyword") {
          const original = state.keywordOrder.length
            ? [...state.keywordOrder]
            : selectedCards().map((card) => card.id);
          state.keywordOrder = shuffled(original);
          if (
            state.keywordOrder.length > 1 &&
            state.keywordOrder.every((id, index) => id === original[index])
          ) {
            [state.keywordOrder[0], state.keywordOrder[1]] =
              [state.keywordOrder[1], state.keywordOrder[0]];
          }
          renderKeyword();
          return;
        }

        if (state.gameMode === "guess") {
          randomGuessCard();
          return;
        }

        const currentId = currentCard() ? currentCard().id : null;
        state.deck = shuffled(state.deck);

        if (currentId && state.deck.length > 1 && state.deck[0].id === currentId) {
          [state.deck[0], state.deck[1]] = [state.deck[1], state.deck[0]];
        }

        state.position = 0;
        render();
      }

      function updateTimerDisplay() {
        const shown = state.autoTimer ? state.countdown : state.autoSeconds;
        elements.timerValue.textContent = `${shown} sec`;
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
        state.autoSeconds = Math.max(
          UNIT_CONFIG.autoSecondsMinimum,
          Math.min(UNIT_CONFIG.autoSecondsMaximum, state.autoSeconds + amount)
        );
        const wasRunning = Boolean(state.autoTimer);
        stopAuto();
        updateTimerDisplay();
        if (wasRunning) startAuto();
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

      function openSettings() {
        stopAuto();
        updateSettingsPreview();
        elements.settingsPanel.classList.add("open");
        elements.scrim.classList.add("open");
        syncImageDiagnosticToolbar();
      }

      function closePanels() {
        elements.settingsPanel.classList.remove("open");
        elements.guessSetup.hidden = true;
        elements.scrim.classList.remove("open");
        closeGameMenu();
        syncImageDiagnosticToolbar();
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
          stopAuto();
          previousCard();
        }
      });

      elements.nextButton.addEventListener("click", () => {
        elements.keyboardHelp.classList.add("collapsed");
        if (state.gameMode === "missing") hideOneMore();
        else if (state.gameMode === "keyword") selectRandomKeyword();
        else if (state.gameMode === "guess") nextGuessCard();
        else if (state.gameMode === "flashcards") {
          stopAuto();
          nextCard();
        }
      });

      elements.shuffleButton.addEventListener("click", shuffleAction);
      elements.autoButton.addEventListener("click", toggleAuto);
      elements.timerDownButton.addEventListener("click", () => changeTimer(-1));
      elements.timerUpButton.addEventListener("click", () => changeTimer(1));
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
          window.open(LETS_TRY_DATA.getExtraGamesPageUrl(), "_blank", "noopener,noreferrer");
        }
      });

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

      elements.settingsButton.addEventListener("click", openSettings);

      elements.imageDiagnosticToggle.addEventListener("click", () => {
        state.imageDiagnosticEnabled = !state.imageDiagnosticEnabled;
        document.documentElement.classList.toggle(
          "image-diagnostic-active",
          state.imageDiagnosticEnabled
        );
        elements.imageDiagnosticToggle.setAttribute(
          "aria-pressed",
          String(state.imageDiagnosticEnabled)
        );
        elements.imageDiagnosticToggle.classList.toggle(
          "active",
          state.imageDiagnosticEnabled
        );
        render();
        syncImageDiagnosticExportButton();
      });

      elements.imageDiagnosticExport.addEventListener("click", exportImageDiagnosis);

      elements.imageDiagnosticZoomRange.addEventListener("input", () => {
        updateActiveDiagnosticZoom(elements.imageDiagnosticZoomRange.value);
      });

      elements.imageDiagnosticZoomNumber.addEventListener("input", () => {
        const value = Number(elements.imageDiagnosticZoomNumber.value);
        if (Number.isFinite(value)) updateActiveDiagnosticZoom(value);
      });

      document.addEventListener("pointerdown", (event) => {
        if (
          !state.imageDiagnosticEnabled
          || elements.settingsPanel.classList.contains("open")
        ) return;

        const image = event.target.closest?.('[data-diagnostic-image="true"]');
        if (!image) return;

        const card = cardsById.get(image.dataset.diagnosticCardId);
        if (!card || !isDiagnosticImageCard(card)) return;

        event.preventDefault();
        event.stopPropagation();

        state.imageDiagnosticActiveKey = diagnosticKey(card);
        const adjustment = diagnosticAdjustment(card, true);
        const rect = image.getBoundingClientRect();

        state.imageDiagnosticDrag = {
          pointerId: event.pointerId,
          element: image,
          card,
          startX: event.clientX,
          startY: event.clientY,
          width: Math.max(1, rect.width),
          height: Math.max(1, rect.height),
          offsetX: Number(adjustment.offsetXPercent || 0),
          offsetY: Number(adjustment.offsetYPercent || 0)
        };

        image.classList.add("image-diagnostic-dragging");
        try { image.setPointerCapture(event.pointerId); } catch {}
        syncImageDiagnosticToolbar();
      }, true);

      document.addEventListener("pointermove", (event) => {
        const drag = state.imageDiagnosticDrag;
        if (!drag || event.pointerId !== drag.pointerId) return;

        event.preventDefault();
        const adjustment = diagnosticAdjustment(drag.card, true);
        adjustment.offsetXPercent = roundDiagnostic(
          drag.offsetX + ((event.clientX - drag.startX) / drag.width) * 100
        );
        adjustment.offsetYPercent = roundDiagnostic(
          drag.offsetY + ((event.clientY - drag.startY) / drag.height) * 100
        );
        applyImageDiagnosticAdjustment(drag.element, drag.card);
        syncImageDiagnosticExportButton();
      }, true);

      function finishImageDiagnosticDrag(event) {
        const drag = state.imageDiagnosticDrag;
        if (!drag || event.pointerId !== drag.pointerId) return;

        event.preventDefault();
        event.stopPropagation();
        drag.element.classList.remove("image-diagnostic-dragging");

        const adjustment = diagnosticAdjustment(drag.card, false);
        if (adjustment && !diagnosticHasChange(adjustment)) {
          delete state.imageDiagnosticAdjustments[diagnosticKey(drag.card)];
        }

        state.imageDiagnosticDrag = null;
        saveImageDiagnosisAdjustments();
        syncImageDiagnosticToolbar();
        syncImageDiagnosticExportButton();
      }

      document.addEventListener("pointerup", finishImageDiagnosticDrag, true);
      document.addEventListener("pointercancel", finishImageDiagnosticDrag, true);

      document.addEventListener("click", (event) => {
        if (
          state.imageDiagnosticEnabled
          && event.target.closest?.('[data-diagnostic-image="true"]')
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);

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

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          elements.keyboardHelp.classList.add("collapsed");
          closePanels();
          return;
        }

        if (elements.settingsPanel.classList.contains("open") || !elements.guessSetup.hidden) return;

        if (state.gameMode === "guess") {
          if (event.key === "ArrowRight" || event.code === "Space" || event.key === "Enter") {
            event.preventDefault();
            nextGuessCard();
          } else if (event.key.toLowerCase() === "r") {
            randomGuessCard();
          }
          return;
        }

        if (state.gameMode === "missing") {
          if (event.key === "ArrowRight" || event.code === "Space" || event.key === "Enter") {
            event.preventDefault();
            hideOneMore();
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
            selectRandomKeyword();
          } else if (event.key.toLowerCase() === "r") {
            shuffleAction();
          } else if (event.key.toLowerCase() === "g") {
            toggleGameMenu();
          }
          return;
        }

        if (event.key === "ArrowRight" || event.code === "Space" || event.key === "Enter") {
          event.preventDefault();
          stopAuto();
          nextCard();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          stopAuto();
          previousCard();
        } else if (event.key.toLowerCase() === "r") {
          shuffleAction();
        } else if (event.key.toLowerCase() === "a") {
          toggleAuto();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          changeTimer(1);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          changeTimer(-1);
        } else if (event.key.toLowerCase() === "g") {
          toggleGameMenu();
        }
      });

      window.addEventListener("resize", () => {
        requestAnimationFrame(alignSideNavigation);
      });

      initialisePage();
    })();
  