/* Grid Games behaviour checks (no browser or external dependencies). */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const scope = { window: {}, Math: Object.create(Math) };
scope.Math.random = () => 0;
vm.createContext(scope);
vm.runInContext(fs.readFileSync(path.join(root, "js/activities/grid-games.js"), "utf8"), scope);

function node() {
  return { children: [], textContent: "", dataset: {}, hidden: false, attributes: {}, handlers: {},
    classList: { values: new Set(), toggle(key, value) { if (value) this.values.add(key); else this.values.delete(key); } },
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; },
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(event, callback) { this.handlers[event] = callback; }
  };
}
const cards = [{id:"a",word:"apple"},{id:"b",word:"banana",teacherAnswer:"bananas"},{id:"c",word:"cat"}];
const state = { gameMode:"missing", missingOrder:[], hiddenMissingIds:new Set(), keywordOrder:[], keywordSelectedIds:new Set() };
const elements = Object.fromEntries(["gameTitle","nextButton","gameArea","missingAnswerHints","counter","modeLabel","shuffleButton"].map(key => [key,node()]));
let renders = 0, lastGrid = null;
const { missing: game, keyword } = scope.window.ALTE_GRID_GAMES.create({
  state, elements, selectedCards:() => cards,
  showGridGameLayout() { renders++; },
  applyVisual(picture, card) { picture.cardId = card.id; },
  setGridShape(grid) { lastGrid = grid; }, alignSideNavigation() {},
  shuffled(items) { return items.slice(); },
  document:{createElement:node}, requestAnimationFrame:callback => callback()
});
game.start();
assert.equal(state.missingOrder.join(","),"a,b,c");
assert.equal(state.hiddenMissingIds.size,1);
assert.equal(elements.counter.textContent,"2 / 3");
assert.equal(elements.missingAnswerHints.children[0].textContent,"elppa1");
assert.equal(lastGrid.children.length,3);
lastGrid.children[0].handlers.click();
assert.equal(state.hiddenMissingIds.size,0);
assert.equal(elements.missingAnswerHints.hidden,true);
game.hideOneMore();
game.hideOneMore();
assert.equal(state.hiddenMissingIds.size,2);
assert.equal(elements.counter.textContent,"1 / 3");
assert.equal(elements.missingAnswerHints.children[1].textContent,"sananab2");
game.randomise();
assert.equal(state.missingOrder.join(","),"b,a,c","randomise changes order even if shuffle returns the same sequence");
assert.equal(state.hiddenMissingIds.size,2);
game.hideOneMore();
const count = renders;
game.hideOneMore();
assert.equal(renders,count,"hiding stops when all cards are covered");
assert.equal(elements.counter.textContent,"0 / 3");
game.reset();
assert.equal(state.missingOrder.length,0);
assert.equal(state.hiddenMissingIds.size,0);
const loader = fs.readFileSync(path.join(root,"js/unit-loader.js"),"utf8");
assert.ok(loader.indexOf('loadScript("js/activities/grid-games.js")') >= 0);
assert.ok(loader.indexOf('loadScript("js/activities/grid-games.js")') < loader.indexOf('loadScript("js/classroom.js")'));
console.log("Missing Game: start, hide, reveal, hints, randomise, reset and module load order passed.");

state.gameMode = "keyword";
keyword.prepare();
keyword.render();
assert.equal(elements.nextButton.textContent,"PICK");
assert.equal(elements.nextButton.dataset.gameAction,"pick");
assert.equal(elements.counter.textContent,"0 / 3");
assert.equal(elements.missingAnswerHints.hidden,true);
assert.equal(lastGrid.className,"game-grid");
assert.equal(lastGrid.children.length,3);
assert.equal(lastGrid.children[0].children[0].attributes["aria-label"],"apple");
lastGrid.children[1].handlers.click();
assert.equal(elements.counter.textContent,"1 / 3");
assert.equal(lastGrid.children[1].classList.values.has("selected"),true);
lastGrid.children[2].handlers.click();
assert.equal(elements.counter.textContent,"2 / 3");
keyword.selectRandomKeyword();
assert.equal(elements.counter.textContent,"1 / 3");
assert.equal(state.keywordSelectedIds.has("a"),true);
assert.equal(state.keywordSelectedIds.size,1);
keyword.randomise();
assert.equal(state.keywordOrder.join(","),"b,a,c");
assert.equal(lastGrid.children[1].classList.values.has("selected"),true);
assert.equal(state.hiddenMissingIds.size,0,"keyword selection does not alter Missing Game");
keyword.reset();
assert.equal(state.keywordOrder.length,0);
assert.equal(state.keywordSelectedIds.size,0);
keyword.selectRandomKeyword();
assert.equal(state.keywordSelectedIds.size,0,"empty deck pick is safe");
state.gameMode = "missing";
game.start();
assert.equal(lastGrid.children[0].classList.values.has("covered"),true);
assert.equal(lastGrid.children[0].classList.values.has("selected"),false);
assert.equal(elements.nextButton.textContent,"HIDE +");
assert.equal(elements.counter.textContent,"2 / 3");
assert.equal(state.keywordSelectedIds.size,0,"Missing Game does not alter keyword selections");
console.log("Keyword Game: selection, pick, randomise, reset, shared grid and independent game states passed.");
