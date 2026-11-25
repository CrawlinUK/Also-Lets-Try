/* Book 2 Unit 6 — shared alphabet configuration */
(function () {
  "use strict";

  const UNIT_BOOK_ID = "book2";
  const UNIT_NUMBER = 6;
  const UNIT_CATEGORY_IDS = ALTE_DATA.getUnitCategoryIds(UNIT_BOOK_ID, UNIT_NUMBER);
  const UNIT_DEFAULT_IDS = new Set(
    Object.values(ALTE_DATA.getUnitDefaults(UNIT_BOOK_ID, UNIT_NUMBER)).flat()
  );

  const alphabet = ALTE_DATA.getCategory("alphabet");

  const cards = alphabet.items.map((entry) => {
    const letter = entry.id.toLowerCase();
    return {
      id: entry.id,
      category: "alphabet",
      word: letter,
      sentence: letter,
      alternate: letter,
      optionLabel: letter,
      teacherAnswer: letter,
      textbook: UNIT_DEFAULT_IDS.has(entry.id),
      visual: {
        type: "text",
        text: letter,
        alphabetLetter: letter,
        aspectRatio: "1 / 1"
      }
    };
  });

  window.ALTE_UNIT_CATEGORY_IDS = UNIT_CATEGORY_IDS;
  window.ALTE_UNIT_CONFIG = {
    bookId: UNIT_BOOK_ID,
    unitNumber: "6",
    unitTitle: "Alphabet",
    browserTitle: "Bk2U6 — Alphabet",

    unitColour: "#E94643",
    unitNumberColour: "#EF7471",

    menuFile: "book-2.html",

    defaultPrompt: "",
    selectionHeading: "Letters",
    wordLabel: "Letter",
    sentenceLabel: "Letter",
    alternateLabel: "Letter",

    defaultDisplayMode: "picture",
    displayModes: ["picture"],
    showPictureSentenceMode: false,
    letterColourControl: true,
    defaultLetterColourMode: "plain",
    displayModeLabels: {
      picture: "Lowercase letter"
    },
    balanceLabels: {
      picture: "Letter",
      text: "Letter"
    },

    pictureAspectRatio: "1 / 1",

    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,

    games: {
      guess: false
    },

    cards
  };
})();
