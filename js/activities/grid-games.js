/* Grid Games — shared card grid with independent Missing and Keyword rules. */
(function (global) {
  "use strict";
  function create({ state, elements, selectedCards, showGridGameLayout, applyVisual, setGridShape, alignSideNavigation, shuffled, document, requestAnimationFrame }) {
    const rules = Object.freeze({
      missing: {
        order: "missingOrder", marks: "hiddenMissingIds", tileClass: "covered",
        title: "What’s missing?", action: "hide", button: "HIDE +",
        aria: "Hide one more card", modeLabel: "Missing game",
        count: (total, marks) => total - marks.size
      },
      keyword: {
        order: "keywordOrder", marks: "keywordSelectedIds", tileClass: "selected",
        title: "Keyword game", action: "pick", button: "PICK",
        aria: "Randomly pick a keyword", modeLabel: "Keywords selected",
        count: (total, marks) => marks.size
      }
    });

    function updateMissingAnswerHints(cardMap) {
      const lines = state.missingOrder
        .map((id, index) => ({ card: cardMap.get(id), position: index + 1 }))
        .filter(item => item.card && state.hiddenMissingIds.has(item.card.id))
        .map(item => Array.from(String(item.card.teacherAnswer || item.card.word)).reverse().join("") + item.position);
      elements.missingAnswerHints.replaceChildren(...lines.map(line => {
        const row = document.createElement("div");
        row.textContent = line;
        return row;
      }));
      elements.missingAnswerHints.hidden = state.gameMode !== "missing" || lines.length === 0;
    }

    function render(mode) {
      const rule = rules[mode];
      if (!rule) return;
      if (mode === "keyword") elements.missingAnswerHints.hidden = true;
      showGridGameLayout();
      elements.gameTitle.textContent = rule.title;
      elements.nextButton.dataset.gameAction = rule.action;
      elements.nextButton.textContent = rule.button;
      elements.nextButton.setAttribute("aria-label", rule.aria);

      const cards = selectedCards();
      const cardMap = new Map(cards.map(card => [card.id, card]));
      if (!state[rule.order].length || state[rule.order].length !== cards.length) {
        state[rule.order] = cards.map(card => card.id);
      }
      const marks = state[rule.marks];
      const grid = document.createElement("div");
      grid.className = "game-grid";

      state[rule.order].forEach(id => {
        const card = cardMap.get(id);
        if (!card) return;
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "game-tile";
        tile.classList.toggle(rule.tileClass, marks.has(id));

        const picture = document.createElement("div");
        picture.className = "game-picture";
        applyVisual(picture, card);
        picture.setAttribute("role", "img");
        picture.setAttribute("aria-label", card.word);
        tile.append(picture);
        tile.addEventListener("click", () => {
          if (marks.has(id)) marks.delete(id);
          else marks.add(id);
          render(mode);
        });
        grid.append(tile);
      });

      elements.gameArea.replaceChildren(grid);
      setGridShape(grid, cards);
      if (mode === "missing") updateMissingAnswerHints(cardMap);
      elements.counter.textContent = rule.count(cards.length, marks) + " / " + cards.length;
      elements.modeLabel.textContent = rule.modeLabel;
      elements.shuffleButton.textContent = "Randomise";
      requestAnimationFrame(alignSideNavigation);
    }

    function reset(mode) {
      const rule = rules[mode];
      if (!rule) return;
      state[rule.order] = [];
      state[rule.marks].clear();
    }

    function prepare(mode) {
      const rule = rules[mode];
      if (!rule) return;
      state[rule.order] = selectedCards().map(card => card.id);
      state[rule.marks].clear();
    }

    function hideOneMore() {
      const visible = state.missingOrder.filter(id => !state.hiddenMissingIds.has(id));
      if (!visible.length) return;
      const id = visible[Math.floor(Math.random() * visible.length)];
      state.hiddenMissingIds.add(id);
      render("missing");
    }

    function selectRandomKeyword() {
      if (!state.keywordOrder.length) return;
      const id = state.keywordOrder[Math.floor(Math.random() * state.keywordOrder.length)];
      state.keywordSelectedIds.clear();
      state.keywordSelectedIds.add(id);
      render("keyword");
    }

    function randomise(mode) {
      const rule = rules[mode];
      if (!rule) return;
      const original = state[rule.order].length
        ? [...state[rule.order]]
        : selectedCards().map(card => card.id);
      const order = shuffled(original);
      if (order.length > 1 && order.every((id, index) => id === original[index])) {
        [order[0], order[1]] = [order[1], order[0]];
      }
      state[rule.order] = order;
      render(mode);
    }

    // Both games use the same layout and controls; only rules and state differ.
    return Object.freeze({
      missing: Object.freeze({
        render: () => render("missing"), hideOneMore,
        start() { prepare("missing"); hideOneMore(); },
        randomise: () => randomise("missing"), reset: () => reset("missing")
      }),
      keyword: Object.freeze({
        render: () => render("keyword"), selectRandomKeyword,
        prepare: () => prepare("keyword"),
        randomise: () => randomise("keyword"), reset: () => reset("keyword")
      })
    });
  }
  global.ALTE_GRID_GAMES = Object.freeze({ create });
})(window);
