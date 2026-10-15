/* Standalone category flashcards. Uses the same shared classroom interface as units. */
(function () {
  "use strict";
  const id = new URLSearchParams(location.search).get("category");
  const data = LETS_TRY_DATA;
  const category = data.getCategory(id);
  const supported = ["worldGreetings", "englishGreetings", "feelings"];
  if (!category || !supported.includes(id)) throw new Error("Category is not yet available: " + id);

  // Shared vocabulary profiles and artwork mappings build these cards.
  const cards = LETS_TRY_CARD_FACTORY.makeCategoryCards(id, { defaults: "all" });
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
