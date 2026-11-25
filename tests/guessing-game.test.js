/* Guessing Game behaviour and text layout regressions; no HTML rendering. */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const read = p => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
const scope = {window:{}, Math:Object.create(Math)};
scope.Math.random = () => .9;
vm.createContext(scope);
vm.runInContext(read("js/activities/guessing-game.js"), scope);
function node() {
  const classes = new Set();
  return { children:[], dataset:{}, attributes:{}, handlers:{}, hidden:false, textContent:"",
    classList:{add(k){classes.add(k)},remove(k){classes.delete(k)},contains(k){return classes.has(k)},toggle(k,on){if(on)classes.add(k);else classes.delete(k)}},
    append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items},
    setAttribute(k,v){this.attributes[k]=v},addEventListener(k,fn){this.handlers[k]=fn},
    querySelectorAll(){return this.children}
  };
}
const cards=[{id:"a",word:"tall",category:"adjectives"},{id:"b",word:"high",category:"adjectives"},{id:"c",word:"dog",category:"animals"}];
const state={guessCategoryId:null,guessMode:"showWord",guessDeck:[],guessPosition:0,guessRevealed:false,gameMode:"flashcards"};
const elements=Object.fromEntries(["guessSetup","settingsPanel","scrim","message","guessCategorySection","guessCategoryOptions","guessSetupClose","guessWordList","missingAnswerHints","answerArea","gameArea","floatingTimer","autoButton","previousButton","nextButton","shuffleButton","gameTitle","counter","modeLabel"].map(k=>[k,node()]));
const showMode=node(), hideMode=node();
showMode.dataset.guessMode="showWord"; hideMode.dataset.guessMode="hideWord";
elements.guessSetup.children=[showMode,hideMode];
let categories=["adjectives","animals"], settingsOpened=false, returned=false;
const doc={createElement:node,documentElement:node()};
let game;
game=scope.window.ALTE_GUESSING_GAME.create({
  state,elements,selectedCards:()=>cards,stopAuto(){},closeGameMenu(){},activeCategoryIds:()=>categories,
  openSettings(){settingsOpened=true},data:{getCategory:id=>({label:id})},render(){game.render()},
  syncShapePracticeControls(){},returnToFlashcards(){returned=true},
  applyVisual(pic,card){pic.cardId=card.id},alignSideNavigation(){},document:doc,requestAnimationFrame:fn=>fn()
});
const click=(el,button)=>el.handlers.click({target:{closest:()=>button}});
game.bind(); game.open();
assert.equal(showMode.disabled,true);
click(elements.guessCategoryOptions,elements.guessCategoryOptions.children[0]);
assert.equal(state.guessCategoryId,"adjectives");
assert.equal(showMode.disabled,false);
click(elements.guessSetup,showMode);
assert.equal(state.gameMode,"guess");
assert.equal(elements.guessSetup.hidden,true);
assert.equal(elements.counter.textContent,"1 / 2");
let stage=()=>elements.gameArea.children[0], reveal=()=>stage().children[0];
assert.equal(stage().children[1].textContent,"tall");
assert.equal(reveal().children[0].textContent,"Tap here to show");
reveal().handlers.click();
assert.equal(reveal().children[0].cardId,"a");
assert.equal(reveal().attributes["aria-label"],"Hide picture");
game.next();
assert.equal(elements.counter.textContent,"2 / 2");
assert.equal(state.guessRevealed,false);
game.next();
assert.equal(state.guessPosition,0);
game.random();
assert.equal(state.guessPosition,1);
elements.guessWordList.children[0].children[0].handlers.click();
assert.equal(state.guessPosition,0);
categories=["adjectives"];game.open();
assert.equal(elements.guessCategorySection.hidden,true);
click(elements.guessSetup,hideMode);
assert.equal(stage().children.length,1);
assert.equal(stage().classList.contains("hide-word"),true);
reveal().handlers.click();
assert.equal(reveal().children[0].cardId,"a");
game.reset();game.render();assert.equal(returned,true);
categories=[];game.open();assert.equal(settingsOpened,true);
function readClassroomCss() {
  const entry = fs.readFileSync(path.join(__dirname, "../css/classroom.css"), "utf8");
  return [...entry.matchAll(/@import url\("([^"]+)"\);/g)]
    .map(match => fs.readFileSync(path.join(__dirname, "../css", match[1]), "utf8")).join("\n");
}
const css=readClassroomCss();
assert.match(css,/\.guess-stage\s*\{[^}]*grid-template-rows:\s*minmax\(0, 1fr\) auto;/);
assert.match(css,/\.guess-main-word\s*\{[^}]*padding:\s*\.22em \.08em \.18em;[^}]*overflow:\s*visible;[^}]*line-height:\s*1\.20;/);
assert.match(css,/\.guess-reveal-area \.guess-picture\s*\{[^}]*96cqh/);
const loader=read("js/unit-loader.js");
assert.ok(loader.indexOf('loadScript("js/activities/guessing-game.js")')>=0);
assert.ok(loader.indexOf('loadScript("js/activities/guessing-game.js")')<loader.indexOf('loadScript("js/classroom.js")'));
console.log("Guessing Game: category selection, both modes, reveal, navigation, reset and layout rules passed.");
