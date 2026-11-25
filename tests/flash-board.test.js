/* Flash Board extraction checks: order gestures and lifecycle, without rendering HTML. */
"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const read = p => fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const source = read("js/activities/flash-board.js");
const scope = {window:{}};
vm.createContext(scope);
vm.runInContext(source,scope);
const api = scope.window.ALTE_FLASH_BOARD;
let now = 1000, nextId = 1, tasks = new Map(), calls = [], click;
api.bindOrderButton({addEventListener(type,fn){assert.equal(type,"click");click=fn;}}, value=>calls.push(value), {
  now:()=>now, setTimer(fn,ms){const id=nextId++; tasks.set(id,{fn,at:now+ms});return id;},
  clearTimer:id=>tasks.delete(id)
});
function advance(ms) {
  now += ms;
  for (const [id,task] of [...tasks]) if(task.at<=now){tasks.delete(id);task.fn();}
}
click({detail:1}); advance(339); assert.deepEqual(calls,[]);
advance(1); assert.deepEqual(calls,[false],"single-click aligns without sorting");
click({detail:1}); advance(100); click({detail:2}); assert.deepEqual(calls,[false,true]);
advance(500); assert.deepEqual(calls,[false,true],"double-click cancels pending tidy");
click({detail:1}); advance(200); click({detail:1}); advance(500);
assert.deepEqual(calls,[false,true,true],"two quick touchscreen taps sort once");
click({detail:1}); advance(340); click({detail:1}); advance(340);
assert.deepEqual(calls,[false,true,true,false,false],"separate taps tidy separately");
const state={flashBoardPositions:new Map([["a",{}]]),flashBoardBinned:new Set(["a"]),flashBoardLayers:new Map([["a",2]]),flashBoardLayerCounter:2,flashBoardInk:[{colour:"red"}],flashBoardTexts:[{text:"hello"}]};
const removed=[];
const board=api.create({state,document:{getElementById:id=>({remove:()=>removed.push(id)})}});
board.prepare();assert.equal(state.flashBoardPositions.size,0);assert.equal(state.flashBoardBinned.size,0);assert.equal(state.flashBoardLayers.size,0);assert.equal(state.flashBoardLayerCounter,0);
assert.equal(state.flashBoardInk.length,1);assert.equal(state.flashBoardTexts.length,1);
board.cleanup();assert.deepEqual(removed,["flashBoardTools","flashBoardBin"]);
const loader=read("js/unit-loader.js");assert.ok(loader.indexOf('loadScript("js/activities/flash-board.js")')>=0);assert.ok(loader.indexOf('loadScript("js/activities/flash-board.js")')<loader.indexOf('loadScript("js/classroom.js")'));
assert.match(source,/bindOrderButton\(orderButton, arrangeBoardRows\)/);
assert.match(source,/arrangeBoardRows/);assert.match(source,/flashBoardInk/);assert.match(source,/flashBoardBinned/);assert.match(source,/flashBoardPluralCards/);
console.log("Flash Board: single/double-click order, touch timing, prepare, cleanup and loader checks passed.");
