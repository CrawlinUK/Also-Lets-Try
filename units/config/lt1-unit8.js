/* LT1 Unit 8 — What’s this? */
(function () {
  "use strict";

  const UNIT_BOOK_ID = "lt1";
  const UNIT_NUMBER = 8;

  const sheets = LETS_TRY_DATA.assets.sheets;
  const cells = LETS_TRY_DATA.assets.knownCells;

  const AN_ARTICLE_IDS = new Set(["apple", "elephant", "onion", "orange", "owl"]);

  const CARD_ORDER = [
    ["animals", "crow", "crow"],
    ["animals", "spider", "spider"],
    ["animals", "moth", "moth"],
    ["animals", "owl", "owl"],
    ["nature", "tree", "tree"],
    ["animals", "dog", "dog"],
    ["animals", "monkey", "monkey"],
    ["animals", "tiger", "tiger"],
    ["vegetables", "carrot", "carrot"],
    ["vegetables", "cucumber", "cucumber"],
    ["fruit", "peach", "peach"],
    ["fruit", "pineapple", "pineapple"],
    ["vegetables", "onion", "onion"],
    ["vegetables", "green-pepper", "pepper"],
    ["fruit", "orange", "orange"],
    ["vegetables", "tomato", "tomato"],

    ["fruit", "apple", "apple"],
    ["food", "rice-ball", "rice ball"],
    ["fruit", "strawberry", "strawberry"],
    ["sports", "soccer", "soccer ball"],
    ["animals", "elephant", "elephant"],
    ["animals", "cat", "cat"],
    ["food", "salad", "salad"],
    ["food", "milk", "milk"],
    ["sports", "table-tennis", "table tennis"],
    ["fruit", "banana", "banana"],
    ["fruit", "grapes", "grapes"],
    ["animals", "mouse", "mouse"],
    ["animals", "panda", "panda"],

    ["animals", "starfish", "starfish"],
    ["animals", "jellyfish", "jellyfish"],
    ["animals", "seahorse", "seahorse"],
    ["animals", "rabbit", "rabbit"]
  ];

  const oldAnimalIds = new Set([
    "cat", "panda", "spider", "elephant", "mouse",
    "tiger", "rabbit", "monkey", "dog"
  ]);
  const extraAnimalIds = new Set([
    "crow", "moth", "owl", "starfish", "jellyfish", "seahorse"
  ]);

  function spriteVisual(file, size, position) {
    if (!position) throw new Error("Missing Unit 8 sprite position.");
    return {
      src: LETS_TRY_DATA.assetUrl(file),
      size,
      position,
      flip: false,
      cropTop: 0
    };
  }

  function visualFor(categoryId, id) {
    if (categoryId === "animals" && oldAnimalIds.has(id)) {
      return spriteVisual(sheets.animals.file, "400% 500%", cells.animals[id]);
    }

    if (categoryId === "animals" && extraAnimalIds.has(id)) {
      const file = LETS_TRY_DATA.assets.images.unit8[id];
      if (!file) throw new Error(`Missing Unit 8 image for ${id}`);
      return {
        src: LETS_TRY_DATA.assetUrl(file),
        size: "contain",
        position: "center",
        flip: false,
        cropTop: 0
      };
    }

    if (categoryId === "nature" && id === "tree") {
      return {
        src: LETS_TRY_DATA.assetUrl(LETS_TRY_DATA.assets.images.nature.tree),
        size: "contain",
        position: "center",
        flip: false,
        cropTop: 0
      };
    }

    if (categoryId === "vegetables") {
      return spriteVisual(sheets.vegetables.file, "300% 300%", cells.vegetables[id]);
    }

    if (categoryId === "fruit") {
      return spriteVisual(sheets.fruit.file, "300% 400%", cells.fruit[id]);
    }

    if (categoryId === "food") {
      return spriteVisual(sheets.foods.file, "400% 400%", cells.foods[id]);
    }

    if (categoryId === "sports") {
      return spriteVisual(sheets.sports.file, "400% 300%", cells.sports[id]);
    }

    throw new Error(`No Unit 8 visual mapping for ${categoryId} / ${id}`);
  }

  function sentenceFor(id, word) {
    if (id === "milk") return "It’s milk.";
    if (id === "grapes") return "They’re grapes.";
    if (id === "table-tennis") return "It’s table tennis.";

    const article = AN_ARTICLE_IDS.has(id) ? "an" : "a";
    return `It’s ${article} ${word}.`;
  }

  const cards = CARD_ORDER.map(([category, id, word]) => ({
    id,
    category,
    word,
    sentence: sentenceFor(id, word),
    alternate: word,
    optionLabel: word,
    teacherAnswer: word,
    textbook: true,
    underlineToken: AN_ARTICLE_IDS.has(id) ? "an" : "",
    visual: visualFor(category, id)
  }));

  window.LETS_TRY_UNIT_CATEGORY_IDS = [
    "animals",
    "nature",
    "vegetables",
    "fruit",
    "food",
    "sports"
  ];

  window.LETS_TRY_UNIT_CONFIG = {
    bookId: UNIT_BOOK_ID,
    unitNumber: "8",
    unitTitle: "What’s this?",
    browserTitle: "Let’s Try! 1 — What’s this?",

    unitColour: "#0B7CC3",
    unitNumberColour: "#5AA9DA",

    menuFile: "../lets_try_1.html",

    defaultPrompt: "It’s a ~",
    selectionHeading: "Unit 8 words",
    wordLabel: "Word",
    sentenceLabel: "It’s a ~",
    alternateLabel: "Word",

    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      pictureSentence: "Picture + It’s a ~",
      text: "Word only"
    },

    pictureAspectRatio: "1 / 1",

    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,

    cards
  };
})();
