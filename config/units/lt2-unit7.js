/* LT2 Unit 7 — What do you want? */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 7;
  const categoryIds = LETS_TRY_DATA.getUnitCategoryIds(bookId, unitNumber);
  const defaults = LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber);
  const sheets = LETS_TRY_DATA.assets.sheets;
  const cells = LETS_TRY_DATA.assets.knownCells;

  const plurals = Object.freeze({
    apple: "apples",
    strawberry: "strawberries",
    grapes: "grapes",
    orange: "oranges",
    pineapple: "pineapples",
    peach: "peaches",
    melon: "melons",
    banana: "bananas",
    "kiwi-fruit": "kiwi fruit",
    lemon: "lemons",
    cherry: "cherries",
    onion: "onions",
    "green-pepper": "green peppers",
    cucumber: "cucumbers",
    carrot: "carrots",
    tomato: "tomatoes",
    cabbage: "cabbages",
    corn: "corn",
    mushroom: "mushrooms",
    potato: "potatoes"
  });

  function wordFor(id) {
    return String(id).replace("kiwi-fruit", "kiwi fruit").replace("green-pepper", "green pepper").replace(/-/g, " ");
  }

  function visualFor(categoryId, id) {
    if (categoryId === "fruit") {
      return {
        src: LETS_TRY_DATA.assetUrl(sheets.fruit.file),
        size: "300% 400%",
        position: cells.fruit[id],
        flip: false,
        cropTop: 0
      };
    }
    return {
      src: LETS_TRY_DATA.assetUrl(sheets.vegetables.file),
      size: "300% 300%",
      position: cells.vegetables[id],
      flip: false,
      cropTop: 0
    };
  }

  const cards = categoryIds.flatMap((categoryId) => {
    const category = LETS_TRY_DATA.getCategory(categoryId);
    const defaultIds = new Set(defaults[categoryId] || []);
    return category.items.map((entry) => {
      const word = wordFor(entry.id);
      return {
        id: entry.id,
        category: categoryId,
        word,
        sentence: `I want ${plurals[entry.id] || word}, please.`,
        alternate: word,
        optionLabel: word,
        teacherAnswer: word,
        textbook: defaultIds.has(entry.id),
        visual: visualFor(categoryId, entry.id)
      };
    });
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = categoryIds;
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "7",
    unitTitle: "What do you want?",
    browserTitle: "Let’s Try! 2 — What do you want?",
    unitColour: "#6F58A3",
    unitNumberColour: "#8E79BB",
    menuFile: "lets_try_2.html",
    defaultPrompt: "I want ~, please.",
    selectionHeading: "Fruit and vegetables",
    wordLabel: "Food",
    sentenceLabel: "I want ~, please.",
    alternateLabel: "Food",
    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      pictureSentence: "Picture + I want ~",
      text: "Word only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
