/* Book 1 Unit 7 — shared-template configuration */
(function () {
  "use strict";

  const UNIT_BOOK_ID = "book1";
  const UNIT_NUMBER = 7;
  const UNIT_CATEGORY_IDS = ALTE_DATA.getUnitCategoryIds(UNIT_BOOK_ID, UNIT_NUMBER);
  const UNIT_DEFAULT_IDS = new Set(
    Object.values(ALTE_DATA.getUnitDefaults(UNIT_BOOK_ID, UNIT_NUMBER)).flat()
  );

  // Category and textbook unit share the same master practice settings.
  const SHARED_SHAPE_PRACTICE = ALTE_DATA.getCategory("shapes").shapePractice;
  const DEFAULT_SHAPE_COLOURS = SHARED_SHAPE_PRACTICE.defaultColours;

  function shapeVisual(id) {
    const file = ALTE_DATA.assets.vectors.shapes[id];
    return {
      type: "shape-svg",
      shapeId: id,
      src: ALTE_DATA.assetUrl(file),
      defaultColourName: DEFAULT_SHAPE_COLOURS[id],
      aspectRatio: "1 / 1"
    };
  }

  const shapeCategory = ALTE_DATA.getCategory("shapes");
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

  window.ALTE_UNIT_CATEGORY_IDS = UNIT_CATEGORY_IDS;
  window.ALTE_UNIT_CONFIG = {
    bookId: UNIT_BOOK_ID,
    unitNumber: "7",
    unitTitle: "This is for you.",
    browserTitle: "Bk1U7 — This is for you.",

    unitColour: "#6F58A3",
    unitNumberColour: "#8E79BB",

    menuFile: "book-1.html",

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

    shapePractice: SHARED_SHAPE_PRACTICE,

    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,

    cards
  };
})();
