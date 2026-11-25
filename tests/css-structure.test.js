/* Validate stylesheet imports and preserved cascade boundaries. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..","css");
const read=name=>fs.readFileSync(path.join(root,name),"utf8");
const imports=source=>[...source.matchAll(/@import url\("([^"]+)"\);/g)].map(m=>m[1]);
const order=imports(read("classroom.css"));
assert.deepEqual(order,["theme.css","classroom-base.css","classroom-unit-layout.css","classroom-app-shell.css","classroom-flashcards.css","classroom-generated-visuals.css","classroom-fullscreen.css","classroom-game-menu.css","classroom-settings.css","classroom-number-visuals.css","classroom-guessing-game.css","classroom-responsive.css","classroom-shape-practice.css","classroom-final-controls.css","classroom-unit-overrides.css","classroom-grid-games.css","classroom-flash-board.css","classroom-drawing-tools.css","classroom-board-bin.css","classroom-board-text-tools.css","classroom-lights.css"]);
assert.equal(new Set(order).size,order.length);
for(const file of order){const source=read(file);assert.ok(source.trim().length>0,file);assert.equal(imports(source).length,0,file+" should not nest imports");}
assert.equal(imports(read("menu.css"))[0],"theme.css");
for(const token of ["ink","muted","surface","page","line","soft","shadow"])assert.match(read("theme.css"),new RegExp("--"+token+":"));
console.log("CSS imports, shared tokens and cascade order passed.");
