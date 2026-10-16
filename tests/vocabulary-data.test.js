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
  const configuration = scope.window.LETS_TRY_UNIT_CONFIG;
  if (!Array.isArray(configuration.cards) && Array.isArray(configuration.categories)) {
    configuration.cards = scope.LETS_TRY_CARD_FACTORY.makeCardsForCategories(configuration.categories, {
      bookId: configuration.bookId,
      unitNumber: configuration.unitNumber,
      defaults: configuration.defaults || "tagged",
      grammar: configuration.grammar,
      grammarForm: configuration.grammarForm
    });
  }
  return configuration;
}
function checkDeck(label, cards, expectedCount, expectedSelected) {
  assert.equal(cards.length, expectedCount, label + " card count");
  assert.equal(cards.filter(card => card.textbook).length, expectedSelected, label + " default selections");
  assert.ok(cards.every(card => card.visual && card.word), label + " card content");
}

// The viewer must retain its metadata helper. When this function was
// accidentally deleted, the first card click threw and no images appeared.
// Standalone Categories show category names, sample words and honest unavailable tiles.
const categoryMenuSource = source("categories.html");
const sharedCssSource = source("css/lets-try.css");
assert.match(categoryMenuSource, /definition\.items\.slice\(0,3\)/, "category tiles use first three shared words");
assert.match(categoryMenuSource, /samples\.scrollWidth<=samples\.clientWidth/, "whole words fit available width");
assert.match(categoryMenuSource, /category-unavailable::after/, "unavailable tiles have diagonal stroke");
assert.doesNotMatch(categoryMenuSource, /Open flashcards|Page coming soon/, "no placeholder status text");
assert.match(sharedCssSource, /data-book="categories"\] \.site-title \.unit-word/, "hide Unit label only for Categories");
assert.match(sharedCssSource, /data-book="categories"\] \.site-title \.unit-number/, "hide unit number only for Categories");

const viewerSource = source("vocabulary-viewer.html");
assert.match(viewerSource, /function row\(label,value\)/,
  "viewer metadata helper required before artwork can render");
assert.match(viewerSource, /db\.getWordVisual\(category,id\)/,
  "viewer uses shared artwork mapping");
assert.match(viewerSource, /cellAspectRatio/,
  "viewer reads canonical sprite cell proportions");
assert.match(viewerSource, /function exportChanges\(\)/,
  "viewer can export local proposed mapping changes");
assert.match(viewerSource, /id="positionX"/,
  "viewer includes image calibration controls");
assert.match(viewerSource, /id="scaleNumber"/, "viewer has a single proportional scaling control");
assert.match(viewerSource, /function splitSize\(size\)/, "viewer derives scale from original sprite proportions");
assert.doesNotMatch(viewerSource, /id="sizeX"/, "viewer must not independently stretch sprite width");
assert.doesNotMatch(viewerSource, /id="sizeY"/, "viewer must not independently stretch sprite height");
for (const side of ["Top","Right","Bottom","Left"]) {
  assert.match(viewerSource, new RegExp('id="crop' + side + '"'), "viewer crop " + side);
}
assert.match(viewerSource, /data-nudge="up"/, "viewer has position nudge arrows");
assert.match(viewerSource, /data-jump-tool="position"/, "viewer jumps to controls above image");
assert.match(viewerSource, /id="calibration" hidden/,
  "image adjustment controls start hidden");
assert.match(viewerSource, /function toggleTool\(which\)/,
  "bottom buttons act as show/hide switches");
assert.match(viewerSource, /function hideTool\(scrollToPicture=false\)/,
  "image controls can collapse without changing drafts");
assert.match(viewerSource, /id="closeTool"/, "Done hides editor controls");
assert.doesNotMatch(viewerSource, /class="tool-tabs"/,
  "duplicated top tabs must not occupy picture space");

assert.match(source("js/lets-try-unit.js"), /const cropEdges = \["cropTop", "cropRight", "cropBottom", "cropLeft"\]/,
  "classroom renderer handles all four crop edges");



const db = context().LETS_TRY_DATA;
for (const [sheet,ratio] of [
  ["flags","4 / 3"], ["emotions","2 / 3"],
  ["sports","9 / 8"], ["bodyParts","1 / 2"],
  ["stationery","1 / 1"], ["fruit","1 / 1"]
]) {
  assert.equal(db.assets.sheets[sheet].cellAspectRatio,ratio, sheet + " cell proportions");
}

