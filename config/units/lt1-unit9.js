/* LT1 Unit 9 — Who are you? */
(function () {
  "use strict";

  const UNIT_BOOK_ID = "lt1";
  const UNIT_NUMBER = 9;
  const sheets = LETS_TRY_DATA.assets.sheets;
  const cells = LETS_TRY_DATA.assets.knownCells;

  // Core vocabulary: the 12 animals of the Chinese zodiac, using the
  // existing classroom vocabulary/artwork already in the project.
  const CARD_ORDER = [
    ["mouse", "mouse"],
    ["cow", "cow"],
    ["tiger", "tiger"],
    ["rabbit", "rabbit"],
    ["dragon", "dragon"],
    ["snake", "snake"],
    ["horse", "horse"],
    ["sheep", "sheep"],
    ["monkey", "monkey"],
    ["chicken", "chicken"],
    ["dog", "dog"],
    ["wild-boar", "wild boar"]
  ];

  function animalVisual(id) {
    const position = cells.animals[id];
    if (!position) throw new Error(`Missing Unit 9 animal position for ${id}.`);
    return {
      src: LETS_TRY_DATA.assetUrl(sheets.animals.file),
      size: "600% 300%",
      position,
      flip: false,
      cropTop: 0
    };
  }

  const cards = CARD_ORDER.map(([id, word]) => ({
    id,
    category: "animals",
    word,
    sentence: `I’m a ${word}.`,
    alternate: word,
    optionLabel: word,
    teacherAnswer: word,
    textbook: true,
    visual: animalVisual(id)
  }));

  window.LETS_TRY_UNIT_CATEGORY_IDS = ["animals"];

  window.LETS_TRY_UNIT_CONFIG = {
    bookId: UNIT_BOOK_ID,
    unitNumber: "9",
    unitTitle: "Who are you?",
    browserTitle: "Let’s Try! 1 — Who are you?",

    unitColour: "#14A83B",
    unitNumberColour: "#54BE6D",

    menuFile: "lets_try_1.html",

    defaultPrompt: "I’m a ~",
    selectionHeading: "Unit 9 animals",
    wordLabel: "Animal",
    sentenceLabel: "I’m a ~",
    alternateLabel: "Animal",

    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      pictureSentence: "Picture + I’m a ~",
      text: "Word only"
    },

    pictureAspectRatio: "1 / 1",

    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,

    cards
  };
})();
