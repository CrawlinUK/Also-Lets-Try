/*
  Run with: node tests/vocabulary-data.test.js
  Checks shared vocabulary mappings and the first migrated flashcard decks.
  Does not load, display or render HTML.
*/
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}
function context(search = "") {
  const scope = {
    window: {},
    document: { currentScript: { src: "https://example.invalid/js/lets-try-data.js" } },
    location: { href: "https://example.invalid/unit.html", search },
    URL,
    URLSearchParams
  };
  vm.createContext(scope);
  vm.runInContext(source("js/lets-try-data.js"), scope);
  scope.LETS_TRY_DATA = scope.window.LETS_TRY_DATA;
  vm.runInContext(source("js/lets-try-card-factory.js"), scope);
  scope.LETS_TRY_CARD_FACTORY = scope.window.LETS_TRY_CARD_FACTORY;
  return scope;
}
function config(relativePath, search = "") {
  const scope = context(search);
  vm.runInContext(source(relativePath), scope);
  return scope.window.LETS_TRY_UNIT_CONFIG;
}
function checkDeck(label, cards, expectedCount, expectedSelected) {
  assert.equal(cards.length, expectedCount, label + " card count");
  assert.equal(cards.filter(card => card.textbook).length, expectedSelected, label + " default selections");
  assert.ok(cards.every(card => card.visual && card.word), label + " card content");
}

const db = context().LETS_TRY_DATA;
assert.equal(Object.keys(db.categories).length, 24, "vocabulary category count");
for (const categoryId of [
  "worldGreetings", "feelings", "sports", "food", "fruit", "vegetables",
  "shapes", "animals", "nature", "bodyParts", "describingWords", "weather",
  "clothes", "playActivities", "days", "dailyTimes", "clockTimes", "stationery"
]) {
  for (const item of db.getCategory(categoryId).items) {
    const visual = db.getWordVisual(categoryId, item.id);
    assert.ok(visual?.src, categoryId + "/" + item.id + " shared artwork");
    assert.ok(visual.position, categoryId + "/" + item.id + " image position");
  }
}
assert.match(db.getWordVisual("food", "sausage").src, /fruit\.webp$/);
assert.match(db.getWordVisual("animals", "owl").src, /animals-extra\.webp$/);
assert.match(db.getWordVisual("feelings", "happy").src, /emotions\.webp$/);

for (const [id, total] of [["worldGreetings", 14], ["englishGreetings", 8], ["feelings", 9]]) {
  checkDeck("Categories/" + id,
    config("config/categories.js", "?category=" + id).cards, total, total);
}
checkDeck("LT1 Unit 1", config("config/units/lt1-unit1.js").cards, 14, 9);
checkDeck("LT1 Unit 2", config("config/units/lt1-unit2.js").cards, 9, 6);
checkDeck("LT2 Unit 1", config("config/units/lt2-unit1.js").cards, 14, 11);

const unit4 = config("config/units/lt2-unit4.js");
assert.equal(unit4.cards.length, 22, "LT2 Unit 4 combined card count");
assert.equal(unit4.cards.filter(card => card.category === "clockTimes" && card.textbook).length, 0,
  "LT2 Unit 4 clocks must remain optional");
assert.ok(unit4.cards.every(card => card.visual?.position), "LT2 Unit 4 sprite positions");

console.log("Vocabulary checks passed: 24 categories, artwork mappings, six migrated decks, Unit 4 clocks.");