const untouchedVisual = db.getWordVisual("worldGreetings", "finland");
for (const side of ["cropTop","cropRight","cropBottom","cropLeft"]) {
  assert.equal(untouchedVisual[side] || 0, 0, "global default " + side);
}

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
const stationeryCells = {
  pencil: "0% 0%", eraser: "33.333% 0%", "pencil-case": "66.667% 0%", ruler: "100% 0%",
  "glue-stick": "0% 50%", pen: "33.333% 50%", notebook: "66.667% 50%", calendar: "100% 50%",
  stapler: "0% 100%", "pencil-sharpener": "33.333% 100%", marker: "66.667% 100%", magnet: "100% 100%"
};
for (const [id, position] of Object.entries(stationeryCells)) {
  assert.equal(db.getWordVisual("stationery", id)?.position, position, "stationery/" + id + " sheet position");
}


for (const [id, total] of [["worldGreetings", 14], ["englishGreetings", 8], ["feelings", 9], ["sports", 12], ["food", 16], ["fruit", 11]]) {
  checkDeck("Categories/" + id,
    config("config/categories.js", "?category=" + id).cards, total, total);
}
checkDeck("LT1 Unit 1", config("config/units/lt1-unit1.js").cards, 14, 9);
checkDeck("LT1 Unit 2", config("config/units/lt1-unit2.js").cards, 9, 6);
checkDeck("LT2 Unit 1", config("config/units/lt2-unit1.js").cards, 14, 11);

const unit5 = config("config/units/lt1-unit5.js");
checkDeck("LT1 Unit 5", unit5.cards, 39, 21);
assert.equal(unit5.categories.join(","), "sports,food,fruit", "LT1 Unit 5 categories");
assert.equal(unit5.grammar, "I like [word].", "LT1 Unit 5 grammar");
for (const [id, sentence] of [
  ["hamburger", "I like hamburgers."],
  ["sausage", "I like sausages."],
  ["strawberry", "I like strawberries."],
  ["noodle", "I like noodles."]
]) {
  assert.equal(unit5.cards.find(card => card.id === id).sentence, sentence, id + " grammar form");
}
assert.equal(unit5.cards.find(card => card.id === "noodle").word, "noodles");
assert.match(unit5.cards.find(card => card.id === "sausage").visual.src, /fruit\.webp$/);
assert.ok(unit5.cards.every(card => card.visual?.position), "LT1 Unit 5 image positions");

// LT2 Unit 2 must not show an empty screen when only Weather is selected
// while the former phrase mode was Let's. Exercise the actual shared rebuildDeck.
const weatherUnit = config("config/units/lt2-unit2.js");
checkDeck("LT2 Unit 2", weatherUnit.cards, 16, 16);
assert.equal(weatherUnit.phraseSwitch, undefined,
  "LT2 Unit 2 no longer adds a footer phrase switch");
assert.deepEqual(Array.from(weatherUnit.displayModes),
  ["pictureText","picture","pictureIts","pictureLets","text"],
  "LT2 Unit 2 has two distinct phrase options in Settings");
const classroomSource = source("js/lets-try-unit.js");
assert.match(classroomSource, /value="pictureIts"/,
  "It's phrase choice is in Settings");
assert.match(classroomSource, /value="pictureLets"/,
  "Let's phrase choice is in Settings");
assert.match(classroomSource, /function fitFlashcardText\(\)/,
  "shared classroom text must fit the available width");
// The text itself must NEVER be a ResizeObserver target: shrinking it
// would trigger the callback again and make it pulse indefinitely.
assert.doesNotMatch(classroomSource,
  /artLayoutObserver\.observe\(elements\.displayText\)/,
  "do not observe the element being resized");
assert.doesNotMatch(classroomSource, /lastTextFitKey/,
  "do not cache a width measurement made before layout or fonts settle");
assert.match(classroomSource, /textMeasure\.getBoundingClientRect\(\)\.width/,
  "measure unclipped text in an independent natural-size node");
assert.match(classroomSource, /elements\.flashcard\.append\(textMeasure\)/,
  "hidden text measurement is outside the answer-area flex layout");
assert.doesNotMatch(classroomSource, /elements\.answerArea\.append\(textMeasure\)/,
  "never add measuring text as an answer-area flex child");
assert.match(classroomSource, /position: "fixed"/,
  "measurement never consumes stage layout space");
