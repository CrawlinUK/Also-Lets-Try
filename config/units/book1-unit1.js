/* Book 1 Unit 1 — shared-template configuration */
(function () {
  "use strict";

  const bookId = "book1";
  const unitNumber = 1;
  const categoryId = "worldGreetings";
  const cards = ALTE_CARD_FACTORY.makeCategoryCards(categoryId, {
    bookId, unitNumber, defaults: "tagged", alternateField: "word"
  });

  window.ALTE_UNIT_CATEGORY_IDS = [categoryId];
  window.ALTE_UNIT_CONFIG = {
    bookId,
    unitNumber: "1",
    unitTitle: "Hello!",
    browserTitle: "Bk1U1 — Hello!",
    unitColour: "#7FBE25",
    unitNumberColour: "#A8DC52",
    menuFile: "book-1.html",
    defaultPrompt: "",
    wordLabel: "Greeting",
    sentenceLabel: "Country",
    alternateLabel: "Greeting",
    pictureAspectRatio: "4 / 3",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
