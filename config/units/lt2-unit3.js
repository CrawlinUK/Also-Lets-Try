/* LT2 Unit 3 — I like Mondays. */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 3;
  const categoryId = "days";
  const category = LETS_TRY_DATA.getCategory(categoryId);
  const defaults = new Set(LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []);
  const sheet = LETS_TRY_DATA.assets.sheets.days;
  const cells = LETS_TRY_DATA.assets.knownCells.days;

  const cards = category.items.map((entry) => ({
    id: entry.id,
    category: categoryId,
    word: entry.id,
    sentence: `I like ${entry.id}.`,
    alternate: entry.id,
    optionLabel: entry.id,
    teacherAnswer: entry.id,
    textbook: defaults.has(entry.id),
    visual: {
      src: LETS_TRY_DATA.assetUrl(sheet.file),
      size: "400% 200%",
      position: cells[entry.id],
      flip: false,
      cropTop: 0
    }
  }));

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "3",
    unitTitle: "I like Mondays.",
    browserTitle: "Let’s Try! 2 — I like Mondays.",
    unitColour: "#E84283",
    unitNumberColour: "#EF78A5",
    menuFile: "lets_try_2.html",
    defaultPrompt: "I like ~",
    selectionHeading: "Days",
    wordLabel: "Day",
    sentenceLabel: "I like ~",
    alternateLabel: "Day",
    displayModeLabels: {
      pictureText: "Picture + day",
      picture: "Picture only",
      pictureSentence: "Picture + I like ~",
      text: "Day only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
