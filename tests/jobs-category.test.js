/* Jobs integration checks; no HTML rendering. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const scope = {
  window: {},
  document: { currentScript: { src: "https://example.invalid/js/vocabulary-data.js" } },
  location: { href: "https://example.invalid/unit.html", search: "?category=jobs" },
  URL, URLSearchParams
};
vm.createContext(scope);
function load(file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), scope, { filename: file });
}
load("js/vocabulary-data.js");
scope.ALTE_DATA = scope.window.ALTE_DATA;
load("js/card-factory.js");
scope.ALTE_CARD_FACTORY = scope.window.ALTE_CARD_FACTORY;
load("config/categories.js");
const db = scope.ALTE_DATA;
const jobs = db.getCategory("jobs");
const expected = [
  [
    "artist",
    "astronaut",
    "baker",
    "bus-driver",
    "carpenter",
    "doctor",
    "game-designer",
    "singer",
    "teacher",
    "zookeeper",
    "comedian",
    "tennis-player"
  ],
  [
    "cartoonist",
    "pilot",
    "pastry-chef",
    "police-officer",
    "farmer",
    "dentist",
    "pro-gamer",
    "musician",
    "nursery-school-teacher",
    "vet",
    "voice-actor",
    "reporter"
  ],
  [
    "designer",
    "flight-attendant",
    "cook",
    "firefighter",
    "florist",
    "nurse",
    "youtuber",
    "pianist",
    "scientist",
    "hairdresser",
    "influencer",
    "writer"
  ]
];
assert.equal(jobs.label, "Jobs");
assert.deepEqual(Array.from(jobs.items, item => item.id), expected.flat());
assert.equal(new Set(jobs.items.map(item => item.id)).size, 36);
assert.ok(jobs.items.every(item => item.defaultIn.length === 0));
assert.equal(db.getCategoryPictureItems("jobs").length, 36);
assert.ok(db.hasCategoryPictures("jobs"));
for (const book of ["book1","book2"]) {
  for (let unit = 1; unit <= 9; unit++) {
    assert.ok(!db.getUnitCategoryIds(book, unit).includes("jobs"));
  }
}
expected.forEach((ids, set) => {
  ids.forEach((id, cell) => {
    const v = db.getWordVisual("jobs", id);
    assert.ok(v.src.endsWith("/images/jobs/jobSet" + (set + 1) + ".webp"), id);
    assert.equal(v.size, "400% 300%", id);
    assert.equal(v.aspectRatio, "1 / 1", id);
    assert.equal(v.position, ["0%","33.333%","66.667%","100%"][cell % 4] + " " + ["0%","50%","100%"][Math.floor(cell / 4)], id);
  });
});
const deck = scope.window.ALTE_UNIT_CONFIG;
assert.equal(deck.unitTitle, "Jobs");
assert.equal(deck.bookId, "categories");
assert.equal(deck.cards.length, 36);
assert.ok(deck.cards.every(card => card.textbook && card.visual.src));
assert.equal(deck.cards.find(card => card.id === "youtuber").word, "YouTuber");
for (let set = 1; set <= 3; set++) {
  const file = path.join(root, "images", "jobs", "jobSet" + set + ".webp");
  assert.ok(fs.existsSync(file), "Missing original Jobs sheet: " + file);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
}
console.log("Jobs: all 36 vocabulary cards, sprite cells, default selections and original sheets verified.");
