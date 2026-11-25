/* Shared responsive grid sizing — used by Grid Games and Flash Board. */
(function (global) {
  "use strict";
  function create({ UNIT_CONFIG, ResizeObserver, requestAnimationFrame }) {
    function visualRatio(card) {
      const raw = card?.visual?.aspectRatio || UNIT_CONFIG.pictureAspectRatio || "1 / 1";
      const parts = String(raw).split("/").map(Number);
      const ratio = parts.length === 2 ? parts[0] / parts[1] : Number(raw);
      return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
    }

    // Test all feasible grids against the measured drawing area, not just card count.
    // The score rewards large, undistorted images; incomplete rows are centred.
    function optimalGameShape(width, height, cards) {
      const count = cards.length;
      if (!count) return { columns: 1, rows: 1 };
      const gap = Math.max(3, Math.min(9, width * .0055));
      let best = null;
      for (let columns = 1; columns <= count; columns++) {
        const rows = Math.ceil(count / columns);
        const cellWidth = (width - gap * (columns - 1)) / columns;
        const cellHeight = (height - gap * (rows - 1)) / rows;
        if (cellWidth <= 0 || cellHeight <= 0) continue;
        const areas = cards.map(card => {
          const ratio = visualRatio(card);
          const w = Math.min(cellWidth - 4, (cellHeight - 4) * ratio);
          const h = w / ratio;
          return Math.max(0, w * h);
        });
        const minArea = Math.min(...areas);
        const avgArea = areas.reduce((sum, area) => sum + area, 0) / count;
        const score = minArea * .72 + avgArea * .28;
        if (!best || score > best.score + .01 ||
            (Math.abs(score - best.score) <= .01 && rows < best.rows)) {
          best = { columns, rows, score };
        }
      }
      return best || { columns: 1, rows: count };
    }

    function setGridShape(grid, cards) {
      const count = cards.length;
      grid.dataset.cardCount = String(count);
      let lastWidth = -1, lastHeight = -1;
      const update = () => {
        if (!grid.isConnected) return;
        const width = grid.clientWidth, height = grid.clientHeight;
        if (width <= 0 || height <= 0 ||
            (Math.abs(lastWidth - width) < 1 && Math.abs(lastHeight - height) < 1)) return;
        lastWidth = width; lastHeight = height;
        const shape = optimalGameShape(width, height, cards);
        grid.style.setProperty("--grid-cols", shape.columns);
        grid.style.setProperty("--grid-slots", shape.columns * 2);
        grid.style.setProperty("--grid-rows", shape.rows);
        const remainder = count % shape.columns;
        const fullRows = Math.floor(count / shape.columns);
        [...grid.children].forEach((tile, index) => {
          const row = Math.floor(index / shape.columns);
          const position = index % shape.columns;
          const isLastPartialRow = remainder > 0 && row === fullRows;
          // Each card spans two half-width tracks; only the final row
          // receives a half-track offset to centre its remaining cards.
          const start = 1 + position * 2
            + (isLastPartialRow ? shape.columns - remainder : 0);
          tile.style.gridColumn = start + " / span 2";
          tile.style.gridRow = String(row + 1);
        });
      };
      // Observing the drawing area avoids recomputing on every frame or
      // on changes to individual image sizes.
      const observer = new ResizeObserver(() => {
        if (!grid.isConnected) { observer.disconnect(); return; }
        update();
      });
      observer.observe(grid);
      requestAnimationFrame(update);
    }

    return Object.freeze({ visualRatio, optimalGameShape, setGridShape });
  }
  global.ALTE_GRID_LAYOUT = Object.freeze({ create });
})(window);
