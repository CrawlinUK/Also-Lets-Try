/* Book 2 Unit 5 — Do you have a pen? */
(function () {
  "use strict";
  const bookId = "book2";
  const unitNumber = 5;
  const categoryId = "stationery";
  const category = ALTE_DATA.getCategory(categoryId);
  const defaults = new Set(ALTE_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []);

  function label(id) {
    return String(id).replace(/-/g, " ");
  }

  function article(word) {
    return /^[aeiou]/i.test(word) ? "an" : "a";
  }

  const sheet = ALTE_DATA.assets.sheets.stationery;
  const cells = ALTE_DATA.assets.knownCells.stationery;

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
        ? { src: ALTE_DATA.assetUrl(sheet.file), size: sheet.backgroundSize, position: cells[entry.id], flip: false, cropTop: 0 }
        : { type: "text", text: word, aspectRatio: "1 / 1" }
    };
  });

  window.ALTE_UNIT_CATEGORY_IDS = [categoryId];
  window.ALTE_UNIT_CONFIG = {
    bookId,
    unitNumber: "5",
    unitTitle: "Do you have a pen?",
    browserTitle: "Bk2U5 — Do you have a pen?",
    unitColour: "#00ADA9",
    unitNumberColour: "#52C8C4",
    menuFile: "book-2.html",
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
