/* LT1 Unit 7 — shared-template configuration */
(function () {
  "use strict";

  const UNIT_BOOK_ID = "lt1";
  const UNIT_NUMBER = 7;
  const UNIT_META = LETS_TRY_DATA.getUnit(UNIT_BOOK_ID, UNIT_NUMBER) || {};
  const UNIT_CATEGORY_IDS = [...new Set([
    ...LETS_TRY_DATA.getUnitCategoryIds(UNIT_BOOK_ID, UNIT_NUMBER),
    ...(UNIT_META.reviewCategories || [])
  ])];
  const UNIT_DEFAULT_IDS = new Set(
    Object.values(LETS_TRY_DATA.getUnitDefaults(UNIT_BOOK_ID, UNIT_NUMBER)).flat()
  );

  const COLOUR_FILLS = Object.freeze({
    red: "#E53935",
    pink: "#F28AB2",
    yellow: "#FFD928",
    blue: "#27A7DF",
    green: "#2DAA4F",
    orange: "#F5A51B",
    purple: "#A65AA6",
    black: "#111111",
    white: "#F8F8F4",
    brown: "#A94D09",
    "light-blue": "#8DDCF4",
    "light-green": "#A9D96A",
    gray: "#9FA4A8"
  });

  function createPaintSplodgeSprite(items) {
    const columns = 4;
    const rows = 4;
    const cell = 256;
    const canvas = document.createElement("canvas");
    canvas.width = columns * cell;
    canvas.height = rows * cell;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

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

      if (id === "white") {
        ctx.shadowColor = "transparent";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#AEB5BA";
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = id === "white" ? .38 : .18;
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

  const colourCategory = LETS_TRY_DATA.getCategory("colours");
  const colourItems = colourCategory.items.map((entry) => ({
    id: entry.id,
    fill: COLOUR_FILLS[entry.id] || "#999999"
  }));
  const colourSprite = createPaintSplodgeSprite(colourItems);
  const spritePositions = ["0%", "33.333%", "66.667%", "100%"];

  function colourVisual(id) {
    const index = colourItems.findIndex((item) => item.id === id);
    const column = index % 4;
    const row = Math.floor(index / 4);
    return {
      src: colourSprite,
      size: "400% 400%",
      position: `${spritePositions[column]} ${spritePositions[row]}`,
      flip: false,
      cropTop: 0
    };
  }

  function shapeVisual(id) {
    const file = LETS_TRY_DATA.assets.vectors.shapes[id];
    return {
      src: LETS_TRY_DATA.assetUrl(file),
      size: "contain",
      position: "center",
      flip: false,
      cropTop: 0
    };
  }

  const cards = UNIT_CATEGORY_IDS.flatMap((categoryId) => {
    const category = LETS_TRY_DATA.getCategory(categoryId);
    if (!category) return [];

    return category.items.map((entry) => {
      const word = entry.id.replace(/-/g, " ");
      return {
        id: entry.id,
        category: categoryId,
        word,
        sentence: word,
        alternate: word,
        optionLabel: word,
        teacherAnswer: word,
        textbook: UNIT_DEFAULT_IDS.has(entry.id),
        visual: categoryId === "shapes"
          ? shapeVisual(entry.id)
          : colourVisual(entry.id)
      };
    });
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
    selectionHeading: "Shapes & colours",
    wordLabel: "Word",
    sentenceLabel: "Word",
    alternateLabel: "Word",

    showPictureSentenceMode: false,
    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      text: "Word only"
    },

    pictureAspectRatio: "1 / 1",

    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,

    cards
  };
})();
