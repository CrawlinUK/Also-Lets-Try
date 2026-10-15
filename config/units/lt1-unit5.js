/* LT1 Unit 5 — category-driven configuration; vocabulary and artwork are shared. */
(function () {
  "use strict";

  window.LETS_TRY_UNIT_CONFIG = {
    bookId: "lt1",
    unitNumber: "5",
    unitTitle: "What do you like?",
    browserTitle: "Let’s Try! Tools — What do you like?",

    unitColour: "#00ADA9",
    unitNumberColour: "#52C8C4",
    menuFile: "lets_try_1.html",

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
