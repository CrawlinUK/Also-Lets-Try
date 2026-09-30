/* LT1 Unit 4 — shared-template configuration.
   Card wording and visuals are preserved from the previous Unit 4 app. */
(function () {
  "use strict";
  const UNIT_CONFIG = {
      unitNumber: "4",
      unitTitle: "I like blue.",
      browserTitle: "Let’s Try! Tools — I like blue.",

      /* Official textbook unit colour. */
      unitColour: "#ED6D00",

      /* Lighter orange for the large outlined number. */
      unitNumberColour: "#F28C45",

      /* Existing project menu page. */
      menuFile: "../lets_try_1.html",

      /* Main wording and settings labels. */
      defaultPrompt: "I like...",
      selectionHeading: "Words",
      wordLabel: "Word",
      sentenceLabel: "I like...",
      alternateLabel: "Alternate",

      /* The source pictures are arranged in landscape sprite-sheet cells. */
      pictureAspectRatio: "1 / 1",

      /* Automatic-play defaults. */
      autoSeconds: 3,
      autoSecondsMinimum: 1,
      autoSecondsMaximum: 5,

      cards: [
        {
          id: "baseball",
          word: "baseball",
          sentence: "I like baseball.",
          alternate: "baseball",
          textbook: true,
          visual: {
            src: "../images/sports.png",
            size: "400% 300%",
            position: "0% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "dodgeball",
          word: "dodgeball",
          sentence: "I like dodgeball.",
          alternate: "dodgeball",
          textbook: true,
          visual: {
            src: "../images/sports.png",
            size: "400% 300%",
            position: "33.333% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "soccer",
          word: "soccer",
          sentence: "I like soccer.",
          alternate: "soccer",
          textbook: true,
          visual: {
            src: "../images/sports.png",
            size: "400% 300%",
            position: "66.667% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "basketball",
          word: "basketball",
          sentence: "I like basketball.",
          alternate: "basketball",
          textbook: true,
          visual: {
            src: "../images/sports.png",
            size: "400% 300%",
            position: "100% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "swimming",
          word: "swimming",
          sentence: "I like swimming.",
          alternate: "swimming",
          textbook: true,
          visual: {
            src: "../images/sports.png",
            size: "400% 300%",
            position: "0% 50.000%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "ice-cream",
          word: "ice cream",
          sentence: "I like ice cream.",
          alternate: "ice cream",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "0% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "pudding",
          word: "pudding",
          sentence: "I like pudding.",
          alternate: "pudding",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "33.333% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "milk-blue",
          word: "milk",
          sentence: "I like milk.",
          alternate: "milk",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "66.667% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "orange-juice",
          word: "orange juice",
          sentence: "I like orange juice.",
          alternate: "orange juice",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "100% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "hamburger",
          word: "hamburger",
          sentence: "I like hamburger.",
          alternate: "hamburger",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "0% 33.333%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "pizza",
          word: "pizza",
          sentence: "I like pizza.",
          alternate: "pizza",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "33.333% 33.333%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "spaghetti",
          word: "spaghetti",
          sentence: "I like spaghetti.",
          alternate: "spaghetti",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "66.667% 33.333%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "sushi",
          word: "sushi",
          sentence: "I like sushi.",
          alternate: "sushi",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "100% 33.333%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "steak",
          word: "steak",
          sentence: "I like steak.",
          alternate: "steak",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "0% 66.667%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "salad",
          word: "salad",
          sentence: "I like salad.",
          alternate: "salad",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "33.333% 66.667%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "cake",
          word: "cake",
          sentence: "I like cake.",
          alternate: "cake",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "66.667% 66.667%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "egg",
          word: "egg",
          sentence: "I like eggs.",
          alternate: "egg",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "100% 66.667%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "jam",
          word: "jam",
          sentence: "I like jam.",
          alternate: "jam",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "0% 100%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "noodles",
          word: "noodles",
          sentence: "I like noodles.",
          alternate: "noodles",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "33.333% 100%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "rice-ball",
          word: "rice ball",
          sentence: "I like rice balls.",
          alternate: "rice ball",
          textbook: true,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "66.667% 100%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "milk-red",
          word: "milk",
          sentence: "I like milk.",
          alternate: "milk",
          textbook: false,
          visual: {
            src: "../images/foods.png",
            size: "400% 400%",
            position: "100% 100%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "onion",
          word: "onion",
          sentence: "I like onions.",
          alternate: "onion",
          textbook: true,
          visual: {
            src: "../images/veg.png",
            size: "300% 300%",
            position: "0% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "green-pepper",
          word: "green pepper",
          sentence: "I like green peppers.",
          alternate: "green pepper",
          textbook: true,
          visual: {
            src: "../images/veg.png",
            size: "300% 300%",
            position: "50.000% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "cucumber",
          word: "cucumber",
          sentence: "I like cucumbers.",
          alternate: "cucumber",
          textbook: true,
          visual: {
            src: "../images/veg.png",
            size: "300% 300%",
            position: "100% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "carrot",
          word: "carrot",
          sentence: "I like carrots.",
          alternate: "carrot",
          textbook: true,
          visual: {
            src: "../images/veg.png",
            size: "300% 300%",
            position: "0% 50.000%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "grapes",
          word: "grapes",
          sentence: "I like grapes.",
          alternate: "grapes",
          textbook: true,
          visual: {
            src: "../images/fruit.png",
            size: "300% 400%",
            position: "0% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "orange",
          word: "orange",
          sentence: "I like oranges.",
          alternate: "orange",
          textbook: true,
          visual: {
            src: "../images/fruit.png",
            size: "300% 400%",
            position: "50.000% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "pineapple",
          word: "pineapple",
          sentence: "I like pineapples.",
          alternate: "pineapple",
          textbook: true,
          visual: {
            src: "../images/fruit.png",
            size: "300% 400%",
            position: "100% 0%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "peach",
          word: "peach",
          sentence: "I like peaches.",
          alternate: "peach",
          textbook: true,
          visual: {
            src: "../images/fruit.png",
            size: "300% 400%",
            position: "0% 33.333%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "melon",
          word: "melon",
          sentence: "I like melons.",
          alternate: "melon",
          textbook: true,
          visual: {
            src: "../images/fruit.png",
            size: "300% 400%",
            position: "50.000% 33.333%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "banana",
          word: "banana",
          sentence: "I like bananas.",
          alternate: "banana",
          textbook: true,
          visual: {
            src: "../images/fruit.png",
            size: "300% 400%",
            position: "100% 33.333%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "kiwi",
          word: "kiwi",
          sentence: "I like kiwis.",
          alternate: "kiwi",
          textbook: true,
          visual: {
            src: "../images/fruit.png",
            size: "300% 400%",
            position: "0% 66.667%",
            flip: false,
            cropTop: 0
          }
        },
        {
          id: "lemon",
          word: "lemon",
          sentence: "I like lemons.",
          alternate: "lemon",
          textbook: true,
          visual: {
            src: "../images/fruit.png",
            size: "300% 400%",
            position: "50.000% 66.667%",
            flip: false,
            cropTop: 0
          }
        },
        ...COLOR_CARD_DATA.map(makeColorCard)
      ]
    };

  const sports = new Set(["baseball","dodgeball","soccer","basketball","swimming"]);
  const vegetables = new Set(["onion","green-pepper","cucumber","carrot"]);
  const fruit = new Set(["grapes","orange","pineapple","peach","melon","banana","kiwi","lemon"]);

  function categoryFor(card) {
    if (card.id.endsWith("-color")) return "colours";
    if (sports.has(card.id)) return "sports";
    if (vegetables.has(card.id)) return "vegetables";
    if (fruit.has(card.id)) return "fruit";
    return "food";
  }

  UNIT_CONFIG.bookId = "lt1";
  UNIT_CONFIG.cards = UNIT_CONFIG.cards.map((card) => ({
    ...card,
    category: categoryFor(card),
    teacherAnswer: card.word
  }));

  window.LETS_TRY_UNIT_CATEGORY_IDS = ["colours","sports","food","vegetables","fruit"];
  window.LETS_TRY_UNIT_CONFIG = UNIT_CONFIG;
})();
