/* LT2 Unit 8 — This is my favorite place. */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 8;
  const categoryId = "schoolPlaces";
  const category = LETS_TRY_DATA.getCategory(categoryId);
  const defaults = new Set(LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []);

  const labels = Object.freeze({
    "teachers-office": "teachers’ office",
    "school-principals-office": "school principal’s office",
    "school-nurses-office": "school nurse’s office",
    "arts-and-crafts-room": "arts and crafts room"
  });

  function label(id) {
    return labels[id] || String(id).replace(/-/g, " ");
  }

  const cards = category.items.map((entry) => {
    const word = label(entry.id);
    return {
      id: entry.id,
      category: categoryId,
      word,
      sentence: `The ${word}`,
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
    unitNumber: "8",
    unitTitle: "This is my favorite place.",
    browserTitle: "Let’s Try! 2 — This is my favorite place.",
    unitColour: "#0B7CC3",
    unitNumberColour: "#5AA9DA",
    menuFile: "lets_try_2.html",
    defaultPrompt: "The ~",
    selectionHeading: "School places",
    wordLabel: "Place",
    sentenceLabel: "The ~",
    alternateLabel: "Place",
    displayModeLabels: {
      pictureText: "Picture + place",
      picture: "Picture only",
      pictureSentence: "Picture + The ~",
      text: "Place only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
