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

// Standalone Categories come directly from picture mappings in the master
// database. Missing picture entries are hidden, not displayed as placeholders.
const categoryMenuSource = source("categories.html");
const sharedCssSource = source("css/lets-try.css");
assert.match(categoryMenuSource, /data\.getCategoryPictureItems\(id\)/,
  "menu lists only categories with picture cards");
assert.match(categoryMenuSource, /if \(!pictureItems\.length\) return;/,
  "categories with no pictures are hidden");
assert.match(categoryMenuSource, /pictureItems\.slice\(0,3\)/,
  "menu previews the first three mapped picture words");
assert.doesNotMatch(categoryMenuSource, /const supported\s*=|category-unavailable/,
  "no manual allowlist or crossed-out placeholders remain");
assert.match(categoryMenuSource, /samples\.scrollWidth<=samples\.clientWidth/,
  "whole sample words fit the available width");
const standaloneLoaderSource = source("config/categories.js");
assert.match(standaloneLoaderSource, /data\.hasCategoryPictures\(id\)/,
  "standalone category loader uses the central picture mapping");
assert.match(standaloneLoaderSource, /onlyWithPictures: true/,
  "standalone decks exclude unfinished picture entries");
assert.doesNotMatch(standaloneLoaderSource, /const supported\s*=|isCategoryReady/,
  "standalone loader has no subjective readiness switch");
assert.match(standaloneLoaderSource, /cards\.find\(card => card\.visual\?\.src\)\?\.visual\?\.aspectRatio/,
  "decks inherit global image proportions");
assert.match(sharedCssSource, /data-book="categories"\] \.site-title \.unit-word/,
  "hide Unit label only for Categories");
assert.match(sharedCssSource, /data-book="categories"\] \.site-title \.unit-number/,
  "hide unit number only for Categories");

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
const visiblePictureCategories = Object.keys(db.categories)
  .filter(id => db.hasCategoryPictures(id));
assert.equal(visiblePictureCategories.length, 19,
  "all nineteen picture categories appear, without a ready flag");
assert.deepEqual(visiblePictureCategories, [
  "worldGreetings", "feelings", "sports", "food", "fruit",
  "vegetables", "shapes", "animals", "nature", "bodyParts",
  "describingWords", "weather", "clothes", "playActivities",
  "days", "dailyTimes", "clockTimes", "stationery", "schoolPlaces"
], "all mapped categories appear in database order");
assert.ok(Object.values(db.categories).every(cat => !Object.hasOwn(cat, "ready")),
  "no subjective ready fields remain in the master");
assert.equal(db.hasCategoryPictures("doesNotExist"), false, "unknown categories are hidden");
assert.equal(db.hasCategoryPictures("englishGreetings"), false,
  "text-only Greetings are excluded from the picture-only menu");
assert.equal(db.hasCategoryPictures("numbers"), false, "unmapped Numbers are hidden");
assert.equal(db.getCategoryPictureItems("schoolPlaces").length, 16,
  "all sixteen school places are mapped from the new 4×4 sprite sheet");
const roomPositions = {
  entrance: "0% 0%", "music-room": "33.333% 0%",
  classroom: "66.667% 0%", "arts-and-crafts-room": "100% 0%",
  restroom: "0% 33.333%", "cooking-room": "33.333% 33.333%",
  "lunch-room": "66.667% 33.333%", "computer-room": "100% 33.333%",
  playground: "0% 66.667%", library: "33.333% 66.667%",
  "science-room": "66.667% 66.667%", "school-principals-office": "100% 66.667%",
  gym: "0% 100%", "teachers-office": "33.333% 100%",
  "school-office": "66.667% 100%", "school-nurses-office": "100% 100%"
};
for (const [id, position] of Object.entries(roomPositions)) {
  const visual = db.getWordVisual("schoolPlaces", id);
  assert.ok(visual.src.includes("schoolRooms.webp"), id + " uses schoolRooms.webp");
  assert.equal(visual.size, "400% 400%", id + " has 4×4 sprite size");
  assert.equal(visual.aspectRatio, "1 / 1", id + " is square");
  assert.equal(visual.position, position, id + " is in the correct physical cell");
}
assert.equal(db.getItem("schoolPlaces","school-principals-office").word,
  "school principal’s office", "master stores correctly punctuated office name");
