/* Theme preference, toggle labels and cross-tab synchronisation. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const store=new Map(),events={},header={children:[],querySelector(){return this.children[0]},append(b){this.children.push(b)}};
const panel={...header,children:[],insertBefore(b){this.children.unshift(b)},lastElementChild:{}};
const root={dataset:{}};
function makeButton(){return {attrs:{},handlers:{},label:{},setAttribute(k,v){this.attrs[k]=v},querySelector(){return this.label},addEventListener(k,fn){this.handlers[k]=fn}}}
const document={documentElement:root,readyState:"complete",querySelector:s=>s===".site-header-inner"?header:s===".settings-heading"?panel:null,querySelectorAll:()=>[...header.children,...panel.children],createElement:makeButton};
const window={localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},addEventListener:(k,fn)=>events[k]=fn};
const scope={window,document};vm.createContext(scope);vm.runInContext(read("js/theme.js"),scope);
assert.equal(root.dataset.theme,"light");assert.equal(header.children[0].label.textContent,"Lights Off");
header.children[0].handlers.click();assert.equal(root.dataset.theme,"dark");assert.equal(store.get("alte.theme.v1"),"dark");assert.equal(panel.children[0].attrs["aria-pressed"],"true");assert.equal(panel.children[0].label.textContent,"Lights On");
window.ALTE_THEME.mount();assert.equal(header.children.length,1);assert.equal(panel.children.length,1);
panel.children[0].handlers.click();assert.equal(root.dataset.theme,"light");
store.set("alte.theme.v1","dark");events.storage({key:"alte.theme.v1"});assert.equal(root.dataset.theme,"dark");
for(const p of ["index.html","book-1.html","book-2.html","categories.html","unit.html","games/index.html"])assert.match(read(p),/js\/theme\.js/);
assert.match(read("css/theme.css"),/html\[data-theme="dark"\]/);
assert.match(read("css/classroom-lights.css"),/\.flash-board \{ background:#f7faf8;/);
console.log("Lights Off: default, toggle, persistence, duplicate prevention and cross-tab changes passed.");
