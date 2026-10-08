/* LT2 Unit 6 — shared alphabet configuration */
(function () {
  "use strict";

  const UNIT_BOOK_ID = "lt2";
  const UNIT_NUMBER = 6;
  const UNIT_CATEGORY_IDS = LETS_TRY_DATA.getUnitCategoryIds(UNIT_BOOK_ID, UNIT_NUMBER);
  const UNIT_DEFAULT_IDS = new Set(
    Object.values(LETS_TRY_DATA.getUnitDefaults(UNIT_BOOK_ID, UNIT_NUMBER)).flat()
  );

  const alphabet = LETS_TRY_DATA.getCategory("alphabet");

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

  window.LETS_TRY_UNIT_CATEGORY_IDS = UNIT_CATEGORY_IDS;
  window.LETS_TRY_UNIT_CONFIG = {
    bookId: UNIT_BOOK_ID,
    unitNumber: "6",
    unitTitle: "Alphabet",
    browserTitle: "Let’s Try! 2 — Alphabet",

    unitColour: "#E94643",
    unitNumberColour: "#EF7471",

    menuFile: "../lets_try_2.html",

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
