/* Flash Cards behaviour: navigation, layout, playback and sizing. */
"use strict";
const assert=require("node:assert/strict"), fs=require("node:fs"), path=require("node:path"), vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const scope={window:{}};
vm.createContext(scope);
vm.runInContext(read("js/activities/flash-cards.js"),scope);
function node(){
  const values=new Set();
  return {hidden:false,dataset:{},attributes:{},textContent:"",
    style:{removeProperty(k){delete this[k]}},
    classList:{add(k){values.add(k)},remove(k){values.delete(k)},contains(k){return values.has(k)},toggle(k,v){if(v)values.add(k);else values.delete(k)}},
    setAttribute(k,v){this.attributes[k]=v},removeAttribute(k){delete this.attributes[k]},
    getBoundingClientRect(){return {width:800,height:600,top:0}}
  };
}
const elements=Object.fromEntries(["missingAnswerHints","guessWordList","shuffleButton","answerArea","gameArea","floatingTimer","autoButton","previousButton","nextButton","gameTitle","displayText","pictureFrame","flashcard","cardPicture","counter","modeLabel","timerValue","timerDownButton","timerUpButton"].map(k=>[k,node()]));
elements.displayText.getBoundingClientRect=()=>({height:100,width:400});
const cards=[{id:"a",word:"apple",visual:{aspectRatio:"2 / 1"}},{id:"b",word:"dog",visual:{aspectRatio:"1 / 2"}},{id:"c",word:"cat",visual:{aspectRatio:"1 / 1"}}];
const state={deck:cards.slice(),position:0,gameMode:"flashcards",displayMode:"pictureText",autoSeconds:3,countdown:3,autoTimer:null,countdownTimer:null};
let nextId=1, intervals=new Map(), frames=[], game;
const document={documentElement:node(),fonts:null};
const window={addEventListener(){},innerHeight:800};
game=scope.window.ALTE_FLASH_CARDS.create({
 state,elements,UNIT_CONFIG:{autoSecondsMinimum:2,autoSecondsMaximum:5},
 currentCard:()=>state.deck[state.position],syncShapePracticeControls(){},applyVisual(el,card){el.cardId=card.id},
 cardText:card=>card.word,renderCardText(el,card){el.textContent=card.word},render(){game.render()},
 shuffled:items=>items.slice(),alignSideNavigation(){},document,window,
 requestAnimationFrame:fn=>frames.push(fn), getComputedStyle:()=>({paddingLeft:"10",paddingRight:"10",paddingTop:"10",paddingBottom:"10",rowGap:"8",display:"block",getPropertyValue:()=>"1"}),
 ResizeObserver:undefined,setInterval(fn,ms){const id=nextId++;intervals.set(id,{fn,ms});return id;},clearInterval:id=>intervals.delete(id)
});
function flush(){while(frames.length)frames.shift()();}
game.render();flush();
assert.equal(elements.displayText.textContent,"apple");
assert.equal(elements.counter.textContent,"1 / 3");
assert.equal(elements.pictureFrame.style.aspectRatio,"2 / 1");
assert.ok(Math.abs(parseInt(elements.pictureFrame.style.width)/parseInt(elements.pictureFrame.style.height)-2)<.02);
game.next();flush();assert.equal(elements.counter.textContent,"2 / 3");
assert.equal(elements.pictureFrame.style.aspectRatio,"1 / 2");
game.previous();game.previous();flush();assert.equal(state.position,2);
game.next();flush();assert.equal(state.position,0);
state.displayMode="text";game.render();flush();assert.equal(elements.flashcard.classList.contains("text-only"),true);assert.equal(elements.pictureFrame.style.width,undefined);
state.displayMode="picture";game.render();flush();assert.equal(elements.flashcard.classList.contains("picture-only"),true);
state.displayMode="pictureText";game.shuffle();flush();assert.equal(state.deck[0].id,"b");assert.equal(state.position,0);
game.changeTimer(-10);assert.equal(state.autoSeconds,2);
game.changeTimer(10);assert.equal(state.autoSeconds,5);
game.toggleAuto();assert.equal(intervals.size,2);assert.equal(elements.timerUpButton.disabled,true);
game.changeTimer(-1);assert.equal(state.autoSeconds,5);
intervals.get(state.countdownTimer).fn();assert.equal(state.countdown,4);
intervals.get(state.autoTimer).fn();flush();assert.equal(state.position,1);
game.stopAuto();assert.equal(intervals.size,0);assert.equal(elements.timerUpButton.disabled,false);assert.equal(state.countdown,5);
state.gameMode="missing";game.toggleAuto();assert.equal(intervals.size,0);
state.gameMode="flashcards";state.deck=[];state.position=0;game.render();assert.equal(elements.counter.textContent,"0 / 0");
game.next();game.previous();assert.equal(state.position,0);
game.bindLayout();
const loader=read("js/unit-loader.js");assert.ok(loader.indexOf('loadScript("js/activities/flash-cards.js")')>=0);assert.ok(loader.indexOf('loadScript("js/activities/flash-cards.js")')<loader.indexOf('loadScript("js/classroom.js")'));
console.log("Flash Cards: navigation, display modes, ratio-safe sizing, shuffle, timer and empty deck passed.");
