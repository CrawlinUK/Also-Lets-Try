/* Alphabet Board tunable settings */
(function (global) {
  "use strict";

  global.ALPHABET_BOARD_CONFIG = Object.freeze({
    hintWords: Object.freeze({
      A: "bat", B: "able", C: "ace", D: "odd", E: "bed", F: "off", G: "ago",
      H: "aha", I: "six", J: "ajar", K: "akin", L: "ply", M: "imp", N: "one",
      O: "top", P: "ape", Q: "aqua", R: "are", S: "ask", T: "ate", U: "cup",
      V: "ever", W: "owl", X: "axe", Y: "aye", Z: "czar"
    }),
    songTiming: Object.freeze({
      normalBeat: 650,
      groupPause: 1500,
      wLongBeat: 2000,
      finalHold: 800,
      countdownStep: 1250,
      finishedHold: 1700,
      doubleSpeedMultiplier: 0.5,
      pulseNormal: 520,
      pulseDouble: 260
    })
  });
})(window);
