/* LT1 Unit 2 — shared-template configuration */
(function () {
  "use strict";

  const bookId = "lt1";
  const unitNumber = 2;
  const categoryId = "feelings";
  const category = LETS_TRY_DATA.getCategory(categoryId);
  const defaults = new Set(
    LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []
  );

  const sheet = LETS_TRY_DATA.assets.sheets.emotions;
  const cells = LETS_TRY_DATA.assets.knownCells.emotions;

  const cards = category.items.map((entry) => {
    const word = entry.id.replace(/-/g, " ");
    const cell = cells[entry.id];
    return {
      id: entry.id,
      category: categoryId,
      word,
      sentence: `I’m ${word}.`,
      alternate: word,
      teacherAnswer: word,
      textbook: defaults.has(entry.id),
      visual: {
        src: LETS_TRY_DATA.assetUrl(sheet.file),
        size: sheet.backgroundSize,
        position: cell.position,
        flip: Boolean(cell.flip),
        cropTop: cell.cropTop || 0
      }
    };
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "2",
    unitTitle: "How are you?",
    browserTitle: "Let’s Try! Tools — How are you?",
    unitColour: "#F6AB00",
    unitNumberColour: "#F6CA3F",
    menuFile: "lets_try_1.html",
    defaultPrompt: "How are you?",
    wordLabel: "Word",
    sentenceLabel: "Sentence",
    alternateLabel: "Word",
    pictureAspectRatio: "364 / 512",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
