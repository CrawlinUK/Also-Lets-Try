/* Book 1 Unit 2 — shared-template configuration */
(function () {
  "use strict";

  const bookId = "book1";
  const unitNumber = 2;
  const categoryId = "feelings";
  const cards = ALTE_CARD_FACTORY.makeCategoryCards(categoryId, {
    bookId, unitNumber, defaults: "tagged"
  });

  window.ALTE_UNIT_CATEGORY_IDS = [categoryId];
  window.ALTE_UNIT_CONFIG = {
    bookId,
    unitNumber: "2",
    unitTitle: "How are you?",
    browserTitle: "Bk1U2 — How are you?",
    unitColour: "#F6AB00",
    unitNumberColour: "#F6CA3F",
    menuFile: "book-1.html",
    defaultPrompt: "How are you?",
    wordLabel: "Word",
    sentenceLabel: "I’m ~",
    displayModeLabels: { pictureSentence: "Picture + I’m" },
    alternateLabel: "Word",
    pictureAspectRatio: "364 / 512",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
