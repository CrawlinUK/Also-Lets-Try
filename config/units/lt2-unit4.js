/* LT2 Unit 4 — What time is it? Activity and clock sprites. */
(function () {
  "use strict";
  const bookId = "lt2";
  const unitNumber = 4;
  const defaults = LETS_TRY_DATA.getUnitDefaults(bookId, unitNumber);
  const sheets = LETS_TRY_DATA.assets.sheets;

  const activityPositions = ["0% 0%", "25% 0%", "50% 0%", "75% 0%", "100% 0%",
    "0% 100%", "25% 100%", "50% 100%", "75% 100%", "100% 100%"];
  const clockPositions = ["0% 0%", "33.333% 0%", "66.667% 0%", "100% 0%",
    "0% 50%", "33.333% 50%", "66.667% 50%", "100% 50%",
    "0% 100%", "33.333% 100%", "66.667% 100%", "100% 100%"];

  const activityCards = LETS_TRY_DATA.getCategory("dailyTimes").items.map((entry, index) => {
    const word = entry.id.replace(/-/g, " ");
    return {
      id: entry.id,
      category: "dailyTimes",
      word,
      sentence: word,
      alternate: word,
      optionLabel: word,
      teacherAnswer: word,
      textbook: (defaults.dailyTimes || []).includes(entry.id),
      visual: {
        src: LETS_TRY_DATA.assetUrl(sheets.timeActivities.file),
        size: "500% 200%", position: activityPositions[index], flip: false, cropTop: 0
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
        size: "400% 300%", position: clockPositions[index], flip: false, cropTop: 0
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
    sentenceLabel: "Phrase",
    alternateLabel: "Word",
    displayModeLabels: {
      pictureText: "Picture + word",
      picture: "Picture only",
      pictureSentence: "Picture + phrase",
      text: "Word only"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards: [...activityCards, ...clockCards]
  };
})();
