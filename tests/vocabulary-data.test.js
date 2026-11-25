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
    document: { currentScript: { src: "https://example.invalid/js/vocabulary-data.js" } },
    location: { href: "https://example.invalid/unit.html", search },
    URL,
    URLSearchParams
  };
  vm.createContext(scope);
  vm.runInContext(source("js/vocabulary-data.js"), scope);
  scope.ALTE_DATA = scope.window.ALTE_DATA;
  vm.runInContext(source("js/card-factory.js"), scope);
  scope.ALTE_CARD_FACTORY = scope.window.ALTE_CARD_FACTORY;
  return scope;
}
function config(relativePath, search = "") {
  const scope = context(search);
  vm.runInContext(source(relativePath), scope);
  const configuration = scope.window.ALTE_UNIT_CONFIG;
  if (!Array.isArray(configuration.cards) && Array.isArray(configuration.categories)) {
    configuration.cards = scope.ALTE_CARD_FACTORY.makeCardsForCategories(configuration.categories, {
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
function readClassroomCss() {
  const entry = fs.readFileSync(path.join(__dirname, "../css/classroom.css"), "utf8");
  return [...entry.matchAll(/@import url\("([^"]+)"\);/g)]
    .map(match => fs.readFileSync(path.join(__dirname, "../css", match[1]), "utf8")).join("\n");
}
const sharedCssSource = readClassroomCss();
assert.match(categoryMenuSource, /data\.getCategoryPictureItems\(id\)/,
  "menu lists only categories with picture cards");
assert.match(categoryMenuSource, /if \(!pictureItems\.length\) return;/,
  "categories with no pictures are hidden");
assert.match(categoryMenuSource, /pictureItems\.slice\(0,3\)/,
  "menu previews the first three mapped picture words");
assert.doesNotMatch(categoryMenuSource, /const supported\s*=|category-unavailable/,
  "no manual allowlist or crossed-out placeholders remain");
// The category menu now uses CSS ellipsis rather than JavaScript width measurement.
assert.match(categoryMenuSource, /\.word-samples\s*\{[^}]*white-space:\s*nowrap[^}]*overflow:\s*hidden[^}]*text-overflow:\s*ellipsis/,
  "sample text is clipped with an ellipsis within the category card");
assert.match(categoryMenuSource, /samples\.textContent\s*=\s*words\.join\(", "\)/,
  "category samples contain the first three words");
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

assert.doesNotMatch(source("js/classroom.js") + source("js/shared/presentation.js"), /imageDiagnostic|imageDiagnosis|image-diagnostic|data-diagnostic/i,
  "classroom must not expose developer image diagnosis controls");
assert.doesNotMatch(sharedCssSource, /image-diagnostic|data-diagnostic/i,
  "remove obsolete classroom diagnosis styling");

const viewerSource = source("vocabulary-viewer.html");
assert.match(viewerSource, /function row\(\s*\w+\s*,\s*\w+\s*\)/,
  "viewer metadata helper required before artwork can render");
assert.match(viewerSource, /db\.getWordVisual\(\s*categoryId\s*,\s*itemId\s*\)/,
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

assert.match(source("js/shared/presentation.js"), /const cropEdges = \["cropTop", "cropRight", "cropBottom", "cropLeft"\]/,
  "classroom renderer handles all four crop edges");



const db = context().ALTE_DATA;
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

assert.equal(Object.keys(db.categories).length, 25, "vocabulary category count");
const visiblePictureCategories = Object.keys(db.categories)
  .filter(id => db.hasCategoryPictures(id));
assert.equal(visiblePictureCategories.length, 21,
  "all twenty-one picture categories appear, without a ready flag");
assert.deepEqual(visiblePictureCategories, [
  "worldGreetings", "feelings", "sports", "food", "fruit",
  "vegetables", "shapes", "animals", "nature", "bodyParts",
  "describingWords", "weather", "clothes", "playActivities",
  "days", "dailyTimes", "clockTimes", "stationery", "schoolPlaces", "dailyRoutine", "jobs"
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
partial.ALTE_DATA.categories.nature.items.push({
  id: "not-yet-illustrated", defaultIn: [], word: "not yet illustrated"
});
assert.equal(partial.ALTE_DATA.getCategory("nature").items.length, 2);
assert.equal(partial.ALTE_DATA.getCategoryPictureItems("nature").length, 1);
assert.equal(partial.ALTE_DATA.hasCategoryPictures("nature"), true,
  "one mapped picture is enough to expose a category");
vm.runInContext(source("config/categories.js"), partial);
checkDeck("Partially pictured Nature",
  partial.window.ALTE_UNIT_CONFIG.cards, 1, 1);
const unfiltered = partial.ALTE_CARD_FACTORY.makeCategoryCards("nature",
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
// and original seven artworks as Book 1 Unit 7.
const standaloneShapes = config("config/categories.js", "?category=shapes");
const bookOneShapes = config("config/units/book1-unit7.js");
checkDeck("Standalone Shapes", standaloneShapes.cards, 7, 7);
checkDeck("Book 1 Unit 7 Shapes", bookOneShapes.cards, 7, 7);
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
assert.match(source("js/classroom.js"), /"shape-practice-mode", Boolean\(SHAPE_PRACTICE\)/,
  "shared renderer activates layout by practice configuration");
assert.match(sharedCssSource, /html\.shared-unit-template\.shape-practice-mode \.answer-area/,
  "palette side padding is shared by unit and category pages");
assert.doesNotMatch(sharedCssSource,
  /html\.shared-unit-template\[data-unit="7"\] \.answer-area/,
  "shape layout is not accidentally applied to unrelated Unit 7 pages");

checkDeck("Book 1 Unit 1", config("config/units/book1-unit1.js").cards, 14, 9);
checkDeck("Book 1 Unit 2", config("config/units/book1-unit2.js").cards, 9, 6);
checkDeck("Book 2 Unit 1", config("config/units/book2-unit1.js").cards, 14, 11);

const unit5 = config("config/units/book1-unit5.js");
checkDeck("Book 1 Unit 5", unit5.cards, 39, 21);
assert.equal(unit5.categories.join(","), "sports,food,fruit", "Book 1 Unit 5 categories");
assert.equal(unit5.grammar, "I like [word].", "Book 1 Unit 5 grammar");
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
assert.ok(unit5.cards.every(card => card.visual?.position), "Book 1 Unit 5 image positions");

// Book 2 Unit 2 must not show an empty screen when only Weather is selected
// while the former phrase mode was Let's. Exercise the actual shared rebuildDeck.
const weatherUnit = config("config/units/book2-unit2.js");
checkDeck("Book 2 Unit 2", weatherUnit.cards, 16, 16);
assert.equal(weatherUnit.phraseSwitch, undefined,
  "Book 2 Unit 2 no longer adds a footer phrase switch");
assert.deepEqual(Array.from(weatherUnit.displayModes),
  ["pictureText","picture","pictureIts","pictureLets","text"],
  "Book 2 Unit 2 has two distinct phrase options in Settings");
const classroomSource = source("js/classroom.js");
assert.match(classroomSource, /value="pictureIts"/,
  "It's phrase choice is in Settings");
assert.match(classroomSource, /value="pictureLets"/,
  "Let's phrase choice is in Settings");
const flashCardsSource = source("js/activities/flash-cards.js");
assert.match(flashCardsSource, /function fitFlashcardText\(\)/,
  "shared classroom text must fit the available width");
// The text itself must NEVER be a ResizeObserver target: shrinking it
// would trigger the callback again and make it pulse indefinitely.
assert.doesNotMatch(flashCardsSource,
  /artLayoutObserver\.observe\(elements\.displayText\)/,
  "do not observe the element being resized");
assert.doesNotMatch(flashCardsSource, /lastTextFitKey/,
  "do not cache a width measurement made before layout or fonts settle");
// Typography now uses fluid CSS instead of a hidden JavaScript measuring node.
assert.match(sharedCssSource, /--display-size:\s*clamp\(/,
  "responsive display typography uses a viewport-aware size");
assert.match(flashCardsSource, /text\.style\.removeProperty\("font-size"\)/,
  "remove stale JavaScript font sizing");
assert.match(flashCardsSource, /text\.style\.removeProperty\("white-space"\)/,
  "CSS owns wrapping");
assert.match(flashCardsSource, /document\.fonts\.addEventListener\("loadingdone"/,
  "refit after handwriting font finishes loading");
assert.match(flashCardsSource, /if \(artworkFitScheduled\) return;/,
  "refit requests should be coalesced into one animation frame");
assert.match(flashCardsSource, /requestAnimationFrame\(\(\) => \{\s*artworkFitScheduled = false;\s*fitFlashcardArtwork\(\);/,
  "verify the text again on the next layout frame without requiring window resize");
assert.match(flashCardsSource, /Math\.min\(availableWidth, availableHeight \* ratio\)/,
  "artwork fits both available dimensions while preserving proportions");
assert.match(flashCardsSource, /dimensions\.height - verticalPadding - textHeight - gap - 24/,
  "picture must reserve space for the complete sentence and padding");
assert.match(sharedCssSource, /white-space: normal;[\s\S]*?overflow-wrap: anywhere;/,
  "long phrases must wrap rather than clip while awaiting refit");

// All category selections must count, regardless of which sentence display
// is selected. The two phrase settings only change displayed text.
const phraseSelected = new Set(weatherUnit.cards.map(c => c.id));
const selectionCount = () => weatherUnit.cards.filter(c => phraseSelected.has(c.id)).length;
assert.equal(selectionCount(),16,"Book 2 Unit 2 initially has 16 cards");
for (const category of ["playActivities","clothes"])
  weatherUnit.cards.filter(c => c.category === category).forEach(c => phraseSelected.delete(c.id));
assert.equal(selectionCount(),6,"Weather only shows six cards");
weatherUnit.cards.filter(c => c.category === "playActivities").forEach(c => phraseSelected.add(c.id));
assert.equal(selectionCount(),10,"Weather plus Play Activities shows ten cards");
weatherUnit.cards.filter(c => c.category === "clothes").forEach(c => phraseSelected.add(c.id));
assert.equal(selectionCount(),16,"Selecting Clothes restores all sixteen cards");

const book2Unit4 = config("config/units/book2-unit4.js");
assert.ok(book2Unit4.cards.every(card => card.sentence.startsWith("It’s ")),
  "Book 2 Unit 4 cards use It's sentences");
assert.equal(book2Unit4.displayModeLabels.pictureSentence,"Picture + It’s",
  "Book 2 Unit 4 phrase setting");
const book2Unit8 = config("config/units/book2-unit8.js");
checkDeck("Book 2 Unit 8 with School Rooms artwork", book2Unit8.cards, 16, 14);
assert.ok(book2Unit8.cards.every(card => card.visual.src?.includes("schoolRooms.webp")),
  "all sixteen Unit 8 cards use the global School Rooms sheet");
for (const id of ["restroom","entrance"]) {
  const card = book2Unit8.cards.find(entry => entry.id === id);
  assert.ok(card, id + " remains available as a Unit 8 card");
  assert.equal(card.textbook, false, id + " starts unselected in Unit 8");
}
assert.equal(config("config/categories.js","?category=schoolPlaces")
  .cards.filter(card => card.textbook).length,16,
  "standalone School Places still defaults to all sixteen pictures");
assert.equal(book2Unit8.schoolShortenSetting,true,"Book 2 Unit 8 offers optional school shortening");
assert.ok(book2Unit8.cards.some(c => c.word==="school principal’s office"),
  "Book 2 Unit 8 master office names remain intact");
assert.match(classroomSource,/schoolShortenButton/,
  "Unit 8 school-shortening button exists");
const book2Unit9 = config("config/units/book2-unit9.js");
assert.ok(book2Unit9.cards.every(card => card.sentence==="I "+card.word+"."),
  "Book 2 Unit 9 has I ~. sentences");
assert.equal(book2Unit9.displayModeLabels.pictureSentence,"Picture + I ~.",
  "Book 2 Unit 9 phrase mode enabled");
const book1Unit2 = config("config/units/book1-unit2.js");
assert.equal(book1Unit2.displayModeLabels.pictureSentence,"Picture + I’m",
  "Book 1 Unit 2 describes its I'm phrase");
const book1Unit8 = config("config/units/book1-unit8.js");
assert.ok(book1Unit8.cards.every(card => !card.underlineToken),
  "Book 1 Unit 8 has no stray underline mark on an");

assert.doesNotMatch(sharedCssSource, /html\.shared-unit-template\[data-unit="2"\]/,
  "portrait size overrides cannot accidentally affect both books");
assert.match(sharedCssSource, /\[data-book="book1"\]\[data-unit="2"\]/,
  "feelings portrait overrides apply only to Book 1 Unit 2");
for (const [category,id,ratio] of [
  ["worldGreetings","china","4 / 3"],
  ["feelings","happy","2 / 3"],
  ["sports","baseball","9 / 8"],
  ["bodyParts",db.getCategory("bodyParts").items[0].id,"1 / 2"]
]) {
  assert.equal(db.getWordVisual(category,id)?.aspectRatio,ratio,
    category + " cards inherit canonical aspect ratio");
}

const unit4 = config("config/units/book2-unit4.js");
assert.equal(unit4.cards.length, 22, "Book 2 Unit 4 combined card count");
assert.equal(unit4.cards.filter(card => card.category === "clockTimes" && card.textbook).length, 0,
  "Book 2 Unit 4 clocks must remain optional");
assert.ok(unit4.cards.every(card => card.visual?.position), "Book 2 Unit 4 sprite positions");

console.log("Vocabulary checks passed: 21 mapped picture categories including Jobs and 16 school rooms, partial decks, textbook units and phrase settings.");

// Compatibility and new navigation checks for the ALT-e naming migration.
const loaderSource = source("js/unit-loader.js");
assert.match(loaderSource, /lt1: "book1", lt2: "book2"/, "old bookmarked unit IDs remain accepted");
for (const n of [1, 2]) {
  assert.ok(fs.existsSync(path.join(root, "book-" + n + ".html")), "new book menu exists");
  assert.match(source("lets_try_" + n + ".html"), new RegExp("book-" + n + "\\.html"), "old menu redirects to new menu");
  for (let unit = 1; unit <= 9; unit++) {
    assert.ok(fs.existsSync(path.join(root, "config/units/book" + n + "-unit" + unit + ".js")), "renamed unit config exists");
  }
}
assert.match(source("js/settings.js"), /LEGACY_PREFERENCES_KEY/, "saved teacher preferences remain readable");
