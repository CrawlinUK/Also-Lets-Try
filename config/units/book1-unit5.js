/* Book 1 Unit 5 — category-driven configuration; vocabulary and artwork are shared. */
(function () {
  "use strict";

  window.ALTE_UNIT_CONFIG = {
    bookId: "book1",
    unitNumber: "5",
    unitTitle: "What do you like?",
    browserTitle: "Bk1U5 — What do you like?",

    unitColour: "#00ADA9",
    unitNumberColour: "#52C8C4",
    menuFile: "book-1.html",

    defaultPrompt: "What do you like?",
    selectionHeading: "Words",
    wordLabel: "Word",
    sentenceLabel: "I like...",
    alternateLabel: "Word",
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,

    categories: ["sports", "food", "fruit"],
    grammar: "I like [word].",
    grammarForm: "like",
    defaults: "tagged"
  };
})();
