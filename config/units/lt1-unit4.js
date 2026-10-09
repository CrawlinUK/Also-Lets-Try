/* LT1 Unit 4 — shared-template configuration.
   Card wording and visuals are preserved from the previous Unit 4 app. */
(function () {
  "use strict";

    const PLACEHOLDER_IMAGE = "";

    /*
      Unit 4 Colors
      -------------
      The colour pictures are generated from ONE canvas sprite at runtime.
      This avoids adding thirteen separate image files/data URLs to an already
      large unit. The irregular shapes are deliberately paint-splodge-like.
    */
    const COLOR_CARD_DATA = [
      { id: "red-color",         word: "red",         fill: "#E53935", textbook: true  },
      { id: "pink-color",        word: "pink",        fill: "#F28AB2", textbook: true  },
      { id: "yellow-color",      word: "yellow",      fill: "#FFD928", textbook: true  },
      { id: "blue-color",        word: "blue",        fill: "#27A7DF", textbook: true  },
      { id: "light-blue-color",  word: "light blue",  fill: "#8DDCF4", textbook: false },
      { id: "green-color",       word: "green",       fill: "#2DAA4F", textbook: true  },
      { id: "light-green-color", word: "light green", fill: "#A9D96A", textbook: false },
      { id: "orange-color",      word: "orange",      fill: "#F5A51B", textbook: true  },
      { id: "purple-color",      word: "purple",      fill: "#A65AA6", textbook: true  },
      { id: "black-color",       word: "black",       fill: "#111111", textbook: true  },
      { id: "white-color",       word: "white",       fill: "#F8F8F4", textbook: true  },
      { id: "brown-color",       word: "brown",       fill: "#A94D09", textbook: true  },
      { id: "gray-color",        word: "gray",        fill: "#9FA4A8", textbook: false }
    ];

    function createPaintSplodgeSprite(items) {
      const columns = 4;
      const rows = 4;
      const cell = 256;
      const canvas = document.createElement("canvas");
      canvas.width = columns * cell;
      canvas.height = rows * cell;
      const ctx = canvas.getContext("2d");
      if (!ctx) return PLACEHOLDER_IMAGE;

      function seededRandom(seedText) {
        let seed = 2166136261 >>> 0;
        for (const ch of seedText) {
          seed ^= ch.charCodeAt(0);
          seed = Math.imul(seed, 16777619) >>> 0;
        }
        return () => {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          return seed / 4294967296;
        };
      }

      function drawSplodge(cx, cy, fill, id) {
        const rand = seededRandom(id);
        const points = [];
        const baseRadius = 72;

        for (let point = 0; point < 22; point += 1) {
          const angle = (Math.PI * 2 * point) / 22;
          const radius = baseRadius * (0.80 + rand() * 0.38);
          points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius * (0.82 + rand() * 0.20)
          });
        }

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,.14)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        ctx.beginPath();

        points.forEach((current, index) => {
          const next = points[(index + 1) % points.length];
          const midX = (current.x + next.x) / 2;
          const midY = (current.y + next.y) / 2;
          if (index === 0) ctx.moveTo(midX, midY);
          else ctx.quadraticCurveTo(current.x, current.y, midX, midY);
        });

        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();

        if (id === "white-color") {
          ctx.shadowColor = "transparent";
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#AEB5BA";
          ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = id === "white-color" ? .38 : .18;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(cx - 22, cy - 24, 35, 18, -0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      items.forEach((item, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        drawSplodge(
          column * cell + cell / 2,
          row * cell + cell / 2,
          item.fill,
          item.id
        );
      });

      return canvas.toDataURL("image/png");
    }

    const COLOR_SPRITE = createPaintSplodgeSprite(COLOR_CARD_DATA);
    const COLOR_SPRITE_POSITIONS = ["0%", "33.333%", "66.667%", "100%"];

    function makeColorCard(item, index) {
      const column = index % 4;
      const row = Math.floor(index / 4);
      return {
        id: item.id,
        word: item.word,
        sentence: `I like ${item.word}.`,
        alternate: item.word,
        textbook: item.textbook,
        visual: {
          src: COLOR_SPRITE,
          size: "400% 400%",
          position: `${COLOR_SPRITE_POSITIONS[column]} ${COLOR_SPRITE_POSITIONS[row]}`,
          flip: false,
          cropTop: 0
        }
      };
    }

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

  const existingIds = new Set(UNIT_CONFIG.cards.map((card) => card.id));

  function humanLabel(id) {
    return id
      .replace("kiwi-fruit", "kiwi fruit")
      .replace("green-pepper", "green pepper")
      .replace("table-tennis", "table tennis")
      .replace(/-/g, " ");
  }

  const sentenceOverrides = {
    apple: "I like apples.",
    strawberry: "I like strawberries.",
    cherry: "I like cherries.",
    tomato: "I like tomatoes.",
    potato: "I like potatoes.",
    sausage: "I like sausages.",
    "green-pepper": "I like green peppers."
  };

  function addSpriteCard({ id, category, sheet, size, position }) {
    if (!position || existingIds.has(id)) return;
    const word = humanLabel(id);
    UNIT_CONFIG.cards.push({
      id,
      category,
      word,
      sentence: sentenceOverrides[id] || `I like ${word}.`,
      alternate: word,
      teacherAnswer: word,
      textbook: false,
      visual: {
        src: LETS_TRY_DATA.assetUrl(sheet),
        size,
        position,
        flip: false,
        cropTop: 0
      }
    });
    existingIds.add(id);
  }

  const sharedSheets = LETS_TRY_DATA.assets.sheets;
  const sharedCells = LETS_TRY_DATA.assets.knownCells;

  LETS_TRY_DATA.getCategory("sports").items.forEach((entry) => {
    addSpriteCard({
      id: entry.id,
      category: "sports",
      sheet: sharedSheets.sports.file,
      size: "400% 300%",
      position: sharedCells.sports[entry.id]
    });
  });

  LETS_TRY_DATA.getCategory("vegetables").items.forEach((entry) => {
    addSpriteCard({
      id: entry.id,
      category: "vegetables",
      sheet: sharedSheets.vegetables.file,
      size: "300% 300%",
      position: sharedCells.vegetables[entry.id]
    });
  });

  LETS_TRY_DATA.getCategory("fruit").items.forEach((entry) => {
    addSpriteCard({
      id: entry.id,
      category: "fruit",
      sheet: sharedSheets.fruit.file,
      size: "300% 400%",
      position: sharedCells.fruit[entry.id]
    });
  });

  addSpriteCard({
    id: "sausage",
    category: "food",
    sheet: sharedSheets.fruit.file,
    size: "300% 400%",
    position: sharedCells.fruit.sausage
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = ["colours","sports","food","vegetables","fruit"];
  window.LETS_TRY_UNIT_CONFIG = UNIT_CONFIG;
})();