assert.equal(db.getItem("schoolPlaces","school-nurses-office").word,
  "school nurse’s office", "master stores the nurse's office name");

assert.throws(() => config("config/categories.js", "?category=numbers"),
  /no mapped picture cards/, "URLs cannot open decks with no mapped pictures");
for (const id of visiblePictureCategories) {
  const total = db.getCategoryPictureItems(id).length;
  checkDeck("Standalone/" + id,
    config("config/categories.js", "?category=" + id).cards, total, total);
}
// Simulate a partly drawn sheet: one existing picture plus an unfinished word.
// The complete word remains in the master, but isn't sent to the standalone deck.
const partial = context("?category=nature");
partial.LETS_TRY_DATA.categories.nature.items.push({
  id: "not-yet-illustrated", defaultIn: [], word: "not yet illustrated"
});
assert.equal(partial.LETS_TRY_DATA.getCategory("nature").items.length, 2);
assert.equal(partial.LETS_TRY_DATA.getCategoryPictureItems("nature").length, 1);
assert.equal(partial.LETS_TRY_DATA.hasCategoryPictures("nature"), true,
  "one mapped picture is enough to expose a category");
vm.runInContext(source("config/categories.js"), partial);
checkDeck("Partially pictured Nature",
  partial.window.LETS_TRY_UNIT_CONFIG.cards, 1, 1);
const unfiltered = partial.LETS_TRY_CARD_FACTORY.makeCategoryCards("nature",
  { defaults: "all", onlyWithPictures: true });
assert.equal(unfiltered.length, 1,
  "factory can select only pictured cards without changing master data");

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



// Standalone Shapes must use EXACTLY the same shared number/colour controls
// and original seven artworks as Let's Try! 1 Unit 7.
const standaloneShapes = config("config/categories.js", "?category=shapes");
const bookOneShapes = config("config/units/lt1-unit7.js");
checkDeck("Standalone Shapes", standaloneShapes.cards, 7, 7);
checkDeck("LT1 Unit 7 Shapes", bookOneShapes.cards, 7, 7);
assert.equal(JSON.stringify(standaloneShapes.shapePractice),
  JSON.stringify(db.categories.shapes.shapePractice),
  "standalone Shapes uses master practice settings");
assert.equal(bookOneShapes.shapePractice.counts.join(","), "1,2,3,4,5",
  "Book 1 Unit 7 still offers 1–5 shapes");
assert.equal(JSON.stringify(standaloneShapes.shapePractice),
  JSON.stringify(bookOneShapes.shapePractice),
  "both Shapes decks use identical number and colour settings");
assert.equal(standaloneShapes.showPictureSentenceMode, false,
  "standalone Shapes does not add a redundant phrase option");
for (let i = 0; i < standaloneShapes.cards.length; i++) {
  const a = standaloneShapes.cards[i];
  const b = bookOneShapes.cards[i];
  assert.equal(a.id, b.id, "same shape card order");
  assert.equal(a.visual.type, "shape-svg", "standalone shape supports recolouring and counting");
  assert.equal(a.visual.shapeId, b.visual.shapeId, "same shape identifier");
  assert.equal(a.visual.src, b.visual.src, "same original artwork");
  assert.equal(a.visual.defaultColourName, b.visual.defaultColourName,
    "same default shape colour");
}
assert.match(source("js/lets-try-unit.js"), /"shape-practice-mode", Boolean\(SHAPE_PRACTICE\)/,
  "shared renderer activates layout by practice configuration");
assert.match(sharedCssSource, /html\.shared-unit-template\.shape-practice-mode \.answer-area/,
  "palette side padding is shared by unit and category pages");
assert.doesNotMatch(sharedCssSource,
  /html\.shared-unit-template\[data-unit="7"\] \.answer-area/,
  "shape layout is not accidentally applied to unrelated Unit 7 pages");

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
checkDeck("LT2 Unit 8 with School Rooms artwork", lt2Unit8.cards, 16, 16);
assert.ok(lt2Unit8.cards.every(card => card.visual.src?.includes("schoolRooms.webp")),
  "all sixteen Unit 8 cards use the global School Rooms sheet");
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

console.log("Vocabulary checks passed: 19 mapped picture categories including 16 school rooms, partial decks, textbook units and phrase settings.");
