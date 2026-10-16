/* LT2 Unit 4 — What time is it? Activity and clock sprites. */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 4;
  const defaults = LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber);
  const sheets = LETS_TRY_DATA.assets.sheets;

  const activityCards = LETS_TRY_DATA.getCategory("dailyTimes").items.map((entry, index) => {
    const word = entry.id.replace(/-/g, " ");
    return {
      id: entry.id,
      category: "dailyTimes",
      word,
      sentence: "It’s " + word + ".",
      alternate: word,
      optionLabel: word,
      teacherAnswer: word,
      textbook: (defaults.dailyTimes || []).includes(entry.id),
      visual: {
        src: LETS_TRY_DATA.assetUrl(sheets.timeActivities.file),
        size: sheets.timeActivities.backgroundSize, position: LETS_TRY_DATA.assets.knownCells.dailyTimes[entry.id], flip: false, cropTop: 0
      }
    };
  });

  const clockCards = LETS_TRY_DATA.getCategory("clockTimes").items.map((entry, index) => {
    const hour = index + 1;
    const word = hour + " o’clock";
    return {
      id: entry.id,
      category: "clockTimes",
      word,
      sentence: "It’s " + word + ".",
      alternate: word,
      optionLabel: word,
      teacherAnswer: word,
      textbook: false, // Clock cards remain available as optional extras.
      visual: {
        src: LETS_TRY_DATA.assetUrl(sheets.clocks.file),
        size: sheets.clocks.backgroundSize, position: LETS_TRY_DATA.assets.knownCells.clockTimes[entry.id], flip: false, cropTop: 0
      }
    };
  });

  window.LETS_TRY_UNIT_CATEGORY_IDS = ["dailyTimes", "clockTimes"];
  window.LETS_TRY_UNIT_CONFIG = {
    bookId,
    unitNumber: "4",
    unitTitle: "What time is it?",
    browserTitle: "Let’s Try! 2 — What time is it?",
    unitColour: "#ED6D00",
    unitNumberColour: "#F28C45",
    menuFile: "lets_try_2.html",
    defaultPrompt: "What time is it?",
    selectionHeading: "Activities and clocks",
    wordLabel: "Word",
    sentenceLabel: "It’s ~",
    alternateLabel: "Word",
    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      pictureSentence: "Picture + It’s",
      text: "Word only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards: [...activityCards, ...clockCards]
  };
})();
