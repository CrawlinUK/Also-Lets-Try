/* LT2 Unit 1 — Hello, world! */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 1;
  const categoryId = "worldGreetings";
  const category = LETS_TRY_DATA.getCategory(categoryId);
  const defaults = new Set(LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []);
  const sheet = LETS_TRY_DATA.assets.sheets.flags;
  const cells = LETS_TRY_DATA.assets.knownCells.flags;

  const cards = category.items.map((entry) => ({
    id: entry.id,
    category: categoryId,
    word: entry.greeting,
    sentence: entry.country,
    alternate: entry.country,
    optionLabel: entry.greeting,
    teacherAnswer: entry.country,
    textbook: defaults.has(entry.id),
    visual: {
      src: LETS_TRY_DATA.assetUrl(sheet.file),
      size: sheet.backgroundSize,
      position: cells[entry.id],
      flip: false,
      cropTop: 0
    }
  })).filter((card) => card.visual.position);

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "1",
    unitTitle: "Hello, world!",
    browserTitle: "Let’s Try! 2 — Hello, world!",
    unitColour: "#7FBE25",
    unitNumberColour: "#A8DC52",
    menuFile: "lets_try_2.html",
    defaultPrompt: "",
    selectionHeading: "World greetings",
    wordLabel: "Greeting",
    sentenceLabel: "Country",
    alternateLabel: "Country",
    pictureAspectRatio: "4 / 3",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
