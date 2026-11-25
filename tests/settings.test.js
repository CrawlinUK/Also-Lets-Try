/* Settings behaviour and saved-preference compatibility (no HTML rendering). */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8"), scope={window:{}};
vm.createContext(scope);vm.runInContext(read("js/settings.js"),scope);
const api=scope.window.ALTE_SETTINGS;
const store=new Map([["alsoLetsTry.teacherPreferences.v1",JSON.stringify({sizeBalance:72,missingAnswerSize:19})]]);
const window={localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)}};
assert.equal(api.readTeacherPreferences(window).sizeBalance,72);
assert.equal(api.readTeacherPreferences(window).missingAnswerSize,19);
store.set("alte.teacherPreferences.v1",JSON.stringify({sizeBalance:105,missingAnswerSize:2}));
assert.equal(api.readTeacherPreferences(window).sizeBalance,100);
assert.equal(api.readTeacherPreferences(window).missingAnswerSize,8);
store.set("alte.teacherPreferences.v1","invalid");assert.equal(api.readTeacherPreferences(window).sizeBalance,50);
assert.equal(api.readTeacherPreferences({get localStorage(){throw Error("blocked")}}).missingAnswerSize,10);
store.delete("alte.teacherPreferences.v1");
function node(){
 const classes=new Set();
 return {children:[],dataset:{},attributes:{},handlers:{},hidden:false,textContent:"",style:{setProperty(k,v){this[k]=v}},
 classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k),toggle(k,v){if(v)classes.add(k);else classes.delete(k)}},
 setAttribute(k,v){this.attributes[k]=v},removeAttribute(k){delete this.attributes[k]},
 append(...n){this.children.push(...n)},replaceChildren(...n){this.children=n.flatMap(x=>x.fragment?x.children:[x])},addEventListener(k,fn){this.handlers[k]=fn},
 querySelectorAll(selector){const field=selector==="[data-category]"?"category":"cardId";const found=[];function walk(el){if(el.dataset[field])found.push(el);el.children.forEach(walk)};walk(this);return found;}
 };
}
const cards=[{id:"a",category:"animals",word:"dog"},{id:"b",category:"animals",word:"cat"},{id:"c",category:"food",word:"apple"}];
const state={selectedIds:new Set(["a"]),displayMode:"pictureText",sizeBalance:72,missingAnswerSize:19,gameMode:"flashcards"};
const elements=Object.fromEntries(["settingsPreview","settingsPreviewPicture","settingsPreviewText","message","cardOptionGrid","selectAllButton","resetButton","settingsPanel","scrim","sizeBalanceRange","missingAnswerSizeRange","missingAnswerSizeValue","schoolShortenButton","shapeNumberToggle","shapeColourToggle"].map(k=>[k,node()]));
const pictureRadio=node(),textRadio=node(),plainRadio=node();pictureRadio.value="pictureText";textRadio.value="text";plainRadio.value="plain";
const doc={documentElement:node(),createElement:node,createDocumentFragment(){const f=node();f.fragment=true;return f},querySelectorAll:s=>s.includes("letterColourMode")?[plainRadio]:[pictureRadio,textRadio],querySelector:s=>s.includes("letterColourMode")?plainRadio:pictureRadio};
let rebuilds=0,renders=0,stops=0;
const selectedCards=()=>cards.filter(c=>state.selectedIds.has(c.id));
const settings=api.create({state,elements,UNIT_CONFIG:{cards,autoSeconds:4,defaultDisplayMode:"pictureText"},UNIT_CATEGORY_IDS:["animals","food"],initialIds:["a"],SHAPE_PRACTICE:null,data:{getCategory:id=>({label:id})},currentCard:()=>selectedCards()[0],selectedCards,applyVisual(el,c){el.cardId=c.id},renderCardText(el,c){el.textContent=c.word},buildGameMenu(){},rebuildDeck(){rebuilds++},stopAuto(){stops++},syncShapePracticeControls(){},render(){renders++},document:doc,window});
settings.buildCardOptions();settings.bind();
const categories=elements.cardOptionGrid.querySelectorAll("[data-category]");
const words=elements.cardOptionGrid.querySelectorAll("[data-card-id]");
assert.equal(categories[0].attributes["aria-pressed"],"mixed");assert.equal(words[0].attributes["aria-pressed"],"true");
categories[0].handlers.click();assert.equal(state.selectedIds.size,2);assert.equal(categories[0].attributes["aria-pressed"],"true");
categories[0].handlers.click();assert.equal(state.selectedIds.size,0);assert.equal(categories[0].attributes["aria-pressed"],"false");
words[2].handlers.click();assert.equal(state.selectedIds.has("c"),true);
elements.selectAllButton.handlers.click();assert.equal(state.selectedIds.size,3);assert.equal(elements.selectAllButton.textContent,"Clear all");
elements.selectAllButton.handlers.click();assert.equal(state.selectedIds.size,0);
elements.resetButton.handlers.click();assert.equal(state.selectedIds.size,1);assert.equal(state.selectedIds.has("a"),true);assert.equal(state.sizeBalance,72);
textRadio.handlers.change();assert.equal(state.displayMode,"text");settings.updatePreview();assert.equal(elements.settingsPreviewPicture.hidden,true);assert.equal(elements.settingsPreviewText.textContent,"dog");
elements.sizeBalanceRange.value="61";elements.sizeBalanceRange.handlers.input();elements.missingAnswerSizeRange.value="17";elements.missingAnswerSizeRange.handlers.input();
assert.deepEqual(JSON.parse(store.get("alte.teacherPreferences.v1")),{sizeBalance:61,missingAnswerSize:17});
assert.equal(doc.documentElement.style["--missing-answer-size"],"17px");
settings.open();assert.equal(elements.settingsPanel.classList.contains("open"),true);settings.close();assert.equal(elements.settingsPanel.classList.contains("open"),false);
assert.ok(rebuilds>=6);assert.ok(renders>=2);assert.ok(stops>=2);
const loader=read("js/unit-loader.js");assert.ok(loader.indexOf('loadScript("js/settings.js")')>=0);assert.ok(loader.indexOf('loadScript("js/settings.js")')<loader.indexOf('loadScript("js/classroom.js")'));
console.log("Settings: category selection, reset, display mode, saved preferences and panel controls passed.");
