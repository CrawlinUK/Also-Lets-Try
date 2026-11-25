/* Flash Board — free placement, card manipulation and board tools.
   The original rendering and drawing logic is kept together in this extraction. */
(function (global) {
  "use strict";

  // Delay single-click alignment so a double-click never runs both actions.
  function bindOrderButton(orderButton, arrangeBoardRows, { now = () => Date.now(), setTimer = setTimeout, clearTimer = clearTimeout } = {}) {
    // Do not run a single-click tidy before a double-click. That first
    // tidy previously changed the row layout used by the second action.
    let orderClickTimer=null;
    let lastOrderTap=0;
    orderButton.addEventListener("click",event=>{
      const timestamp=now();
      const isDouble=event.detail>=2 || (lastOrderTap>0 && timestamp-lastOrderTap<340);
      if(orderClickTimer!==null){
        clearTimer(orderClickTimer);
        orderClickTimer=null;
      }
      if(isDouble){
        lastOrderTap=0;
        arrangeBoardRows(true);
      }else{
        lastOrderTap=timestamp;
        orderClickTimer=setTimer(()=>{
          orderClickTimer=null;
          lastOrderTap=0;
          arrangeBoardRows(false);
        },340);
      }
    });
  }

  function create({ state, elements, selectedCards, showGridGameLayout, applyVisual, visualRatio, optimalGameShape, alignSideNavigation, document, window, requestAnimationFrame }) {
    // Free placement is deliberately independent of Missing/Keyword ordering.
    function renderFlashBoard() {
      showGridGameLayout();
      elements.missingAnswerHints.hidden = true;
      elements.gameTitle.textContent = "Flash Board";
      elements.nextButton.hidden = true;
      elements.shuffleButton.textContent = "Reset layout";

      const cards = selectedCards();
      const pluralCards = state.flashBoardPluralCards;
      // S is a board-wide display toggle, not a tool for individual cards.
      // Only explicitly eligible noun categories and known count nouns change.
      const irregularPlurals = {
        mouse:"mice",goose:"geese",child:"children",person:"people",
        man:"men",woman:"women",foot:"feet",tooth:"teeth",
        sheep:"sheep",deer:"deer",fish:"fish",ox:"oxen",
        leaf:"leaves",knife:"knives",wolf:"wolves",life:"lives",
        tomato:"tomatoes",potato:"potatoes"
      };
      const nonCountWords = new Set([
        "milk","water","juice","orange juice","tea","coffee","rice",
        "bread","cheese","butter","meat","beef","pork","chicken",
        "fish","sushi","spaghetti","pizza","homework","information",
        "music","soccer","baseball","basketball","tennis","swimming",
        "table tennis","volleyball","dodgeball","ice cream"
      ]);
      const nounCategories = new Set([
        "fruit","food","animals","animal","vegetables","shapes",
        "schoolSupplies","stationery","schoolItems","classroomObjects","jobs"
      ]);
      const pluralEligible = card => {
        const word=String(card.word||"").trim().toLowerCase();
        const category=String(card.category||"");
        return nounCategories.has(category) && /^[a-z][a-z -]*$/.test(word)
          && !nonCountWords.has(word);
      };
      const pluralForm = word => {
        const parts=word.split(" ");
        if(parts.length>1)return parts.slice(0,-1).join(" ")+" "+pluralForm(parts[parts.length-1]);
        const key=word.toLowerCase();
        if (irregularPlurals[key])return irregularPlurals[key];
        if (/[^aeiou]y$/i.test(word))return word.slice(0,-1)+"ies";
        if (/(ch|sh|x|z|s)$/i.test(word))return word+"es";
        if (/(?:knife|wife|life)$/i.test(word))return word.slice(0,-2)+"ves";
        return word+"s";
      };
      const cardLabel = card => pluralCards.has(card.id) && pluralEligible(card)
        ? pluralForm(card.word) : (card.word||"");
      const board = document.createElement("div");
      board.className = "flash-board";
      board.classList.toggle("labels-hidden", !state.flashBoardLabelsVisible);
      board.setAttribute("aria-label", "Freely arrange selected flash cards");
      board.addEventListener("contextmenu", event => event.preventDefault());
      board.addEventListener("selectstart", event => event.preventDefault());
      const positions = state.flashBoardPositions;
      const layers = state.flashBoardLayers;
      const bringToFront = (tile, id) => {
        const layer = ++state.flashBoardLayerCounter;
        layers.set(id, layer);
        tile.style.zIndex = String(layer);
      };
      const count = cards.length;
      state.flashBoardLayerCounter = Math.max(state.flashBoardLayerCounter, count);
      // Share Missing/Keyword's responsive, card-aspect-aware grid logic.
      // The shape is resolved from the real board dimensions below.
      let columns = 1;
      let rows = count || 1;
      let cellWidth = 100;
      let cellHeight = 100 / rows;
      const textOnly = state.displayMode === "text";
      const hasCardCaptions = !textOnly && state.displayMode !== "picture";
      const visualSize = (card) => {
        const cardWidth = Math.min(75, Math.min(38, cellWidth * .94) * state.flashBoardCardScale);
        const cardHeight = Math.min(80, Math.min(48, cellHeight * .93) * state.flashBoardCardScale);
        const ratio = visualRatio(card);
        // Always measure the actual board, never a guessed viewport ratio.
        const boardRatio = board.clientWidth / board.clientHeight;
        const maxWidth = cardWidth;
        const maxHeight = cardHeight;
        const heightFromWidth = maxWidth * boardRatio / ratio;
        return heightFromWidth <= maxHeight
          ? { width: maxWidth, height: heightFromWidth }
          : { width: maxHeight * ratio / boardRatio, height: maxHeight };
      };
      const entries = [];
      let selectedEntry = null;
      let bin, binList, removeButton;
      let removalMode = false;
      let textToolButton, suffixButton, selectedTextId = null, textDraft = null;
      let renderTexts = () => {};
      const binned = state.flashBoardBinned;
      const within = (element,x,y) => {
        const r=element.getBoundingClientRect();
        return x>=r.left && x<=r.right && y>=r.top && y<=r.bottom;
      };
      const updateSelection = () => {
        entries.forEach(entry => entry.tile.classList.remove("selected"));
        entries.forEach(entry => entry.tile.classList.toggle("removal-target", removalMode && !binned.has(entry.card.id)));
        if (textToolButton) textToolButton.classList.toggle("active", currentTool === "text");
        if (removeButton) {
          removeButton.classList.toggle("active", removalMode);
          removeButton.setAttribute("aria-pressed", String(removalMode));
        }
      };
      const updateCounter = () => { elements.counter.textContent = (count-binned.size)+" / "+count; };
      let renderBin = () => {};
      const sendToBin = entry => {
        if (binned.has(entry.card.id)) return;
        entry.binSize={width:entry.tile.offsetWidth || entry.binSize?.width || 160,height:entry.tile.offsetHeight || entry.binSize?.height || 200};
        binned.add(entry.card.id);
        entry.tile.hidden=true;
        if (selectedEntry===entry) selectedEntry=null;
        updateSelection(); renderBin(); updateCounter();
      };
      const restoreCard = (entry,x,y) => {
        binned.delete(entry.card.id);
        entry.tile.hidden=false;
        entry.last=place(entry.tile,{
          x:(x-board.getBoundingClientRect().left)/board.clientWidth*100-dimensions(entry.tile).width/2,
          y:(y-board.getBoundingClientRect().top)/board.clientHeight*100-dimensions(entry.tile).height/2
        });
        positions.set(entry.card.id,entry.last);
        bringToFront(entry.tile,entry.card.id);
        selectedEntry=null;
        updateSelection(); renderBin(); updateCounter();
      };
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      const dimensions = (tile) => {
        const width = board.clientWidth || 1;
        const height = board.clientHeight || 1;
        return {
          width: tile.offsetWidth / width * 100,
          height: tile.offsetHeight / height * 100
        };
      };
      const place = (tile, position) => {
        const size = dimensions(tile);
        const safe = {
          x: clamp(position.x, 0, Math.max(0, 100 - size.width)),
          y: clamp(position.y, 0, Math.max(0, 100 - size.height))
        };
        tile.style.left = safe.x + "%";
        tile.style.top = safe.y + "%";
        return safe;
      };

      cards.forEach((card, index) => {
        const tile = document.createElement("div");
        tile.className = "flash-board-card";
        if (textOnly) tile.classList.add("word-only");
        tile.tabIndex = 0;
        tile.setAttribute("role", "group");
        tile.setAttribute("aria-label", card.word || "Flash card");
        if (!textOnly) tile.classList.add("visual-card");
        const flagSprite = !textOnly && card.category === "worldGreetings"
          && String(card.visual?.src || "").includes("flags.svg");
        if (flagSprite) tile.classList.add("flag-sprite-card");
        if (card.visual?.type === "text") tile.classList.add("letter-visual-card");
        tile.style.zIndex = String(layers.get(card.id) || index + 1);
        const word = document.createElement("span");
        word.className = "flash-board-word";
        word.textContent = cardLabel(card);
        if (textOnly) {
          tile.append(word);
        } else {
          const media = document.createElement("div");
          media.className = "flash-board-media";
          const picture = document.createElement("div");
          picture.className = "flash-board-picture game-picture";
          applyVisual(picture, card);
          media.append(picture);
          if (state.displayMode !== "picture") {
            const caption = document.createElement("span");
            caption.className = "flash-board-caption";
            caption.textContent = cardLabel(card);
            media.append(caption);
          }
          tile.append(media);
        }
        const saved = positions.get(card.id);
        const entry = { card, tile, index, saved, last: null };
        entries.push(entry);
        board.append(tile);

        tile.addEventListener("focus", () => { bringToFront(tile, card.id); selectedEntry=entry; updateSelection(); });
        tile.addEventListener("pointerdown", (event) => {
          if (event.button !== 0 && event.pointerType === "mouse") return;
          event.preventDefault();
          if (removalMode) { sendToBin(entry); return; }

          bringToFront(tile, card.id);
          const rect = board.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const original = { ...entry.last };
          const startPosition = {x:event.clientX,y:event.clientY};
          const startX = event.clientX;
          const startY = event.clientY;
          tile.setPointerCapture(event.pointerId);
          tile.classList.add("dragging");
          const move = (e) => {
            const next = {
              x: original.x + (e.clientX - startX) / rect.width * 100,
              y: original.y + (e.clientY - startY) / rect.height * 100
            };
            entry.last = place(tile, next);
          };
          const cleanup = () => {
            tile.removeEventListener("pointermove", move);
            tile.removeEventListener("pointerup", finish);
            tile.removeEventListener("pointercancel", cancel);
            tile.classList.remove("dragging");
          };
          const finish = (e) => {
            move(e);
            cleanup();
            if (bin && (within(bin,e.clientX,e.clientY) ||
                (e.clientX < board.getBoundingClientRect().left && e.clientY >= bin.getBoundingClientRect().top))) {
              entry.last=place(tile,original);
              positions.set(card.id,entry.last);
              sendToBin(entry);
            } else {
              positions.set(card.id,entry.last);
              if (Math.hypot(e.clientX-startPosition.x,e.clientY-startPosition.y)<9) {
                selectedEntry=entry; updateSelection();
              }
            }
          };
          const cancel = () => {
            cleanup();
            entry.last = place(tile, original);
            positions.set(card.id, entry.last);
          };
          tile.addEventListener("pointermove", move);
          tile.addEventListener("pointerup", finish);
          tile.addEventListener("pointercancel", cancel);
        });
        tile.addEventListener("keydown", (event) => {
          const steps = { ArrowLeft: [-2,0], ArrowRight: [2,0], ArrowUp: [0,-2], ArrowDown: [0,2] };
          if (!steps[event.key]) return;
          event.preventDefault();
          bringToFront(tile, card.id);
          const [dx,dy] = steps[event.key];
          entry.last = place(tile, { x: entry.last.x + dx, y: entry.last.y + dy });
          positions.set(card.id, entry.last);
        });
      });

      elements.gameArea.replaceChildren(board);
      document.getElementById("flashBoardBin")?.remove();
      bin=document.createElement("aside");
      bin.id="flashBoardBin";
      bin.className="flash-board-bin";
      bin.classList.toggle("labels-hidden", !state.flashBoardLabelsVisible);
      bin.setAttribute("aria-label","Card bin");
      const binHeading=document.createElement("div");
      binHeading.className="flash-board-bin-heading";
      binHeading.textContent="Bin";
      binList=document.createElement("div");
      binList.className="flash-board-bin-list";
      bin.append(binHeading,binList);
      document.body.append(bin);
      const alignBin=()=>{
        if(!board.isConnected || !bin.isConnected)return;
        const rect=board.getBoundingClientRect();
        // Leave the top-left Back navigation unobstructed.
        const back=document.getElementById("menuButton");
        const backBottom=back ? back.getBoundingClientRect().bottom : rect.top+64;
        const top=Math.round(Math.max(rect.top+6,backBottom+12));
        bin.style.top=top+"px";
        bin.style.height=Math.max(120,Math.round(rect.bottom-top))+"px";
        bin.style.bottom="auto";
      };
      alignBin();
      requestAnimationFrame(alignBin);
      const binObserver=new ResizeObserver(alignBin);
      binObserver.observe(board);
      bin.addEventListener("contextmenu",e=>e.preventDefault());
      bin.addEventListener("selectstart",e=>e.preventDefault());
      renderBin=() => {
        binList.replaceChildren();
        const stored=entries.filter(entry=>binned.has(entry.card.id));
        const available=Math.max(120,binList.clientHeight || board.clientHeight);
        const previewHeight=100;
        const step=stored.length>1 ? Math.max(8,Math.min(previewHeight*.5,(available-previewHeight)/(stored.length-1))) : 0;
        stored.forEach((entry,i)=>{
          const item=document.createElement("button");
          item.type="button";
          item.className="flash-board-bin-item";
          item.style.top=(i*step)+"px";
          item.style.zIndex=String(i+1);
          item.title=entry.card.word+" — hold and drag to restore";
          item.setAttribute("aria-label","Restore "+entry.card.word);
          item.addEventListener("contextmenu",e=>e.preventDefault());
          item.addEventListener("selectstart",e=>e.preventDefault());
          const preview=entry.tile.cloneNode(true);
          preview.addEventListener("contextmenu",e=>e.preventDefault());
          preview.removeAttribute("tabindex");
          preview.removeAttribute("role");
          preview.classList.remove("selected","dragging","removal-target");
          preview.hidden=false;
          const previewLabel=preview.querySelector(".flash-board-caption, .flash-board-word");
          if (previewLabel) previewLabel.textContent=cardLabel(entry.card);
          const width=entry.binSize?.width || entry.tile.offsetWidth || 160;
          const height=entry.binSize?.height || entry.tile.offsetHeight || 200;
          preview.style.left="0";preview.style.top="0";
          preview.style.width=width+"px";preview.style.height=height+"px";
          preview.style.aspectRatio="auto";
          const scale=Math.min(64/width,previewHeight/height);
          preview.style.transform="scale("+scale+")";
          preview.style.transformOrigin="top left";
          item.append(preview);
          item.addEventListener("pointerdown",event=>{
            if(event.pointerType==="mouse" && event.button!==0)return;
            event.preventDefault();
            item.setPointerCapture(event.pointerId);
            let ghost=null;
            let held=false;
            const createGhost=()=>{
              if(ghost)return;
              held=true;
              ghost=entry.tile.cloneNode(true);
              ghost.hidden=false;
              ghost.classList.add("flash-board-return-ghost");
              ghost.classList.remove("selected","removal-target");
              item.classList.add("being-dragged");
              ghost.style.width=width+"px";
              ghost.style.height=height+"px";
              ghost.style.aspectRatio="auto";
              ghost.style.left="0";ghost.style.top="0";
              document.body.append(ghost);
            };
            const moveGhost=e=>{
              if(!ghost)return;
              ghost.style.transform="translate("+(e.clientX-width/2)+"px,"+(e.clientY-height/2)+"px)";
            };
            const timer=setTimeout(()=>{createGhost();moveGhost(event)},240);
            const move=e=>{if(held)moveGhost(e);};
            const end=e=>{
              clearTimeout(timer);
              item.removeEventListener("pointermove",move);
              item.removeEventListener("pointerup",end);
              item.removeEventListener("pointercancel",end);
              ghost?.remove();
              item.classList.remove("being-dragged");
              if(held && e.type==="pointerup" && within(board,e.clientX,e.clientY)) restoreCard(entry,e.clientX,e.clientY);
            };
            item.addEventListener("pointermove",move);
            item.addEventListener("pointerup",end);
            item.addEventListener("pointercancel",end);
          });
          // Keyboard alternative to long-press dragging.
          item.addEventListener("keydown",event=>{
            if(event.key!=="Enter" && event.key!==" ")return;
            event.preventDefault();
            const r=board.getBoundingClientRect();
            restoreCard(entry,r.left+r.width/2,r.top+r.height/2);
          });
          binList.append(item);
        });
        bin.classList.toggle("has-cards",stored.length>0);
      };


      const drawing = window.ALTE_DRAWING_TOOLS.create({
        state, board, document,
        getTool: () => currentTool,
        getEraserMode: () => eraserMode,
        onCardHit: event => {
        // Tapping a card while painting or erasing exits to Move mode.
        // The transparent drawing surface intercepts taps, so hit-test
        // the actual card rectangles beneath it before starting a stroke.
        const cardHit=entries.filter(entry=>!binned.has(entry.card.id) &&
          entry.tile.getBoundingClientRect().left<=event.clientX &&
          entry.tile.getBoundingClientRect().right>=event.clientX &&
          entry.tile.getBoundingClientRect().top<=event.clientY &&
          entry.tile.getBoundingClientRect().bottom>=event.clientY)
          .sort((a,b)=>(Number(b.tile.style.zIndex)||0)-(Number(a.tile.style.zIndex)||0))[0];
        if(cardHit && (currentTool==="draw" || currentTool==="erase")){
          palette.hidden=true;
          eraseMenu.hidden=true;
          setTool("move");
          return true;
        }
        return false;
        }
      });
      const { drawingSurface, beginInkAction, commitInkAction, renderInk, updateInkHistoryButtons } = drawing;
      state.flashBoardMenuController?.abort();
      const toolRail = document.createElement("div");
      toolRail.className = "flash-board-tools";
      const pen = document.createElement("button");
      pen.type = "button";
      pen.className = "flash-board-tool";
      pen.innerHTML = '<span class="flash-board-coloured-pen" aria-hidden="true"></span>';
      pen.style.setProperty("--pen-colour", state.flashBoardPenColour);
      pen.title = "Draw (tap again for colours)";
      pen.setAttribute("aria-label", "Drawing tool");
      pen.setAttribute("aria-pressed", "false");
      const palette = document.createElement("div");
      palette.className = "flash-board-palette";
      palette.hidden = true;
      const colours = [
        ["Red","#e53935"],["Blue","#1976d2"],["Green","#22a447"],
        ["Yellow","#fdd835"],["Purple","#8746c7"],["Orange","#fb8c00"],
        ["Black","#161616"]
      ];
      let currentTool = "move";
      let eraserMode = "part";
      let erasePartButton, eraseWholeButton;
      const eraser = document.createElement("button");
      eraser.type = "button";
      eraser.className = "flash-board-tool";
      eraser.innerHTML = '<img src="images/ui/AlsoEraser.svg" alt="" aria-hidden="true"><span class="flash-board-eraser-badge" aria-hidden="true">part</span>';
      const eraserBadge=eraser.querySelector(".flash-board-eraser-badge");
      const updateEraserMode=()=>{
        eraserBadge.textContent=eraserMode==="whole"?"line":"part";
        eraser.title=eraserMode==="whole"?"Eraser: whole line":"Eraser: partial";
        for(const [button,mode] of [[erasePartButton,"part"],[eraseWholeButton,"whole"]]){
          if(!button)continue;
          button.classList.toggle("chosen",eraserMode===mode);
          button.setAttribute("aria-pressed",String(eraserMode===mode));
        }
      };
      eraser.title = "Erase (tap again for options)";
      eraser.setAttribute("aria-label", "Eraser");
      const eraseMenu = document.createElement("div");
      eraseMenu.className = "flash-board-eraser-menu";
      eraseMenu.hidden = true;
      const setTool = (tool) => {
        currentTool = tool;
        pen.classList.toggle("active", tool === "draw");
        eraser.classList.toggle("active", tool === "erase");
        moveCards.classList.toggle("active", tool === "move");
        moveCards.setAttribute("aria-pressed", String(tool === "move"));
        pen.setAttribute("aria-pressed", String(tool === "draw"));
        eraser.setAttribute("aria-pressed", String(tool === "erase"));
        drawing.setActive((tool === "draw" || tool === "erase") && !removalMode, tool === "erase");
        // The S button stays independent of the active manipulation tool.
        board.classList.toggle("text-mode",tool === "text");
        textToolButton?.classList.toggle("active",tool === "text");
        textToolButton?.setAttribute("aria-pressed",String(tool === "text"));
        if (tool !== "text" && tool !== "move") selectedTextId=null;
        renderTexts();
        updateSelection();
      };
      const menuOption = (label, icon, action) => {
        const button = document.createElement("button");
        button.type = "button";
        const symbol = document.createElement("span");
        symbol.className = "flash-board-placeholder-icon";
        symbol.textContent = icon;
        symbol.setAttribute("aria-hidden", "true");
        const words = document.createElement("span");
        words.textContent = label;
        button.append(symbol, words);
        button.addEventListener("click", action);
        eraseMenu.append(button);
        return button;
      };
      erasePartButton=menuOption("Erase parts", "◌", () => { eraserMode="part"; eraseMenu.hidden=true; updateEraserMode(); setTool("erase"); });
      eraseWholeButton=menuOption("Whole stroke", "〰", () => { eraserMode="whole"; eraseMenu.hidden=true; updateEraserMode(); setTool("erase"); });
      updateEraserMode();
      menuOption("Clear all", "✕", () => {
        beginInkAction();
        state.flashBoardInk.length = 0;
        commitInkAction();
        eraseMenu.hidden = true;
        renderInk();
        setTool("erase");
      });
      eraser.addEventListener("click", () => {
        removalMode=false;
        palette.hidden = true;
        if (currentTool !== "erase") { eraseMenu.hidden = true; setTool("erase"); }
        else eraseMenu.hidden = !eraseMenu.hidden;
      });
      colours.forEach(([name, colour]) => {
        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "flash-board-swatch";
        swatch.style.backgroundColor = colour;
        swatch.title = name;
        swatch.setAttribute("aria-label", name);
        swatch.addEventListener("click", () => {
          state.flashBoardPenColour = colour;
          pen.style.setProperty("--pen-colour", colour);
          palette.hidden = true;
          setTool("draw");
        });
        palette.append(swatch);
      });
      pen.addEventListener("click", () => {
        removalMode=false;
        if (currentTool !== "draw") {
          palette.hidden = true;
          eraseMenu.hidden = true;
          setTool("draw");
        } else {
          palette.hidden = !palette.hidden;
        }
      });
      const moveCards = document.createElement("button");
      moveCards.type = "button";
      moveCards.className = "flash-board-tool";
      moveCards.innerHTML = '<img src="images/ui/Alsocards.svg" alt="" aria-hidden="true">';
      moveCards.title = "Move cards";
      moveCards.setAttribute("aria-label", "Move cards");
      moveCards.setAttribute("aria-pressed", "true");
      moveCards.addEventListener("click", () => {
        removalMode = false;
        palette.hidden = true;
        eraseMenu.hidden = true;
        setTool("move");
      });
      // Order cards into an invisible grid without changing their relative
      // neighbourhoods. Match each card to a nearby available grid slot.
      const orderButton = document.createElement("button");
      orderButton.type = "button";
      orderButton.className = "flash-board-tool";
      orderButton.innerHTML = '<span class="flash-board-action-symbol" aria-hidden="true">▦</span><span class="flash-board-action-label">order</span>';
      orderButton.title = "Click to tidy your arrangement; double-click to restore vocabulary order";
      orderButton.setAttribute("aria-label", "Order cards: click to tidy, double-click for original order");
      // Both Order actions share the SAME rows and spacing.
      // One tap tidies the existing row/column order; two taps put the
      // original vocabulary sequence into those existing row slots.
      const arrangeBoardRows = restoreVocabularyOrder => {
        palette.hidden=true;
        eraseMenu.hidden=true;
        setTool("move");
        if(!board.isConnected || !board.clientWidth || !board.clientHeight)return;
        const activeEntries=entries.filter(entry=>!binned.has(entry.card.id));
        if(!activeEntries.length)return;
        const items=activeEntries.map(entry=>{
          const size=dimensions(entry.tile);
          const position=entry.last || {x:0,y:0};
          return {
            entry, width:size.width, height:size.height,
            cx:position.x+size.width/2, cy:position.y+size.height/2,
            // Entries are created in the exact vocabulary source order.
            sourceIndex:entry.index
          };
        });
        const sortedHeights=items.map(item=>item.height).sort((a,b)=>a-b);
        const medianHeight=sortedHeights[Math.floor(sortedHeights.length/2)] || 0;
        const rowTolerance=Math.max(6,medianHeight*.65);
        items.sort((a,b)=>a.cy-b.cy || a.cx-b.cx);
        const groupedRows=[];
        for(const item of items){
          let nearest=null,nearestDistance=Infinity;
          for(const row of groupedRows){
            const difference=Math.abs(row.cy-item.cy);
            if(difference<nearestDistance){nearest=row;nearestDistance=difference;}
          }
          if(nearest && nearestDistance<=rowTolerance){
            nearest.items.push(item);
            nearest.cy=nearest.items.reduce((sum,other)=>sum+other.cy,0)/nearest.items.length;
          }else{
            groupedRows.push({cy:item.cy,items:[item]});
          }
        }
        groupedRows.sort((a,b)=>a.cy-b.cy);
        groupedRows.forEach(row=>row.items.sort((a,b)=>a.cx-b.cx || a.sourceIndex-b.sourceIndex));

        if(restoreVocabularyOrder){
          // Reassign vocabulary cards to the row slots teachers already
          // arranged. A 3/4/4 layout stays 3/4/4, not 6/5.
          // Binned cards are omitted without creating empty gaps.
          const sorted=[...items].sort((a,b)=>a.sourceIndex-b.sourceIndex);
          let next=0;
          for(const row of groupedRows){
            row.items=sorted.slice(next,next+row.items.length);
            next+=row.items.length;
          }
        }

        const rowCount=groupedRows.length;
        const rowHeights=groupedRows.map(row=>Math.max(...row.items.map(item=>item.height)));
        const totalCardsHeight=rowHeights.reduce((sum,h)=>sum+h,0);
        const verticalGap=Math.max(1.8,Math.min(4,(100-totalCardsHeight)/Math.max(1,rowCount+1)));
        const totalHeight=totalCardsHeight+(rowCount-1)*verticalGap;
        let top=Math.max(0,(100-totalHeight)/2);
        for(let i=0;i<rowCount;i++){
          const row=groupedRows[i];
          const rowHeight=rowHeights[i];
          const totalWidth=row.items.reduce((sum,item)=>sum+item.width,0);
          const freeSpace=Math.max(0,100-totalWidth);
          const gap=Math.min(5,freeSpace/Math.max(1,row.items.length+1));
          const occupied=totalWidth+gap*(row.items.length-1);
          let left=Math.max(0,(100-occupied)/2);
          for(const item of row.items){
            item.entry.last=place(item.entry.tile,{
              x:left,
              y:top+(rowHeight-item.height)/2
            });
            positions.set(item.entry.card.id,item.entry.last);
            left+=item.width+gap;
          }
          top+=rowHeight+verticalGap;
        }
      };
      bindOrderButton(orderButton, arrangeBoardRows);
      removeButton=document.createElement("button");
      removeButton.type="button";
      removeButton.className="flash-board-tool flash-board-remove";
      removeButton.innerHTML = '<svg class="flash-board-bin-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M4 7h16M9 4h6M6 7l1.1 13h9.8L18 7"/><path d="M9 10l.5 7M12 10v7M15 10l-.5 7" stroke-dasharray="1.3 1.5"/></svg><span class="flash-board-action-label">remove</span>';
      removeButton.title="Tap cards to remove them to the bin";
      removeButton.setAttribute("aria-label","Remove cards mode");
      removeButton.setAttribute("aria-pressed","false");
      removeButton.addEventListener("click",()=>{
        removalMode=!removalMode;
        if(removalMode) setTool("move");
        updateSelection();
      });
      textToolButton=document.createElement("button");
      textToolButton.type="button";
      textToolButton.className="flash-board-tool";
      textToolButton.textContent="T";
      textToolButton.title="Text: drag to draw a box; tap text to move or edit";
      textToolButton.setAttribute("aria-label","Text tool");
      textToolButton.setAttribute("aria-pressed","false");
      textToolButton.addEventListener("click",()=>{
        removalMode=false;palette.hidden=true;eraseMenu.hidden=true;
        setTool(currentTool==="text"?"move":"text");
      });
      suffixButton=document.createElement("button");
      suffixButton.type="button";
      suffixButton.className="flash-board-tool flash-board-suffix";
      suffixButton.textContent="Ss";
      suffixButton.title="Toggle plural forms for applicable flashcards";
      suffixButton.setAttribute("aria-label","Pluralise applicable flashcards");
      const eligiblePluralCards=cards.filter(pluralEligible);
      const refreshPluralButton=()=>{
        const enabled=eligiblePluralCards.length>0 && eligiblePluralCards.every(card=>pluralCards.has(card.id));
        suffixButton.classList.toggle("active",enabled);
        suffixButton.setAttribute("aria-pressed",String(enabled));
        suffixButton.disabled=!eligiblePluralCards.length;
        suffixButton.title=eligiblePluralCards.length?"Pluralise applicable flashcards":"No applicable cards in this selection";
      };
      suffixButton.addEventListener("click",()=>{
        const enabled=eligiblePluralCards.every(card=>pluralCards.has(card.id));
        eligiblePluralCards.forEach(card=>{
          if(enabled)pluralCards.delete(card.id);
          else pluralCards.add(card.id);
        });
        refreshPluralButton();
        entries.forEach(entry=>{
          const caption=entry.tile.querySelector(".flash-board-word, .flash-board-caption");
          if(caption)caption.textContent=cardLabel(entry.card);
        });
        renderBin();
      });
      refreshPluralButton();
      const editText=(item,isNew=false)=>{
        document.getElementById("flashBoardTextDialog")?.remove();
        const overlay=document.createElement("div");
        overlay.id="flashBoardTextDialog";
        overlay.className="flash-board-text-dialog";
        const panel=document.createElement("div");
        panel.className="flash-board-text-panel";
        const heading=document.createElement("strong");
        heading.textContent=isNew?"Add text":"Edit text";
        const input=document.createElement("textarea");
        input.rows=3;
        input.autocomplete="off";
        input.spellcheck=false;
        input.placeholder="Type your word or phrase";
        input.value=item.text;
        input.setAttribute("aria-label","Text for Flash Board");
        const formatting=document.createElement("div");
        formatting.className="flash-board-text-format";
        const sizeLabel=document.createElement("label");
        sizeLabel.textContent="Size";
        const fontSize=document.createElement("select");
        fontSize.setAttribute("aria-label","Text font size");
        [16,20,24,28,32,40,48,60,72].forEach(size=>{
          const option=document.createElement("option");
          option.value=String(size);
          option.textContent=size+" px";
          fontSize.append(option);
        });
        fontSize.value=String(item.fontSize||32);
        sizeLabel.append(fontSize);
        const boldButton=document.createElement("button");
        boldButton.type="button";boldButton.textContent="B";
        boldButton.className="flash-board-format-bold";
        boldButton.title="Bold";
        const italicButton=document.createElement("button");
        italicButton.type="button";italicButton.textContent="I";
        italicButton.className="flash-board-format-italic";
        italicButton.title="Italic";
        let bold=item.bold!==false, italic=Boolean(item.italic);
        const refreshFormats=()=>{
          boldButton.classList.toggle("active",bold);
          italicButton.classList.toggle("active",italic);
          boldButton.setAttribute("aria-pressed",String(bold));
          italicButton.setAttribute("aria-pressed",String(italic));
          input.style.fontSize=fontSize.value+"px";
          input.style.fontWeight=bold?"800":"400";
          input.style.fontStyle=italic?"italic":"normal";
        };
        boldButton.addEventListener("click",()=>{bold=!bold;refreshFormats();});
        italicButton.addEventListener("click",()=>{italic=!italic;refreshFormats();});
        fontSize.addEventListener("change",refreshFormats);
        formatting.append(sizeLabel,boldButton,italicButton);
        refreshFormats();
        const actions=document.createElement("div");
        actions.className="flash-board-text-actions";
        const confirm=document.createElement("button");
        confirm.type="button";confirm.textContent="✓ Done";
        const cancel=document.createElement("button");
        cancel.type="button";cancel.textContent="Cancel";
        const deleteButton=document.createElement("button");
        deleteButton.type="button";
        deleteButton.textContent="Delete text";
        deleteButton.className="flash-board-text-delete";
        deleteButton.setAttribute("aria-label","Delete this text box");
        deleteButton.hidden=isNew;
        deleteButton.addEventListener("click",()=>{
          const index=state.flashBoardTexts.findIndex(text=>text.id===item.id);
          if(index>=0)state.flashBoardTexts.splice(index,1);
          selectedTextId=null;
          overlay.remove();
          setTool("move");
        });
        let editorClosed=false;
        const finish=save=>{
          if(editorClosed)return;
          editorClosed=true;
          if(save){
            const value=input.value.trim();
            if(value){
              item.text=value;
              item.fontSize=Number(fontSize.value);
              item.bold=bold;
              item.italic=italic;
              if(isNew)state.flashBoardTexts.push(item);
            }
          }
          input.blur();
          overlay.remove();
          selectedTextId=null;
          // Close the editor first, then leave Text mode even when the
          // entered text was empty. This prevents accidental new boxes.
          setTool("move");
        };
        confirm.addEventListener("click",()=>finish(true));
        cancel.addEventListener("click",()=>finish(false));
        input.addEventListener("keydown",event=>{
          if(event.key==="Enter" && (event.ctrlKey || event.metaKey)){event.preventDefault();finish(true);}
          if(event.key==="Escape"){event.preventDefault();finish(false);}
        });
        actions.append(deleteButton,cancel,confirm);
        panel.append(heading,formatting,input,actions);overlay.append(panel);
        document.body.append(overlay);
        // On tablets, the fixed editor is independent of the board geometry.
        requestAnimationFrame(()=>input.focus());
      };
      const makeTextId=()=>String(Date.now())+"-"+Math.random().toString(36).slice(2);
      const textLayer=document.createElement("div");
      textLayer.className="flash-board-text-layer";
      board.insertBefore(textLayer,drawingSurface);
      renderTexts=()=>{
        textLayer.replaceChildren();
        state.flashBoardTexts.forEach(item=>{
          const el=document.createElement("div");
          el.className="flash-board-user-text";
          el.style.left=item.x+"%";el.style.top=item.y+"%";
          el.style.width=item.w+"%";el.style.height=item.h+"%";
          el.textContent=item.text;
          el.style.fontSize=(item.fontSize||32)+"px";
          el.style.fontWeight=item.bold===false?"400":"800";
          el.style.fontStyle=item.italic?"italic":"normal";
          el.classList.toggle("text-selected",selectedTextId===item.id && currentTool==="text");
          el.style.pointerEvents=(currentTool==="text" || currentTool==="move")?"auto":"none";
          let down=null,moved=false;
          el.addEventListener("pointerdown",event=>{
            if(currentTool!=="text" && currentTool!=="move")return;
            event.preventDefault();event.stopPropagation();
            el.setPointerCapture(event.pointerId);
            down={x:event.clientX,y:event.clientY,initialX:item.x,initialY:item.y};
            moved=false;
          });
          el.addEventListener("pointermove",event=>{
            if(!down)return;
            const dx=(event.clientX-down.x)/board.clientWidth*100;
            const dy=(event.clientY-down.y)/board.clientHeight*100;
            if(Math.abs(dx)+Math.abs(dy)>.4)moved=true;
            item.x=Math.max(0,Math.min(100-item.w,down.initialX+dx));
            item.y=Math.max(0,Math.min(100-item.h,down.initialY+dy));
            el.style.left=item.x+"%";el.style.top=item.y+"%";
          });
          el.addEventListener("pointerup",event=>{
            if(!down)return;down=null;
            if(!moved){
              if(currentTool==="text" && selectedTextId===item.id)editText(item);
              else {selectedTextId=item.id;renderTexts();}
            }else{selectedTextId=item.id;renderTexts();}
          });
          el.addEventListener("pointercancel",()=>{down=null;});
          if(currentTool==="text" && selectedTextId===item.id){
            const handle=document.createElement("span");
            handle.className="flash-board-text-resizer";
            handle.title="Resize text box";
            handle.addEventListener("pointerdown",event=>{
              event.preventDefault();event.stopPropagation();
              handle.setPointerCapture(event.pointerId);
              const origin={x:event.clientX,y:event.clientY,w:item.w,h:item.h};
              const move=e=>{
                item.w=Math.max(5,Math.min(100-item.x,origin.w+(e.clientX-origin.x)/board.clientWidth*100));
                item.h=Math.max(5,Math.min(100-item.y,origin.h+(e.clientY-origin.y)/board.clientHeight*100));
                el.style.width=item.w+"%";el.style.height=item.h+"%";
              };
              const stop=()=>{
                handle.removeEventListener("pointermove",move);
                handle.removeEventListener("pointerup",stop);
                handle.removeEventListener("pointercancel",stop);
              };
              handle.addEventListener("pointermove",move);
              handle.addEventListener("pointerup",stop);
              handle.addEventListener("pointercancel",stop);
            });
            el.append(handle);
          }
          textLayer.append(el);
        });
        textLayer.append(marquee);
        // Plural mode changes vocabulary flashcards, never teacher-created text.
      };
      let textStart=null;
      const marquee=document.createElement("div");
      marquee.className="flash-board-text-marquee";
      marquee.hidden=true;
      textLayer.append(marquee);
      const refreshMarquee=(a,b)=>{
        const x=Math.max(0,Math.min(100,Math.min(a.x,b.x)));
        const y=Math.max(0,Math.min(100,Math.min(a.y,b.y)));
        marquee.style.left=x+"%";marquee.style.top=y+"%";
        marquee.style.width=Math.max(1,Math.abs(a.x-b.x))+"%";
        marquee.style.height=Math.max(1,Math.abs(a.y-b.y))+"%";
      };
      textLayer.addEventListener("pointermove",event=>{
        if(!textStart)return;
        const r=board.getBoundingClientRect();
        refreshMarquee(textStart,{x:(event.clientX-r.left)/r.width*100,y:(event.clientY-r.top)/r.height*100});
      });
      textLayer.addEventListener("pointerdown",event=>{
        if(currentTool!=="text"||event.target!==textLayer || (event.pointerType==="mouse" && event.button!==0))return;
        if(document.getElementById("flashBoardTextDialog"))return;
        event.preventDefault();
        const rect=board.getBoundingClientRect();
        textStart={x:(event.clientX-rect.left)/rect.width*100,y:(event.clientY-rect.top)/rect.height*100};
        textLayer.setPointerCapture(event.pointerId);
        marquee.hidden=false;
        refreshMarquee(textStart,textStart);
      });
      textLayer.addEventListener("pointerup",event=>{
        if(currentTool!=="text"||!textStart)return;
        event.preventDefault();
        const rect=board.getBoundingClientRect();
        const end={x:(event.clientX-rect.left)/rect.width*100,y:(event.clientY-rect.top)/rect.height*100};
        const x=Math.max(0,Math.min(98,Math.min(textStart.x,end.x)));
        const y=Math.max(0,Math.min(96,Math.min(textStart.y,end.y)));
        const w=Math.min(100-x,Math.max(12,Math.abs(textStart.x-end.x)));
        const h=Math.min(100-y,Math.max(8,Math.abs(textStart.y-end.y)));
        textStart=null;
        marquee.hidden=true;
        editText({id:makeTextId(),text:"",suffix:false,x,y,w,h},true);
      });
      textLayer.addEventListener("pointercancel",()=>{textStart=null;marquee.hidden=true;});
      const { undoButton, redoButton } = drawing.createHistoryButtons();
      toolRail.append(moveCards, pen, palette, eraser, eraseMenu, undoButton, redoButton, textToolButton, suffixButton, orderButton, removeButton);
      setTool("move");
      updateInkHistoryButtons();
      toolRail.id = "flashBoardTools";
      document.getElementById("flashBoardTools")?.remove();
      document.body.append(toolRail);
      // Size applies to every flashcard, without disturbing their centres.
      // Kept separate from text boxes and drawing marks.
      const applyCardScale = value => {
        state.flashBoardCardScale = Math.max(.7, Math.min(1.5, Math.round(value * 100) / 100));
        if (!board.clientWidth || !board.clientHeight) return;
        entries.forEach(entry => {
          const {tile,card} = entry;
          const wasHidden = tile.hidden;
          if (wasHidden) tile.hidden = false;
          const before = dimensions(tile);
          const centre = entry.last ? {
            x:entry.last.x + before.width / 2,
            y:entry.last.y + before.height / 2
          } : {x:50,y:50};
          if (!textOnly) {
            const size = visualSize(card);
            tile.style.width = size.width + "%";
            if (tile.classList.contains("flag-sprite-card")) {
              tile.style.aspectRatio = "4 / 3";
              tile.style.height = "auto";
            } else tile.style.height = size.height + "%";
          } else {
            const word=tile.querySelector(".flash-board-word");
            if(word) word.style.fontSize =
              (Math.max(18,Math.min(48,window.innerWidth*.028))*state.flashBoardCardScale)+"px";
          }
          const after=dimensions(tile);
          entry.binSize={width:tile.offsetWidth,height:tile.offsetHeight};
          entry.last=place(tile,{x:centre.x-after.width/2,y:centre.y-after.height/2});
          positions.set(card.id,entry.last);
          if (wasHidden) tile.hidden=true;
        });
        renderBin();
      };
      // Hide only picture-card captions; word-only cards and teacher text
      // stay visible so this control never makes a word-only deck vanish.
      const labelsButton=document.createElement("button");
      labelsButton.type="button";
      labelsButton.className="flash-board-tool flash-board-label-toggle";
      labelsButton.innerHTML='<span class="flash-board-action-symbol" aria-hidden="true">Aa</span><span class="flash-board-action-label">labels</span>';
      labelsButton.setAttribute("aria-label","Show or hide flashcard labels");
      const syncLabelButton=()=>{
        const visible=state.flashBoardLabelsVisible;
        labelsButton.classList.toggle("active",visible);
        labelsButton.setAttribute("aria-pressed",String(visible));
        labelsButton.title=visible?"Hide flashcard labels":"Show flashcard labels";
        board.classList.toggle("labels-hidden",!visible);
        bin.classList.toggle("labels-hidden",!visible);
      };
      labelsButton.disabled=!hasCardCaptions;
      syncLabelButton();
      labelsButton.addEventListener("click",()=>{
        state.flashBoardLabelsVisible=!state.flashBoardLabelsVisible;
        syncLabelButton();
      });
      toolRail.insertBefore(labelsButton,orderButton);
      const sizeButton=document.createElement("button");
      sizeButton.type="button";
      sizeButton.className="flash-board-tool";
      sizeButton.innerHTML = '<span class="flash-board-action-symbol" aria-hidden="true">⤢</span><span class="flash-board-action-label">size</span>';
      sizeButton.title="Card size";
      sizeButton.setAttribute("aria-label","Card size");
      const sizeMenu=document.createElement("div");
      sizeMenu.className="flash-board-size-menu";
      sizeMenu.hidden=true;
      [["Bigger",()=>applyCardScale(state.flashBoardCardScale+.15)],
       ["Smaller",()=>applyCardScale(state.flashBoardCardScale-.15)],
       ["Reset size",()=>applyCardScale(1)]].forEach(([label,action])=>{
        const button=document.createElement("button");
        button.type="button";
        button.textContent=label;
        button.addEventListener("click",()=>{
          action();
          // Keep the three controls open for repeated taps.
        });
        sizeMenu.append(button);
      });
      sizeButton.addEventListener("click",()=>{
        palette.hidden=true;
        eraseMenu.hidden=true;
        sizeMenu.hidden=!sizeMenu.hidden;
      });
      toolRail.insertBefore(sizeButton,removeButton);
      toolRail.insertBefore(sizeMenu,removeButton);
      const menuController=new AbortController();
      state.flashBoardMenuController=menuController;
      document.addEventListener("pointerdown",event=>{
        const target=event.target;
        if(!pen.contains(target) && !palette.contains(target))palette.hidden=true;
        if(!eraser.contains(target) && !eraseMenu.contains(target))eraseMenu.hidden=true;
        if(!sizeButton.contains(target) && !sizeMenu.contains(target))sizeMenu.hidden=true;
      },{capture:true,signal:menuController.signal});
      drawing.bind();
      renderTexts();
      // Measure the actual text-only cards before positioning them. The
      // cards follow a loose initial arrangement, not fixed-size grid slots.
      const positionInitialCards = () => {
        if (!board.isConnected || !board.clientWidth || !board.clientHeight) return;
        const shape = optimalGameShape(board.clientWidth, board.clientHeight, cards);
        columns = shape.columns;
        rows = shape.rows;
        cellWidth = 100 / columns;
        cellHeight = 100 / rows;
        entries.forEach((entry) => {
          const { card, tile, index } = entry;
          if (!textOnly) {
            const size = visualSize(card);
            tile.style.width = size.width + "%";
            if (tile.classList.contains("flag-sprite-card")) {
              // Keep flag sprite cells at their source ratio at every size.
              tile.style.aspectRatio = "4 / 3";
              tile.style.height = "auto";
            } else {
              tile.style.height = size.height + "%";
            }
          } else {
            const word = tile.querySelector(".flash-board-word");
            if (word) word.style.fontSize =
              (Math.max(18, Math.min(48, window.innerWidth * .028)) * state.flashBoardCardScale) + "px";
          }
          const row = Math.floor(index / columns);
          const rowCount = Math.min(columns, count - row * columns);
          const col = index % columns;
          const size = dimensions(tile);
          const rowWidth = rowCount * cellWidth;
          const rowStart = (100 - rowWidth) / 2;
          const initial = {
            x: rowStart + col * cellWidth + (cellWidth - size.width) / 2,
            y: row * cellHeight + (cellHeight - size.height) / 2
          };
          entry.last = place(tile, entry.saved || initial);
          entry.binSize={width:tile.offsetWidth,height:tile.offsetHeight};
          tile.hidden=binned.has(card.id);
          positions.set(card.id, entry.last);
        });
      };
      requestAnimationFrame(()=>{positionInitialCards();alignBin();renderBin();updateSelection();updateCounter();});
      updateCounter();
      elements.modeLabel.textContent = "Flash Board";
      requestAnimationFrame(alignSideNavigation);
    }

    function prepare() {
      state.flashBoardPositions = new Map();
      state.flashBoardBinned = new Set();
      state.flashBoardLayers = new Map();
      state.flashBoardLayerCounter = 0;
    }

    function resetLayout() {
      state.flashBoardPositions.clear();
      state.flashBoardBinned.clear();
      state.flashBoardLayers.clear();
      state.flashBoardLayerCounter = 0;
      renderFlashBoard();
    }

    function cleanup() {
      document.getElementById("flashBoardTools")?.remove();
      document.getElementById("flashBoardBin")?.remove();
    }

    return Object.freeze({ render: renderFlashBoard, prepare, resetLayout, cleanup });
  }

  global.ALTE_FLASH_BOARD = Object.freeze({ create, bindOrderButton });
})(window);
