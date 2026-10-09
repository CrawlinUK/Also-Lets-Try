/* LT1 Unit 7 — shared-template configuration */
(function () {
  "use strict";

  const UNIT_BOOK_ID = "lt1";
  const UNIT_NUMBER = 7;
  const UNIT_CATEGORY_IDS = LETS_TRY_DATA.getUnitCategoryIds(UNIT_BOOK_ID, UNIT_NUMBER);
  const UNIT_DEFAULT_IDS = new Set(
    Object.values(LETS_TRY_DATA.getUnitDefaults(UNIT_BOOK_ID, UNIT_NUMBER)).flat()
  );

  const DEFAULT_SHAPE_COLOURS = Object.freeze({
    circle: "purple",
    triangle: "green",
    square: "red",
    rectangle: "white",
    heart: "pink",
    diamond: "blue",
    star: "yellow"
  });

  function shapeVisual(id) {
    const file = LETS_TRY_DATA.assets.vectors.shapes[id];
    return {
      type: "shape-svg",
      shapeId: id,
      src: LETS_TRY_DATA.assetUrl(file),
      defaultColourName: DEFAULT_SHAPE_COLOURS[id],
      aspectRatio: "1 / 1"
    };
  }

  const shapeCategory = LETS_TRY_DATA.getCategory("shapes");
  const cards = shapeCategory.items.map((entry) => {
    const word = entry.id.replace(/-/g, " ");
    return {
      id: entry.id,
      category: "shapes",
      word,
      sentence: word,
      alternate: word,
      optionLabel: word,
      teacherAnswer: word,
      textbook: UNIT_DEFAULT_IDS.has(entry.id),
      visual: shapeVisual(entry.id)
    };
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = UNIT_CATEGORY_IDS;
  window.LETS_TRY_UNIT_CONFIG = {
    bookId: UNIT_BOOK_ID,
    unitNumber: "7",
    unitTitle: "This is for you.",
    browserTitle: "Let’s Try! 1 — This is for you.",

    unitColour: "#6F58A3",
    unitNumberColour: "#8E79BB",

    menuFile: "../lets_try_1.html",

    defaultPrompt: "",
    selectionHeading: "Shapes",
    wordLabel: "Shape",
    sentenceLabel: "Shape",
    alternateLabel: "Shape",

    showPictureSentenceMode: false,
    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      text: "Word only"
    },

    pictureAspectRatio: "1 / 1",

    shapePractice: {
      colourCategoryId: "colours",
      counts: [1, 2, 3, 4, 5],
      defaultColours: DEFAULT_SHAPE_COLOURS,
      colourOrder: [
        "green", "black", "blue", "yellow", "purple", "pink", "red", "white",
        "orange", "brown", "light-blue", "light-green", "gray"
      ]
    },

    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,

    cards
  };
})();
