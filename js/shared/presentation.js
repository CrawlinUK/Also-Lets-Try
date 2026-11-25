/* Shared classroom presentation — sprite, SVG, text and phrase rendering. */
(function (global) {
  "use strict";
  const PLACEHOLDER_IMAGE = "";
  function create({ state, UNIT_CONFIG, SHAPE_PRACTICE, data, isShapePracticeCard, shapeColourName, shapePracticeText, document }) {
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
        const colourValue = colourName && typeof data.getColourValue === "function"
          ? data.getColourValue(colourName)
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
      element.textContent = textVisual ? String(UNIT_CONFIG.schoolShortenSetting && card?.category === "schoolPlaces" ? classroomWord(card) : visual.text ?? card?.alternate ?? card?.word ?? "") : "";

      if (textVisual) {
        element.style.color = "";
        if (
          state.letterColourMode === "colour"
          && visual.alphabetLetter
          && typeof data.getAlphabetColour === "function"
        ) {
          element.style.color = data.getAlphabetColour(visual.alphabetLetter) || "";
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
      // All four crop edges use the same shared global values.
      // Undefined edges are zero, preserving every existing unit's artwork.
      const cropEdges = ["cropTop", "cropRight", "cropBottom", "cropLeft"]
        .map((edge) => Number(visual[edge]) || 0);
      element.style.clipPath = cropEdges.some((amount) => amount !== 0)
        ? `inset(${cropEdges.map((amount) => amount + "%").join(" ")})`
        : "none";
    }

    function classroomWord(card) {
      const word = card?.word || "";
      return UNIT_CONFIG.schoolShortenSetting && state.schoolShortened
        && card.category === "schoolPlaces"
        ? word.replace(/^school (?=(?:principal|nurse)[’'])/i, "")
        : word;
    }

    function cardText(card) {
      if (!card) return "SELECT A CARD";
      if (isShapePracticeCard(card)) return shapePracticeText(card);
      let text;
      if (state.displayMode === "pictureSentence") text = card.sentence || card.word;
      else if (state.displayMode === "pictureIts") {
        text = card.phraseMode === "weather" ? card.sentence : card.word;
      } else if (state.displayMode === "pictureLets") {
        text = card.phraseMode === "lets" ? card.sentence : card.word;
      } else text = card.word;
      if (UNIT_CONFIG.schoolShortenSetting && state.schoolShortened && card.category === "schoolPlaces") {
        text = text.replace(/^The school (?=(?:principal|nurse)[’'])/i, "The ")
          .replace(/^school (?=(?:principal|nurse)[’'])/i, "");
      }
      return text;
    }

    function renderCardText(element, card) {
      const text = cardText(card);
      // Start each card at its natural CSS size. The separate measuring node
      // determines the fitted size after this card's text is rendered.
      element.replaceChildren();
      element.style.fontSize = "";
      element.style.whiteSpace = "";
      element.style.maxWidth = "";

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


    return Object.freeze({ applyVisual, classroomWord, cardText, renderCardText });
  }
  global.ALTE_PRESENTATION = Object.freeze({ create });
})(window);
