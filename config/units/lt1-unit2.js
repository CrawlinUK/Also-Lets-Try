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

  const sprite = {
    happy:       { x: 0,       y: 0,  flip: false },
    tired:       { x: 64,      y: 93, flip: false, cropTop: 3 },
    hungry:      { x: 96,      y: 0,  flip: false },
    sleepy:      { x: 31,      y: 93, flip: false },
    sad:         { x: 0,       y: 93, flip: false },
    fine:        { x: 93,      y: 93, flip: true,  cropTop: 3 },
    good:        { x: 93,      y: 93, flip: false, cropTop: 3 },
    great:       { x: 64,      y: 0,  flip: false },
    wonderful:   { x: 33.3333, y: 0,  flip: false }
  };

  const cards = category.items.map((entry) => {
    const word = entry.id.replace(/-/g, " ");
    const cell = sprite[entry.id];
    return {
      id: entry.id,
      category: categoryId,
      word,
      sentence: `I’m ${word}.`,
      alternate: word,
      teacherAnswer: word,
      textbook: defaults.has(entry.id),
      visual: {
        src: LETS_TRY_DATA.assetUrl("images/emotions.jpg"),
        size: "400% 200%",
        position: `${cell.x}% ${cell.y}%`,
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
    menuFile: "../lets_try_1.html",
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
