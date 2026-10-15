/* LT1 Unit 1 — shared-template configuration */
(function () {
  "use strict";

  const bookId = "lt1";
  const unitNumber = 1;
  const categoryId = "worldGreetings";
  const cards = LETS_TRY_CARD_FACTORY.makeCategoryCards(categoryId, {
    bookId, unitNumber, defaults: "tagged", alternateField: "word"
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "1",
    unitTitle: "Hello!",
    browserTitle: "Let’s Try! Tools — Hello!",
    unitColour: "#7FBE25",
    unitNumberColour: "#A8DC52",
    menuFile: "lets_try_1.html",
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
