/* Book 1 Unit 3 — shared-template configuration */
(function () {
  "use strict";

  const numberWords = {
    1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight",9:"nine",10:"ten",
    11:"eleven",12:"twelve",13:"thirteen",14:"fourteen",15:"fifteen",16:"sixteen",
    17:"seventeen",18:"eighteen",19:"nineteen",20:"twenty",
    30:"thirty",40:"forty",50:"fifty",60:"sixty",70:"seventy",80:"eighty",90:"ninety",100:"one hundred"
  };

  function numberColour(value) {
    if (value <= 10) return "#FFDE23";
    if (value <= 12) return "#F37536";
    if (value <= 19) return "#EE3338";
    return "#0178BE";
  }

  const textbook = new Set(Array.from({length:20},(_,index)=>index+1));
  const values = [...textbook,30,40,50,60,70,80,90,100];
  const digitBase = ALTE_DATA.assetUrl("images/numbers/");

  const cards = values.map((value) => ({
    id: String(value),
    category: "numbers",
    word: numberWords[value],
    sentence: numberWords[value],
    alternate: String(value),
    optionLabel: String(value),
    teacherAnswer: numberWords[value],
    textbook: textbook.has(value),
    visual: {
      type: "number-svg",
      text: String(value),
      digitBase,
      digitVersion: window.ALTE_NUMBER_SVG_VERSION || "",
      colour: numberColour(value)
    }
  }));

  window.ALTE_UNIT_CATEGORY_IDS = ["numbers"];
  window.ALTE_UNIT_CONFIG = {
    bookId: "book1",
    unitNumber: "3",
    unitTitle: "How many?",
    browserTitle: "Bk1U3 — How many?",
    unitColour: "#E84283",
    unitNumberColour: "#F06AA0",
    menuFile: "book-1.html",
    defaultPrompt: "",
    sentenceLabel: "Word",
    showPictureSentenceMode: false,
    displayModeLabels: {
      pictureText: "Number + word",
      picture: "Number only",
      text: "Word only"
    },
    balanceLabels: {
      picture: "Number",
      text: "Word"
    },
    pictureAspectRatio: "1 / 1",
    autoSeconds: 3,
    autoSecondsMinimum: 1,
    autoSecondsMaximum: 5,
    cards
  };
})();
