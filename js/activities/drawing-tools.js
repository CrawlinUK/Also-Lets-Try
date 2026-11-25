/* Drawing tools — SVG strokes, history, erasing and hold-to-snap recognition.
   The hosting activity supplies its board, active tool and card-hit handling. */
(function (global) {
  "use strict";
  function create({ state, board, document, getTool, getEraserMode, onCardHit = () => false }) {
      // An SVG ink layer stores strokes in board-relative coordinates,
      // so strokes stay aligned when the teaching display is resized.
      const ns = "http://www.w3.org/2000/svg";
      const inkLayer = document.createElementNS(ns, "svg");
      inkLayer.setAttribute("viewBox", "0 0 1000 1000");
      inkLayer.setAttribute("preserveAspectRatio", "none");
      inkLayer.classList.add("flash-board-ink");
      inkLayer.setAttribute("aria-label", "Drawing surface");
      const inkGroup = document.createElementNS(ns, "g");
      inkLayer.append(inkGroup);
      // Eraser feedback uses the same SVG coordinates as the real eraser.
      // Keep the preview separate from ink so Undo and Redo are unaffected.
      const eraserPreviewGroup=document.createElementNS(ns,"g");
      eraserPreviewGroup.classList.add("flash-board-eraser-preview");
      eraserPreviewGroup.setAttribute("pointer-events","none");
      const eraserCircle=document.createElementNS(ns,"ellipse");
      eraserCircle.setAttribute("rx","15");
      eraserCircle.setAttribute("ry","15");
      eraserCircle.classList.add("flash-board-eraser-circle");
      const eraserHighlightedStroke=document.createElementNS(ns,"path");
      eraserHighlightedStroke.classList.add("flash-board-eraser-highlight");
      eraserHighlightedStroke.setAttribute("fill","none");
      eraserHighlightedStroke.setAttribute("stroke-width","10");
      eraserHighlightedStroke.setAttribute("stroke-linecap","round");
      eraserHighlightedStroke.setAttribute("stroke-linejoin","round");
      eraserPreviewGroup.append(eraserCircle,eraserHighlightedStroke);
      inkLayer.append(eraserPreviewGroup);
      eraserPreviewGroup.style.display="none";
      // Paint the ink beneath the cards. A separate transparent input layer
      // sits above cards only while the pencil is active.
      board.prepend(inkLayer);
      const drawingSurface = document.createElement("div");
      drawingSurface.className = "flash-board-drawing-surface";
      board.append(drawingSurface);

      const renderInk = () => {
        inkGroup.replaceChildren();
        state.flashBoardInk.forEach((stroke, index) => {
          const path = document.createElementNS(ns, "path");
          const pathData = stroke.points.map((p,i) =>
            (i ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2)
          ).join(" ");
          path.setAttribute("d", pathData);
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", stroke.colour);
          path.setAttribute("stroke-width", "4");
          path.setAttribute("stroke-linecap", "round");
          path.setAttribute("stroke-linejoin", "round");
          const removed = stroke.erasures || [];
          if (removed.length) {
            const mask = document.createElementNS(ns, "mask");
            const maskId = "fb-ink-" + index;
            mask.id = maskId;
            mask.setAttribute("maskUnits", "userSpaceOnUse");
            mask.setAttribute("x", "0"); mask.setAttribute("y", "0");
            mask.setAttribute("width", "1000"); mask.setAttribute("height", "1000");
            const white = document.createElementNS(ns, "rect");
            white.setAttribute("width", "1000"); white.setAttribute("height", "1000");
            white.setAttribute("fill", "white");
            mask.append(white);
            removed.forEach(erase => {
              const dot = document.createElementNS(ns, "circle");
              dot.setAttribute("cx", String(erase[0]));
              dot.setAttribute("cy", String(erase[1]));
              dot.setAttribute("r", "15");
              dot.setAttribute("fill", "black");
              mask.append(dot);
            });
            inkGroup.append(mask);
            path.setAttribute("mask", "url(#" + maskId + ")");
          }
          inkGroup.append(path);
        });
      };
      // History stores complete stroke records, including partial-erase masks.
      // One gesture is a single undoable action.
      const copyInk = () => state.flashBoardInk.map(stroke => ({
        colour: stroke.colour,
        points: stroke.points.map(p => [...p]),
        erasures: (stroke.erasures || []).map(p => [...p])
      }));
      let pendingHistory = null;
      const beginInkAction = () => { pendingHistory = copyInk(); };
      const commitInkAction = () => {
        if (!pendingHistory) return;
        if (JSON.stringify(pendingHistory) !== JSON.stringify(state.flashBoardInk)) {
          state.flashBoardUndo.push(pendingHistory);
          if (state.flashBoardUndo.length > 80) state.flashBoardUndo.shift();
          state.flashBoardRedo.length = 0;
        }
        pendingHistory = null;
        updateInkHistoryButtons();
      };
      let undoButton, redoButton;
      const updateInkHistoryButtons = () => {
        if (undoButton) undoButton.disabled = !state.flashBoardUndo.length;
        if (redoButton) redoButton.disabled = !state.flashBoardRedo.length;
      };
    function createHistoryButtons() {
      const makeHistoryButton = (label, symbol, stack, otherStack) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "flash-board-tool";
        button.textContent = symbol;
        button.title = label;
        button.setAttribute("aria-label", label);
        button.addEventListener("click", () => {
          if (!stack.length) return;
          otherStack.push(copyInk());
          state.flashBoardInk = stack.pop();
          renderInk();
          updateInkHistoryButtons();
        });
        return button;
      };
      undoButton = makeHistoryButton("Undo drawing", "↶", state.flashBoardUndo, state.flashBoardRedo);
      redoButton = makeHistoryButton("Redo drawing", "↷", state.flashBoardRedo, state.flashBoardUndo);
      return { undoButton, redoButton };
    }

    function bind() {
      const pointOf = (event) => {
        const rect = inkLayer.getBoundingClientRect();
        return [
          Math.max(0, Math.min(1000, (event.clientX - rect.left) / rect.width * 1000)),
          Math.max(0, Math.min(1000, (event.clientY - rect.top) / rect.height * 1000))
        ];
      };
      let activeStroke = null;
      let erasing = false;
      const nearStroke = (stroke, p) => {
        const pts = stroke.points;
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[i+1] || a;
          const vx = b[0]-a[0], vy = b[1]-a[1];
          const t = Math.max(0, Math.min(1,
            ((p[0]-a[0])*vx+(p[1]-a[1])*vy)/(vx*vx+vy*vy || 1)));
          const dx = p[0]-(a[0]+t*vx), dy = p[1]-(a[1]+t*vy);
          if (dx*dx+dy*dy < 18*18) return true;
        }
        return false;
      };
      // The partial outline matches the 15-unit mask radius exactly.
      // Whole-stroke feedback uses the very same nearStroke test as removal.
      const updateEraserPreview = (event) => {
        if(getTool()!=="erase" || !board.isConnected){
          eraserPreviewGroup.style.display="none";
          return;
        }
        const point=pointOf(event);
        eraserPreviewGroup.style.display="";
        if(getEraserMode()==="part"){
          eraserCircle.style.display="";
          eraserCircle.setAttribute("cx",String(point[0]));
          eraserCircle.setAttribute("cy",String(point[1]));
          eraserHighlightedStroke.style.display="none";
        }else{
          eraserCircle.style.display="none";
          const target=[...state.flashBoardInk].reverse().find(stroke=>nearStroke(stroke,point));
          if(target){
            eraserHighlightedStroke.style.display="";
            eraserHighlightedStroke.setAttribute("d",target.points.map((p,i)=>
              (i?"L":"M")+p[0].toFixed(2)+" "+p[1].toFixed(2)).join(" "));
          }else{
            eraserHighlightedStroke.style.display="none";
          }
        }
      };
      const applyEraser = point => {
        if (getEraserMode() === "whole") {
          // Hit the original path, even when an earlier erase hid part of it.
          for (let i=state.flashBoardInk.length-1; i>=0; i--) {
            if (nearStroke(state.flashBoardInk[i], point)) {
              state.flashBoardInk.splice(i,1);
              break;
            }
          }
        } else {
          state.flashBoardInk.forEach(stroke => {
            if (nearStroke(stroke, point)) {
              if (!stroke.erasures) stroke.erasures = [];
              stroke.erasures.push(point);
            }
          });
        }
        renderInk();
      };
      // Apple-style hold-to-snap for basic, deliberately drawn shapes.
      // Work in physical board pixels to avoid distortion on wide screens;
      // store the resulting geometry in the same 0–1000 ink coordinates.
      const recogniseInkShape = source => {
        if(source.length<4)return null;
        const sx=board.clientWidth/1000,sy=board.clientHeight/1000;
        if(!sx || !sy)return null;
        const points=source.map(p=>[p[0]*sx,p[1]*sy]);
        const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
        const start=points[0],end=points[points.length-1];
        const minX=Math.min(...points.map(p=>p[0]));
        const maxX=Math.max(...points.map(p=>p[0]));
        const minY=Math.min(...points.map(p=>p[1]));
        const maxY=Math.max(...points.map(p=>p[1]));
        const width=maxX-minX,height=maxY-minY,diagonal=Math.hypot(width,height);
        const travelled=points.slice(1).reduce((sum,p,i)=>sum+distance(p,points[i]),0);
        if(diagonal<28 || travelled<30)return null;
        const back=p=>[p[0]/sx,p[1]/sy];
        const straightError=(pts,a,b)=>{
          const len=distance(a,b)||1;
          return pts.reduce((sum,p)=>sum+Math.abs((b[0]-a[0])*(a[1]-p[1])-(a[0]-p[0])*(b[1]-a[1]))/len,0)/pts.length;
        };
        const endDistance=distance(start,end);
        if(endDistance>42 && endDistance/travelled>.90 &&
           straightError(points,start,end)<Math.max(6,endDistance*.065))
          return [back(start),back(end)];
        // Closed loops: a rectangle hugs its four edges; a circle or oval
        // follows an ellipse with similar radial distances.
        if(width>28 && height>28 && endDistance<diagonal*.23 && travelled>diagonal*1.75){
          const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
          const edgeError=points.reduce((sum,p)=>sum+Math.min(
            Math.abs(p[0]-minX),Math.abs(p[0]-maxX),
            Math.abs(p[1]-minY),Math.abs(p[1]-maxY)
          ),0)/points.length/Math.min(width,height);
          const ovalError=points.reduce((sum,p)=>{
            const radial=Math.hypot((p[0]-cx)/(width/2),(p[1]-cy)/(height/2));
            return sum+Math.abs(radial-1);
          },0)/points.length;
          // Prefer rectangular corners only when the stroke clearly
          // follows straight edges; otherwise fit a smooth ellipse.
          if(edgeError<.115 && edgeError<ovalError*.8){
            const corners=[[minX,minY],[maxX,minY],[maxX,maxY],[minX,maxY],[minX,minY]];
            return corners.map(back);
          }
          if(ovalError<.23){
            return Array.from({length:65},(_,i)=>{
              const angle=2*Math.PI*i/64;
              return back([cx+width/2*Math.cos(angle),cy+height/2*Math.sin(angle)]);
            });
          }
        }
        // Hand-drawn arrows usually have a long straight shaft followed by
        // a shorter hooked stroke. Recognise the tip and reconstruct two
        // symmetric arrowhead wings.
        let tipIndex=0,shaft=0;
        points.forEach((p,i)=>{
          const d=distance(start,p);
          if(d>shaft){shaft=d;tipIndex=i;}
        });
        if(shaft>55 && tipIndex>points.length*.30 &&
           tipIndex<points.length-2 && distance(end,points[tipIndex])<shaft*.48 &&
           straightError(points.slice(0,tipIndex+1),start,points[tipIndex])<shaft*.08){
          const tip=points[tipIndex],vx=(tip[0]-start[0])/shaft,vy=(tip[1]-start[1])/shaft;
          const side=Math.abs((end[0]-tip[0])*(-vy)+(end[1]-tip[1])*vx);
          if(side>shaft*.08){
            const head=Math.min(36,shaft*.26);
            const wingA=[tip[0]-vx*head-vy*head*.60,tip[1]-vy*head+vx*head*.60];
            const wingB=[tip[0]-vx*head+vy*head*.60,tip[1]-vy*head-vx*head*.60];
            return [start,tip,wingA,tip,wingB].map(back);
          }
        }
        return null;
      };
      let shapeHoldTimer=null;
      const clearShapeHold=()=>{
        if(shapeHoldTimer!==null)clearTimeout(shapeHoldTimer);
        shapeHoldTimer=null;
      };
      const scheduleShapeHold=()=>{
        clearShapeHold();
        if(!activeStroke || activeStroke.snapped || activeStroke.points.length<4)return;
        // Hold after finishing the gesture; release immediately for freehand.
        shapeHoldTimer=setTimeout(()=>{
          shapeHoldTimer=null;
          if(!activeStroke || getTool()!=="draw")return;
          const snapped=recogniseInkShape(activeStroke.points);
          if(!snapped)return;
          activeStroke.points=snapped;
          activeStroke.snapped=true;
          renderInk();
        },1500);
      };
      drawingSurface.addEventListener("pointerdown", event => {
        if (getTool() === "move" || getTool() === "text" || (event.pointerType === "mouse" && event.button !== 0)) return;
        event.preventDefault();
        if (onCardHit(event)) return;
        drawingSurface.setPointerCapture(event.pointerId);
        const point = pointOf(event);
        if(getTool()==="erase")updateEraserPreview(event);
        beginInkAction();
        if (getTool() === "draw") {
          clearShapeHold();
          activeStroke = { colour: state.flashBoardPenColour, points: [point] };
          state.flashBoardInk.push(activeStroke);
          renderInk();
        } else {
          erasing = true;
          applyEraser(point);
        }
      });
      drawingSurface.addEventListener("pointermove", event => {
        if(getTool()==="erase")updateEraserPreview(event);
        if (activeStroke) {
          if(activeStroke.snapped)return;
          activeStroke.points.push(pointOf(event));
          renderInk();
          scheduleShapeHold();
        } else if (erasing && getEraserMode() === "part") applyEraser(pointOf(event));
      });
      const stopStroke = () => {
        clearShapeHold();
        if (activeStroke || erasing) commitInkAction();
        activeStroke = null;
        erasing = false;
      };
      drawingSurface.addEventListener("pointerup", event=>{
        stopStroke();
        if(event.pointerType!=="mouse")eraserPreviewGroup.style.display="none";
        else if(getTool()==="erase")updateEraserPreview(event);
      });
      drawingSurface.addEventListener("pointercancel",()=>{
        stopStroke();
        eraserPreviewGroup.style.display="none";
      });
      drawingSurface.addEventListener("pointerleave",event=>{
        if(event.pointerType==="mouse" && !erasing)eraserPreviewGroup.style.display="none";
      });
      renderInk();
    }

    function setActive(active, erasing) {
      drawingSurface.classList.toggle("drawing", active);
      if (!erasing) eraserPreviewGroup.style.display = "none";
    }

    return Object.freeze({
      drawingSurface, createHistoryButtons, bind, setActive,
      beginInkAction, commitInkAction, renderInk, updateInkHistoryButtons
    });
  }

  global.ALTE_DRAWING_TOOLS = Object.freeze({ create });
})(window);
