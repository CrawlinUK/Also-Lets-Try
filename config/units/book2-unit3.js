/* Book 2 Unit 3 — I like Mondays. */
(function () {
  "use strict";
  const bookId = "book2";
  const unitNumber = 3;
  const categoryId = "days";
  const category = ALTE_DATA.getCategory(categoryId);
  const defaults = new Set(ALTE_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []);
  const sheet = ALTE_DATA.assets.sheets.days;
  const cells = ALTE_DATA.assets.knownCells.days;

  const cards = category.items.map((entry) => ({
    id: entry.id,
    category: categoryId,
    word: entry.id,
    sentence: `It’s ${entry.id}.`,
    alternate: entry.id,
    optionLabel: entry.id,
    teacherAnswer: entry.id,
    textbook: defaults.has(entry.id),
    visual: {
      src: ALTE_DATA.assetUrl(sheet.file),
      size: "400% 200%",
      position: cells[entry.id],
      flip: false,
      cropTop: 0
    }
  }));

  window.ALTE_UNIT_CATEGORY_IDS = [categoryId];
  window.ALTE_UNIT_CONFIG = {
    bookId,
    unitNumber: "3",
    unitTitle: "I like Mondays.",
    browserTitle: "Bk2U3 — I like Mondays.",
    unitColour: "#E84283",
    unitNumberColour: "#EF78A5",
    menuFile: "book-2.html",
    defaultPrompt: "It’s ~",
    selectionHeading: "Days",
    wordLabel: "Day",
    sentenceLabel: "It’s ~",
    alternateLabel: "Day",
    displayModeLabels: {
      pictureText: "Picture + day",
      picture: "Picture only",
      pictureSentence: "Picture + It’s ~",
      text: "Day only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
