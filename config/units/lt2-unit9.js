/* LT2 Unit 9 — This is my day. */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 9;
  const categoryId = "dailyRoutine";
  const category = LETS_TRY_DATA.getCategory(categoryId);
  const defaults = new Set(LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []);

  function label(id) {
    return String(id).replace(/-/g, " ");
  }

  const cards = category.items.map((entry) => {
    const word = label(entry.id);
    return {
      id: entry.id,
      category: categoryId,
      word,
      sentence: `I ${word}.`,
      alternate: word,
      optionLabel: word,
      teacherAnswer: word,
      textbook: defaults.has(entry.id),
      visual: LETS_TRY_DATA.getWordVisual(categoryId, entry.id)
        || { type: "text", text: word, aspectRatio: "1 / 1" }
    };
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "9",
    unitTitle: "This is my day.",
    browserTitle: "Let’s Try! 2 — This is my day.",
    unitColour: "#14A83B",
    unitNumberColour: "#54BE6D",
    menuFile: "lets_try_2.html",
    defaultPrompt: "I ~.",
    selectionHeading: "Daily routine",
    wordLabel: "Activity",
    sentenceLabel: "I ~.",
    alternateLabel: "Activity",

    displayModeLabels: {
      pictureText: "Picture + activity",
      picture: "Picture only",
      pictureSentence: "Picture + I ~.",
      text: "Activity only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
