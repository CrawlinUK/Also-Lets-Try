/* Book 2 Unit 1 — Hello, world! */
(function () {
  "use strict";
  const bookId = "book2";
  const unitNumber = 1;
  const categoryId = "worldGreetings";
  const cards = ALTE_CARD_FACTORY.makeCategoryCards(categoryId, {
    bookId, unitNumber, defaults: "tagged"
  });

  window.ALTE_UNIT_CATEGORY_IDS = [categoryId];
  window.ALTE_UNIT_CONFIG = {
    bookId,
    unitNumber: "1",
    unitTitle: "Hello, world!",
    browserTitle: "Bk2U1 — Hello, world!",
    unitColour: "#7FBE25",
    unitNumberColour: "#A8DC52",
    menuFile: "book-2.html",
    defaultPrompt: "",
    selectionHeading: "World greetings",
    wordLabel: "Greeting",
    sentenceLabel: "Country",
    alternateLabel: "Country",
    pictureAspectRatio: "4 / 3",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
