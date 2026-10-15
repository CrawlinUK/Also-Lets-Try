/* Category-first flashcard builder.
   Vocabulary and artwork come from LETS_TRY_DATA; units only choose how to use them.
   No UI/DOM rendering occurs in this module. */
(function (global) {
  "use strict";
  const database = global.LETS_TRY_DATA;
  if (!database) throw new Error("Load lets-try-data.js before lets-try-card-factory.js");

  function makeCategoryCards(categoryId, options = {}) {
    const category = database.getCategory(categoryId);
    if (!category) throw new Error("Unknown vocabulary category: " + categoryId);
    const profile = category.card || {};
    const defaults = options.defaults || (
      options.bookId && options.unitNumber != null ? "tagged" : "all"
    );
    if (!["all", "tagged", "none"].includes(defaults)) {
      throw new Error("Unknown default selection mode: " + defaults);
    }
    const unitTag = defaults === "tagged"
      ? database.getUnitKey(options.bookId, options.unitNumber)
      : null;
    const grammar = options.grammar !== undefined ? options.grammar : profile.grammar;
    const alternateField = options.alternateField || profile.alternateField || "word";
    const answerField = options.teacherAnswerField || profile.teacherAnswerField || "word";

    return category.items.map((entry) => {
      const word = entry[profile.wordField] || entry.id.replace(/-/g, " ");
      const sentence = grammar == null
        ? (profile.sentenceField && entry[profile.sentenceField]) || word
        : String(grammar).replace(/\[word\]/g, word);
      const alternate = alternateField === "word" ? word : (entry[alternateField] || word);
      const teacherAnswer = answerField === "word" ? word : (entry[answerField] || word);
      const visual = database.getWordVisual(categoryId, entry.id);
      if (!visual && !profile.textOnly) {
        throw new Error("Missing shared artwork for " + categoryId + "/" + entry.id);
      }
      const selected = defaults === "all" || (
        defaults === "tagged" && (entry.defaultIn || []).includes(unitTag)
      );
      return {
        id: entry.id,
        category: categoryId,
        word,
        sentence,
        alternate,
        optionLabel: word,
        teacherAnswer,
        textbook: selected,
        visual: visual || { type: "text", text: word, aspectRatio: "1 / 1" }
      };
    });
  }

  global.LETS_TRY_CARD_FACTORY = Object.freeze({ makeCategoryCards });
})(window);
