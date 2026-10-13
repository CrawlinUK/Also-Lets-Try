/* LT2 Unit 2 — Let’s play cards. */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 2;
  const categoryIds = LETS_TRY_DATA.getUnitCategoryIds(bookId, unitNumber);
  const defaults = LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber);

  function human(id) {
    return String(id).replace(/-/g, " ");
  }

  const sheets = LETS_TRY_DATA.assets.sheets;
  const cells = LETS_TRY_DATA.assets.knownCells;

  function spriteVisual(categoryId, id) {
    const map = {
      weather: { sheet: sheets.weather, cells: cells.weather, size: "300% 200%" },
      clothes: { sheet: sheets.clothes, cells: cells.clothes, size: "300% 200%" },
      playActivities: { sheet: sheets.playActivities, cells: cells.playActivities, size: "200% 200%" }
    };
    const source = map[categoryId];
    if (!source || !source.cells[id]) {
      return { type: "text", text: human(id), aspectRatio: "1 / 1" };
    }
    return {
      src: LETS_TRY_DATA.assetUrl(source.sheet.file),
      size: source.size,
      position: source.cells[id],
      flip: false,
      cropTop: 0
    };
  }

  const cards = categoryIds.flatMap((categoryId) => {
    const category = LETS_TRY_DATA.getCategory(categoryId);
    const defaultIds = new Set(defaults[categoryId] || []);
    return category.items.map((entry) => {
      const word = human(entry.id);
      const isWeather = categoryId === "weather";
      const isPlay = categoryId === "playActivities";
      const sentence = isWeather
        ? `It’s ${word}.`
        : isPlay
          ? `Let’s ${word}.`
          : word;
      return {
        id: entry.id,
        category: categoryId,
        phraseMode: isWeather ? "weather" : isPlay ? "lets" : "",
        word,
        sentence,
        alternate: word,
        optionLabel: word,
        teacherAnswer: word,
        textbook: defaultIds.has(entry.id),
        visual: spriteVisual(categoryId, entry.id)
      };
    });
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = categoryIds;
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "2",
    unitTitle: "Let’s play cards.",
    browserTitle: "Let’s Try! 2 — Let’s play cards.",
    unitColour: "#F6AB00",
    unitNumberColour: "#F8C34A",
    menuFile: "lets_try_2.html",
    defaultPrompt: "Let’s ~",
    selectionHeading: "Unit 2 words",
    wordLabel: "Word",
    sentenceLabel: "Phrase",
    alternateLabel: "Word",
    phraseSwitch: {
      initial: "lets",
      includeUnassigned: true,
      modes: [
        { id: "lets", label: "Let’s ~" },
        { id: "weather", label: "It’s ~" }
      ]
    },
    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      pictureSentence: "Picture + phrase",
      text: "Word only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
