/* Standalone category flashcards. Uses the same shared classroom interface as units. */
(function () {
  "use strict";
  const id = new URLSearchParams(location.search).get("category");
  const data = LETS_TRY_DATA;
  const category = data.getCategory(id);
  if (!data.hasCategoryPictures(id)) throw new Error("Category has no mapped picture cards: " + id);

  // Shared vocabulary profiles and artwork mappings build these cards.
  const cards = LETS_TRY_CARD_FACTORY.makeCategoryCards(id, { defaults: "all", onlyWithPictures: true });
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
    pictureAspectRatio: cards.find(card => card.visual?.src)?.visual?.aspectRatio || "1 / 1",
    autoSeconds: 3, autoSecondsMinimum: 1, autoSecondsMaximum: 5,
    ...(id === "englishGreetings" ? {
      defaultDisplayMode: "text",
      displayModes: ["text"],
      showPictureSentenceMode: false
    } : {}),
    ...(id === "shapes" ? {
      // Activate the same colour palette, 1–5 shape counts, and text
      // options as Book 1 Unit 7, without adding cards to the category.
      shapePractice: category.shapePractice,
      showPictureSentenceMode: false,
      displayModeLabels: {
        pictureText: "Picture + word",
        picture: "Picture only",
        text: "Word only"
      }
    } : {}),
    cards
  };
})();