assert.match(classroomSource, /document\.fonts\.addEventListener\("loadingdone"/,
  "refit after handwriting font finishes loading");
assert.match(classroomSource, /if \(artworkFitScheduled\) return;/,
  "refit requests should be coalesced into one animation frame");
assert.match(classroomSource, /const oneLineFits =/,
  "choose a single-line fit when room allows");
assert.match(classroomSource, /Math\.max\(minimum, Math\.min\(widthFit, heightFit\)\)/,
  "text fitting accounts for both stage width and available height");
assert.match(classroomSource, /dimensions\.height - verticalPadding - textHeight - gap - 24/,
  "picture must reserve space for the complete sentence and padding");
assert.match(sharedCssSource, /white-space: normal;[\s\S]*?overflow-wrap: anywhere;/,
  "long phrases must wrap rather than clip while awaiting refit");

// All category selections must count, regardless of which sentence display
// is selected. The two phrase settings only change displayed text.
const phraseSelected = new Set(weatherUnit.cards.map(c => c.id));
const selectionCount = () => weatherUnit.cards.filter(c => phraseSelected.has(c.id)).length;
assert.equal(selectionCount(),16,"LT2 Unit 2 initially has 16 cards");
for (const category of ["playActivities","clothes"])
  weatherUnit.cards.filter(c => c.category === category).forEach(c => phraseSelected.delete(c.id));
assert.equal(selectionCount(),6,"Weather only shows six cards");
weatherUnit.cards.filter(c => c.category === "playActivities").forEach(c => phraseSelected.add(c.id));
assert.equal(selectionCount(),10,"Weather plus Play Activities shows ten cards");
weatherUnit.cards.filter(c => c.category === "clothes").forEach(c => phraseSelected.add(c.id));
assert.equal(selectionCount(),16,"Selecting Clothes restores all sixteen cards");

const lt2Unit4 = config("config/units/lt2-unit4.js");
assert.ok(lt2Unit4.cards.every(card => card.sentence.startsWith("It’s ")),
  "LT2 Unit 4 cards use It's sentences");
assert.equal(lt2Unit4.displayModeLabels.pictureSentence,"Picture + It’s",
  "LT2 Unit 4 phrase setting");
const lt2Unit8 = config("config/units/lt2-unit8.js");
assert.equal(lt2Unit8.schoolShortenSetting,true,"LT2 Unit 8 offers optional school shortening");
assert.ok(lt2Unit8.cards.some(c => c.word==="school principal’s office"),
  "LT2 Unit 8 master office names remain intact");
assert.match(classroomSource,/schoolShortenButton/,
  "Unit 8 school-shortening button exists");
const lt2Unit9 = config("config/units/lt2-unit9.js");
assert.ok(lt2Unit9.cards.every(card => card.sentence==="I "+card.word+"."),
  "LT2 Unit 9 has I ~. sentences");
assert.equal(lt2Unit9.displayModeLabels.pictureSentence,"Picture + I ~.",
  "LT2 Unit 9 phrase mode enabled");
const lt1Unit2 = config("config/units/lt1-unit2.js");
assert.equal(lt1Unit2.displayModeLabels.pictureSentence,"Picture + I’m",
  "LT1 Unit 2 describes its I'm phrase");
const lt1Unit8 = config("config/units/lt1-unit8.js");
assert.ok(lt1Unit8.cards.every(card => !card.underlineToken),
  "LT1 Unit 8 has no stray underline mark on an");

assert.doesNotMatch(sharedCssSource, /html\.shared-unit-template\[data-unit="2"\]/,
  "portrait size overrides cannot accidentally affect both books");
assert.match(sharedCssSource, /\[data-book="lt1"\]\[data-unit="2"\]/,
  "feelings portrait overrides apply only to LT1 Unit 2");
for (const [category,id,ratio] of [
  ["worldGreetings","china","4 / 3"],
  ["feelings","happy","2 / 3"],
  ["sports","baseball","9 / 8"],
  ["bodyParts",db.getCategory("bodyParts").items[0].id,"1 / 2"]
]) {
  assert.equal(db.getWordVisual(category,id)?.aspectRatio,ratio,
    category + " cards inherit canonical aspect ratio");
}

const unit4 = config("config/units/lt2-unit4.js");
assert.equal(unit4.cards.length, 22, "LT2 Unit 4 combined card count");
assert.equal(unit4.cards.filter(card => card.category === "clockTimes" && card.textbook).length, 0,
  "LT2 Unit 4 clocks must remain optional");
assert.ok(unit4.cards.every(card => card.visual?.position), "LT2 Unit 4 sprite positions");

console.log("Vocabulary checks passed: 24 categories, shared ratios, unit phrase settings, Unit 2 selections, and prior decks.");
