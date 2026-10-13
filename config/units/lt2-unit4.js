/* LT2 Unit 4 — What time is it? */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 4;
  const categoryId = "dailyTimes";
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
      sentence: `It’s ${word}.`,
      alternate: word,
      optionLabel: word,
      teacherAnswer: word,
      textbook: defaults.has(entry.id),
      visual: { type: "text", text: word, aspectRatio: "1 / 1" }
    };
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "4",
    unitTitle: "What time is it?",
    browserTitle: "Let’s Try! 2 — What time is it?",
    unitColour: "#ED6D00",
    unitNumberColour: "#F28C45",
    menuFile: "lets_try_2.html",
    defaultPrompt: "It’s ~",
    selectionHeading: "Daily times",
    wordLabel: "Activity",
    sentenceLabel: "It’s ~",
    alternateLabel: "Activity",
    displayModeLabels: {
      pictureText: "Picture + activity",
      picture: "Picture only",
      pictureSentence: "Picture + It’s ~",
      text: "Activity only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
