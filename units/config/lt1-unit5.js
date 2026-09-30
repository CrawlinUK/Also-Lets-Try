/* LT1 Unit 5 — shared-template configuration */
(function () {
  "use strict";
const UNIT_BOOK_ID = "lt1";
    const UNIT_NUMBER = 5;
    const UNIT_CATEGORY_IDS = LETS_TRY_DATA.getUnitCategoryIds(UNIT_BOOK_ID, UNIT_NUMBER);
    const UNIT_DEFAULT_IDS = new Set(
      Object.values(LETS_TRY_DATA.getUnitDefaults(UNIT_BOOK_ID, UNIT_NUMBER)).flat()
    );

    const CARD_TEXT = {
      baseball: ["baseball", "I like baseball."],
      dodgeball: ["dodgeball", "I like dodgeball."],
      soccer: ["soccer", "I like soccer."],
      basketball: ["basketball", "I like basketball."],
      swimming: ["swimming", "I like swimming."],
      "table-tennis": ["table tennis", "I like table tennis."],
      volleyball: ["volleyball", "I like volleyball."],

      "ice-cream": ["ice cream", "I like ice cream."],
      pudding: ["pudding", "I like pudding."],
      milk: ["milk", "I like milk."],
      "orange-juice": ["orange juice", "I like orange juice."],
      hamburger: ["hamburger", "I like hamburgers."],
      pizza: ["pizza", "I like pizza."],
      spaghetti: ["spaghetti", "I like spaghetti."],
      sushi: ["sushi", "I like sushi."],
      steak: ["steak", "I like steak."],
      salad: ["salad", "I like salad."],
      cake: ["cake", "I like cake."],
      egg: ["egg", "I like eggs."],
      jam: ["jam", "I like jam."],
      noodle: ["noodles", "I like noodles."],
      "rice-ball": ["rice ball", "I like rice balls."],
      sausage: ["sausage", "I like sausages."],

      apple: ["apple", "I like apples."],
      strawberry: ["strawberry", "I like strawberries."],
      grapes: ["grapes", "I like grapes."],
      orange: ["orange", "I like oranges."],
      pineapple: ["pineapple", "I like pineapples."],
      peach: ["peach", "I like peaches."],
      melon: ["melon", "I like melons."],
      banana: ["banana", "I like bananas."],
      "kiwi-fruit": ["kiwi fruit", "I like kiwi fruit."],
      lemon: ["lemon", "I like lemons."],
      cherry: ["cherry", "I like cherries."]
    };

    function cardVisual(categoryId, id) {
      const sheets = LETS_TRY_DATA.assets.sheets;
      const cells = LETS_TRY_DATA.assets.knownCells;

      if (categoryId === "sports") {
        return {
          src: LETS_TRY_DATA.assetUrl(sheets.sports.file),
          size: "400% 300%",
          position: cells.sports[id],
          flip: false,
          cropTop: 0
        };
      }

      if (categoryId === "food" && id !== "sausage") {
        return {
          src: LETS_TRY_DATA.assetUrl(sheets.foods.file),
          size: "400% 400%",
          position: cells.foods[id],
          flip: false,
          cropTop: 0
        };
      }

      return {
        src: LETS_TRY_DATA.assetUrl(sheets.fruit.file),
        size: "300% 400%",
        position: cells.fruit[id],
        flip: false,
        cropTop: 0
      };
    }

    const UNIT_CARDS = UNIT_CATEGORY_IDS.flatMap((categoryId) => {
      const category = LETS_TRY_DATA.getCategory(categoryId);

      return category.items.map((entry) => {
        const text = CARD_TEXT[entry.id] || [entry.id.replace(/-/g, " "), entry.id.replace(/-/g, " ")];
        const visual = cardVisual(categoryId, entry.id);

        if (!visual.position) {
          throw new Error(`Missing Unit 5 sprite position for ${categoryId} / ${entry.id}`);
        }

        return {
          id: entry.id,
          category: categoryId,
          word: text[0],
          sentence: text[1],
          alternate: text[0],
          textbook: UNIT_DEFAULT_IDS.has(entry.id),
          visual
        };
      });
    });

    const UNIT_CONFIG = {
      unitNumber: "5",
      unitTitle: "What do you like?",
      browserTitle: "Let’s Try! Tools — What do you like?",

      unitColour: "#00ADA9",
      unitNumberColour: "#52C8C4",

      menuFile: "../lets_try_1.html",

      defaultPrompt: "What do you like?",
      selectionHeading: "Words",
      wordLabel: "Word",
      sentenceLabel: "I like...",
      alternateLabel: "Word",

      pictureAspectRatio: "1 / 1",

      autoSeconds: 3,
      autoSecondsMinimum: 1,
      autoSecondsMaximum: 5,

      cards: UNIT_CARDS
    };
    UNIT_CONFIG.bookId = UNIT_BOOK_ID;
    window.LETS_TRY_UNIT_CONFIG = UNIT_CONFIG;
    window.LETS_TRY_UNIT_CATEGORY_IDS = UNIT_CATEGORY_IDS;
})();
