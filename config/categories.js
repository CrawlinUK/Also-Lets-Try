/* Standalone category flashcards. Uses the same shared classroom interface as units. */
(function () {
  "use strict";
  const id = new URLSearchParams(location.search).get("category");
  const data = LETS_TRY_DATA;
  const category = data.getCategory(id);
  const supported = ["worldGreetings", "englishGreetings", "feelings"];
  if (!category || !supported.includes(id)) throw new Error("Category is not yet available: " + id);

  const flags = data.assets.sheets.flags;
  const flagCells = data.assets.knownCells.flags;
  const feelingCells = {
    happy: [0, 0, false, 0], tired: [64, 93, false, 3],
    hungry: [96, 0, false, 0], sleepy: [31, 93, false, 0],
    sad: [0, 93, false, 0], fine: [93, 93, true, 3],
    good: [93, 93, false, 3], great: [64, 0, false, 0],
    wonderful: [33.3333, 0, false, 0]
  };
  function label(value) {
    return value.replace(/-/g, " ");
  }
  const cards = category.items.map((entry) => {
    const word = id === "worldGreetings" ? entry.greeting : label(entry.id);
    let visual;
    if (id === "worldGreetings") {
      if (!flagCells[entry.id]) return null;
      visual = {
        src: data.assetUrl(flags.file), size: flags.backgroundSize,
        position: flagCells[entry.id], flip: false, cropTop: 0
      };
    } else if (id === "feelings") {
      const cell = feelingCells[entry.id];
      if (!cell) return null;
      visual = {
        src: data.assetUrl("images/emotions.jpg"), size: "400% 200%",
        position: cell[0] + "% " + cell[1] + "%",
        flip: cell[2], cropTop: cell[3]
      };
    } else {
      visual = { type: "text", text: word, aspectRatio: "1 / 1" };
    }
    return {
      id: entry.id, category: id, word,
      sentence: id === "worldGreetings" ? entry.country : id === "feelings" ? "I’m " + word + "." : word,
      alternate: id === "worldGreetings" ? entry.country : word,
      optionLabel: word, teacherAnswer: id === "worldGreetings" ? entry.country : word,
      textbook: true, visual
    };
  }).filter(Boolean);
  window.LETS_TRY_UNIT_CATEGORY_IDS = [id];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId: "categories", unitNumber: "", unitTitle: category.label,
    browserTitle: "Categories — " + category.label, unitColour: "#1687DF",
    unitNumberColour: "#1687DF", menuFile: "categories.html",
    defaultPrompt: id === "feelings" ? "How are you?" : "",
    selectionHeading: category.label,
    wordLabel: id === "worldGreetings" ? "Greeting" : "Word",
    sentenceLabel: id === "worldGreetings" ? "Country" : "Phrase",
    alternateLabel: id === "worldGreetings" ? "Country" : "Word",
    pictureAspectRatio: id === "worldGreetings" ? "4 / 3" : id === "feelings" ? "364 / 512" : "1 / 1",
    autoSeconds: 3, autoSecondsMinimum: 1, autoSecondsMaximum: 5,
    ...(id === "englishGreetings" ? {
      defaultDisplayMode: "text",
      displayModes: ["text"],
      showPictureSentenceMode: false
    } : {}),
    cards
  };
})();
