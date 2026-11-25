/* Book 2 Unit 8 — This is my favorite place. */
(function () {
  "use strict";
  const bookId = "book2";
  const unitNumber = 8;
  const categoryId = "schoolPlaces";
  const category = ALTE_DATA.getCategory(categoryId);
  const defaults = new Set(ALTE_DATA.getUnitDefaults(bookId, unitNumber)[categoryId] || []);

  const cards = category.items.map((entry) => {
    const word = entry.word || entry.id.replace(/-/g, " ");
    return {
      id: entry.id,
      category: categoryId,
      word,
      sentence: `The ${word}`,
      alternate: word,
      optionLabel: word,
      teacherAnswer: word,
      textbook: defaults.has(entry.id),
      visual: ALTE_DATA.getWordVisual(categoryId, entry.id)
        || { type: "text", text: word, aspectRatio: "1 / 1" }
    };
  });

  window.ALTE_UNIT_CATEGORY_IDS = [categoryId];
  window.ALTE_UNIT_CONFIG = {
    bookId,
    unitNumber: "8",
    unitTitle: "This is my favorite place.",
    browserTitle: "Bk2U8 — This is my favorite place.",
    unitColour: "#0B7CC3",
    unitNumberColour: "#5AA9DA",
    menuFile: "book-2.html",
    defaultPrompt: "The ~",
    schoolShortenSetting: true,
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
