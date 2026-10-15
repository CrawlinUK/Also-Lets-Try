/* LT1 Unit 2 — shared-template configuration */
(function () {
  "use strict";

  const bookId = "lt1";
  const unitNumber = 2;
  const categoryId = "feelings";
  const cards = LETS_TRY_CARD_FACTORY.makeCategoryCards(categoryId, {
    bookId, unitNumber, defaults: "tagged"
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = [categoryId];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "2",
    unitTitle: "How are you?",
    browserTitle: "Let’s Try! Tools — How are you?",
    unitColour: "#F6AB00",
    unitNumberColour: "#F6CA3F",
    menuFile: "lets_try_1.html",
    defaultPrompt: "How are you?",
    wordLabel: "Word",
    sentenceLabel: "Sentence",
    alternateLabel: "Word",
    pictureAspectRatio: "364 / 512",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
