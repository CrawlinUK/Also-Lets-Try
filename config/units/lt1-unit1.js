/* LT1 Unit 1 — shared-template configuration */
(function () {
  "use strict";

  const bookId = "lt1";
  const unitNumber = 1;
  const categoryId = "worldGreetings";
  const category = LETS_TRY_DATA.getCategory(categoryId);
  const defaults = new Set(
    LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []
  );
  const flagSheet = LETS_TRY_DATA.assets.sheets.flags;
  const cells = LETS_TRY_DATA.assets.knownCells.flags;

  const cards = category.items.map((entry) => ({
    id: entry.id,
    category: categoryId,
    word: entry.greeting,
    sentence: entry.country,
    alternate: entry.greeting,
    optionLabel: entry.greeting,
    teacherAnswer: entry.country,
    textbook: defaults.has(entry.id),
    visual: {
      src: LETS_TRY_DATA.assetUrl(flagSheet.file),
      size: flagSheet.backgroundSize,
      position: cells[entry.id],
      flip: false,
      cropTop: 0
    }
  })).filter((card) => card.visual.position);

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "1",
    unitTitle: "Hello!",
    browserTitle: "Let’s Try! Tools — Hello!",
    unitColour: "#7FBE25",
    unitNumberColour: "#A8DC52",
    menuFile: "../lets_try_1.html",
    defaultPrompt: "",
    wordLabel: "Greeting",
    sentenceLabel: "Country",
    alternateLabel: "Greeting",
    pictureAspectRatio: "4 / 3",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
