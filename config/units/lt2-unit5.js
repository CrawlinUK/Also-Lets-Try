/* LT2 Unit 5 — Do you have a pen? */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 5;
  const categoryId = "stationery";
  const category = LETS_TRY_DATA.getCategory(categoryId);
  const defaults = new Set(LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []);

  function label(id) {
    return String(id).replace(/-/g, " ");
  }

  function article(word) {
    return /^[aeiou]/i.test(word) ? "an" : "a";
  }

  const sheet = LETS_TRY_DATA.assets.sheets.stationery;
  // The shared data has no verified stationery cell map yet; use row-major sheet order.
  const spritePositions = ["0% 0%", "33.333% 0%", "66.667% 0%", "100% 0%", "0% 50%", "33.333% 50%", "66.667% 50%", "100% 50%", "0% 100%", "33.333% 100%", "66.667% 100%", "100% 100%"];
  const cells = LETS_TRY_DATA.assets.knownCells.stationery || Object.fromEntries(category.items.map((entry, index) => [entry.id, spritePositions[index]]));

  const cards = category.items.map((entry) => {
    const word = label(entry.id);
    return {
      id: entry.id,
      category: categoryId,
      word,
      sentence: `Do you have ${article(word)} ${word}?`,
      alternate: word,
      optionLabel: word,
      teacherAnswer: word,
      textbook: defaults.has(entry.id),
      visual: cells[entry.id]
        ? { src: LETS_TRY_DATA.assetUrl(sheet.file), size: "400% 300%", position: cells[entry.id], flip: false, cropTop: 0 }
        : { type: "text", text: word, aspectRatio: "1 / 1" }
    };
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "5",
    unitTitle: "Do you have a pen?",
    browserTitle: "Let’s Try! 2 — Do you have a pen?",
    unitColour: "#00ADA9",
    unitNumberColour: "#52C8C4",
    menuFile: "lets_try_2.html",
    defaultPrompt: "Do you have a ~?",
    selectionHeading: "Stationery",
    wordLabel: "Stationery",
    sentenceLabel: "Do you have a ~?",
    alternateLabel: "Stationery",
    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      pictureSentence: "Picture + question",
      text: "Word only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
