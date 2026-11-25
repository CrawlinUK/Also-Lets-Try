/* Shared presentation and grid layout checks; no HTML rendering. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const scope={window:{},URL};vm.createContext(scope);
for(const name of ["presentation","grid-layout"])vm.runInContext(read("js/shared/"+name+".js"),scope);
function node(){
 const classes=new Set();
 return {children:[],dataset:{},attributes:{},textContent:"",style:{setProperty(k,v){this[k]=v}},
 classList:{add(...k){k.forEach(x=>classes.add(x))},remove(...k){k.forEach(x=>classes.delete(x))},contains:k=>classes.has(k),toggle(k,v){if(v)classes.add(k);else classes.delete(k)}},
 setAttribute(k,v){this.attributes[k]=v},append(...n){this.children.push(...n)},replaceChildren(...n){this.children=n}};
}
const document={createElement:node,createElementNS:node,createTextNode:t=>t,getElementById:()=>null};
const state={displayMode:"pictureText",schoolShortened:false,letterColourMode:"plain",gameMode:"flashcards"};
const presentation=scope.window.ALTE_PRESENTATION.create({state,UNIT_CONFIG:{schoolShortenSetting:true},SHAPE_PRACTICE:null,data:{getAlphabetColour:()=>"#123456"},isShapePracticeCard:()=>false,shapeColourName:()=>"",shapePracticeText:()=>"",document});
const el=node(),card={id:"a",word:"apple",sentence:"It is an apple.",underlineToken:"an",visual:{src:"images/fruit.webp",aspectRatio:"2 / 1",size:"400% 300%",position:"50% 0%",cropTop:5,cropRight:2,flip:true}};
presentation.applyVisual(el,card);
assert.equal(el.style.backgroundImage,'url("images/fruit.webp")');assert.equal(el.style.backgroundSize,"400% 300%");
assert.equal(el.style.backgroundPosition,"50% 0%");assert.equal(el.style.clipPath,"inset(5% 2% 0% 0%)");assert.equal(el.style.transform,"scaleX(-1)");assert.equal(el.style["--visual-ratio"],"2");
state.displayMode="pictureSentence";assert.equal(presentation.cardText(card),"It is an apple.");
presentation.renderCardText(el,card);assert.equal(el.children[1].textContent,"an");assert.equal(el.children[1].className,"phrase-emphasis");
state.displayMode="pictureText";state.letterColourMode="colour";
presentation.applyVisual(el,{word:"A",visual:{type:"text",alphabetLetter:"A",text:"A"}});
assert.equal(el.textContent,"A");assert.equal(el.style.color,"#123456");assert.equal(el.style.clipPath,"none");
presentation.applyVisual(el,{id:"12",word:"twelve",visual:{type:"number-svg",text:"12",digitBase:"https://example.com/images/numbers/"}});
assert.equal(el.children[0].classList.contains("number-svg-run"),true);assert.equal(el.children[0].children.length,2);
assert.equal(el.children[0].children[0].children[0].attributes.href,"https://example.com/images/numbers/1.svg#artwork");
state.schoolShortened=true;assert.equal(presentation.classroomWord({word:"school nurse’s office",category:"schoolPlaces"}),"nurse’s office");
assert.equal(presentation.cardText({word:"school principal’s office",category:"schoolPlaces"}),"principal’s office");
let callback;class Observer{constructor(fn){callback=fn}observe(){}disconnect(){}}
const grid=scope.window.ALTE_GRID_LAYOUT.create({UNIT_CONFIG:{pictureAspectRatio:"1 / 1"},ResizeObserver:Observer,requestAnimationFrame:fn=>fn()});
assert.equal(grid.visualRatio(card),2);assert.equal(grid.visualRatio({visual:{aspectRatio:"bad"}}),1);
assert.equal(grid.optimalGameShape(1000,500,[]).columns,1);
const cards=Array.from({length:5},()=>({visual:{aspectRatio:"1 / 1"}}));
const shape=grid.optimalGameShape(900,600,cards);assert.equal(shape.columns,3);assert.equal(shape.rows,2);
const stage=node();stage.clientWidth=900;stage.clientHeight=600;stage.isConnected=true;stage.children=cards.map(()=>node());
grid.setGridShape(stage,cards);assert.equal(stage.dataset.cardCount,"5");assert.equal(stage.style["--grid-cols"],3);
assert.equal(stage.children[3].style.gridColumn,"2 / span 2");assert.equal(stage.children[4].style.gridColumn,"4 / span 2");
stage.clientWidth=600;stage.clientHeight=900;callback();assert.equal(stage.style["--grid-cols"],2);
const loader=read("js/unit-loader.js");
for(const p of ["js/shared/presentation.js","js/shared/grid-layout.js"]){assert.ok(loader.indexOf('loadScript("'+p+'")')>=0);assert.ok(loader.indexOf('loadScript("'+p+'")')<loader.indexOf('loadScript("js/classroom.js")'));}
console.log("Shared presentation: sprite crops, phrases, alphabet, number SVG and responsive grid checks passed.");
