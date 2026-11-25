/* Drawing tools: pointer gestures, masks, history and shape recognition. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
let timers=new Map(),nextId=1;
const scope={window:{},setTimeout(fn){const id=nextId++;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id)};
vm.createContext(scope);
vm.runInContext(read("js/activities/drawing-tools.js"),scope);
function node(){
 const classes=new Set();
 return {children:[],style:{},attributes:{},handlers:{},isConnected:true,clientWidth:1000,clientHeight:1000,
 classList:{add(k){classes.add(k)},toggle(k,v){if(v)classes.add(k);else classes.delete(k)}},
 setAttribute(k,v){this.attributes[k]=v},append(...items){this.children.push(...items)},prepend(...items){this.children.unshift(...items)},
 replaceChildren(...items){this.children=items},addEventListener(k,fn){this.handlers[k]=fn},setPointerCapture(){},
 getBoundingClientRect(){return {left:0,top:0,width:1000,height:1000}}};
}
const state={flashBoardInk:[],flashBoardUndo:[],flashBoardRedo:[],flashBoardPenColour:"#e53935"};
const board=node(),document={createElement:node,createElementNS:node};
let tool="draw",eraserMode="part",hit=false;
const drawing=scope.window.ALTE_DRAWING_TOOLS.create({state,board,document,getTool:()=>tool,getEraserMode:()=>eraserMode,onCardHit:()=>hit});
const {undoButton,redoButton}=drawing.createHistoryButtons();
drawing.bind();drawing.updateInkHistoryButtons();
assert.equal(undoButton.disabled,true);
function fire(type,x,y){drawing.drawingSurface.handlers[type]({clientX:x,clientY:y,pointerType:"touch",pointerId:1,button:0,preventDefault(){}})}
fire("pointerdown",100,100);fire("pointermove",200,100);fire("pointerup",200,100);
assert.equal(state.flashBoardInk.length,1);assert.equal(state.flashBoardInk[0].points.length,2);assert.equal(state.flashBoardUndo.length,1);
assert.equal(undoButton.disabled,false);
undoButton.handlers.click();assert.equal(state.flashBoardInk.length,0);assert.equal(redoButton.disabled,false);
redoButton.handlers.click();assert.equal(state.flashBoardInk.length,1);
tool="erase";fire("pointerdown",150,100);fire("pointerup",150,100);
assert.equal(state.flashBoardInk[0].erasures.length,1);
assert.equal(board.children[0].children[0].children[0].attributes.maskUnits,"userSpaceOnUse");
undoButton.handlers.click();assert.equal(state.flashBoardInk[0].erasures.length,0);
eraserMode="whole";fire("pointerdown",150,100);fire("pointerup",150,100);assert.equal(state.flashBoardInk.length,0);
tool="draw";hit=true;fire("pointerdown",100,100);assert.equal(state.flashBoardInk.length,0);
hit=false;fire("pointerdown",100,100);fire("pointermove",150,101);fire("pointermove",200,100);fire("pointermove",250,100);
assert.equal(timers.size,1);for(const [id,fn] of [...timers]){timers.delete(id);fn()}
assert.equal(state.flashBoardInk[0].points.length,2,"hold-to-snap straightens line");
fire("pointerup",250,100);assert.equal(timers.size,0);
drawing.beginInkAction();state.flashBoardInk.length=0;drawing.commitInkAction();drawing.renderInk();assert.equal(state.flashBoardInk.length,0);
undoButton.handlers.click();assert.equal(state.flashBoardInk.length,1);
const loader=read("js/unit-loader.js");
assert.ok(loader.indexOf('loadScript("js/activities/drawing-tools.js")')>=0);
assert.ok(loader.indexOf('loadScript("js/activities/drawing-tools.js")')<loader.indexOf('loadScript("js/activities/flash-board.js")'));
console.log("Drawing tools: strokes, partial masks, whole erase, undo/redo, card hit and shape snap passed.");
