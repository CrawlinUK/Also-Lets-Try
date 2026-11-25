/* Missing Game — independent classroom activity. Shared services are supplied by the classroom. */
(function (global) {
  "use strict";
  function create({ state, elements, selectedCards, showGridGameLayout, applyVisual, setGridShape, alignSideNavigation, shuffled, document, requestAnimationFrame }) {
    function reverseText(value) {
      return Array.from(String(value)).reverse().join("");
    }

    function updateMissingAnswerHints() {
      const cardMap = new Map(selectedCards().map((card) => [card.id, card]));
      const lines = state.missingOrder
        .map((id, index) => ({ card: cardMap.get(id), position: index + 1 }))
        .filter((item) => item.card && state.hiddenMissingIds.has(item.card.id))
        .map((item) => `${reverseText(item.card.teacherAnswer || item.card.word)}${item.position}`);
      elements.missingAnswerHints.replaceChildren(...lines.map((line) => {
        const row = document.createElement("div");
        row.textContent = line;
        return row;
      }));
      elements.missingAnswerHints.hidden = state.gameMode !== "missing" || lines.length === 0;
    }

    function renderMissing() {
      showGridGameLayout();
      elements.gameTitle.textContent = "What’s missing?";
      elements.nextButton.dataset.gameAction = "hide";
      elements.nextButton.textContent = "HIDE +";
      elements.nextButton.setAttribute("aria-label", "Hide one more card");

      const cards = selectedCards();
      const cardMap = new Map(cards.map((card) => [card.id, card]));

      if (!state.missingOrder.length || state.missingOrder.length !== cards.length) {
        state.missingOrder = cards.map((card) => card.id);
      }

      const grid = document.createElement("div");
      grid.className = "game-grid";
      

      state.missingOrder.forEach((id) => {
        const card = cardMap.get(id);
        if (!card) return;

        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "game-tile";
        tile.classList.toggle("covered", state.hiddenMissingIds.has(id));

        const picture = document.createElement("div");
        picture.className = "game-picture";
        applyVisual(picture, card);
        picture.setAttribute("role", "img");
        picture.setAttribute("aria-label", card.word);

        tile.append(picture);
        tile.addEventListener("click", () => {
          if (state.hiddenMissingIds.has(id)) state.hiddenMissingIds.delete(id);
          else state.hiddenMissingIds.add(id);
          renderMissing();
        });

        grid.append(tile);
      });

      elements.gameArea.replaceChildren(grid);
      setGridShape(grid, cards);
      updateMissingAnswerHints();
      elements.counter.textContent = `${cards.length - state.hiddenMissingIds.size} / ${cards.length}`;
      elements.modeLabel.textContent = "Missing game";
      elements.shuffleButton.textContent = "Randomise";
      requestAnimationFrame(alignSideNavigation);
    }

    function hideOneMore() {
      const visible = state.missingOrder.filter((id) => !state.hiddenMissingIds.has(id));
      if (!visible.length) return;
      const id = visible[Math.floor(Math.random() * visible.length)];
      state.hiddenMissingIds.add(id);
      renderMissing();
    }

    function start() {
      state.missingOrder = selectedCards().map((card) => card.id);
      state.hiddenMissingIds.clear();
      hideOneMore();
    }

    function randomise() {
      const original = state.missingOrder.length
        ? [...state.missingOrder]
        : selectedCards().map((card) => card.id);
      state.missingOrder = shuffled(original);
      if (
        state.missingOrder.length > 1 &&
        state.missingOrder.every((id, index) => id === original[index])
      ) {
        [state.missingOrder[0], state.missingOrder[1]] =
          [state.missingOrder[1], state.missingOrder[0]];
      }
      renderMissing();
    }

    function reset() {
      state.missingOrder = [];
      state.hiddenMissingIds.clear();
    }

    return Object.freeze({ render: renderMissing, hideOneMore, start, randomise, reset });
  }
  global.ALTE_MISSING_GAME = Object.freeze({ create });
})(window);
