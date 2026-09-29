/*
  LET'S TRY! 1 — SHARED DATA
  ==========================
  Usage:
    <script src="../js/lets-try-data.js"></script>
    const cards = LETS_TRY_DATA.getCategory("feelings");
    const unit4 = LETS_TRY_DATA.getUnitCards(4);

  Image paths are resolved relative to this JavaScript file, so the same data
  works from root pages and from /units/ pages.
*/

(function (global) {
  "use strict";

  const scriptUrl =
    document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : location.href;

  const projectRoot = new URL("../", scriptUrl);

  function assetUrl(path) {
    return new URL(path, projectRoot).href;
  }

  const IMAGE_SHEETS = {
    flags: {
      file: "images/flags.png",
      size: "401% 301%",
      aspectRatio: "3 / 2",
      category: "greetings",
      status: "ready"
    },
    emotions: {
      file: "images/emotions.jpg",
      size: "400% 200%",
      aspectRatio: "364 / 512",
      category: "feelings",
      status: "ready"
    },
    sports: {
      file: "images/sports.png",
      size: "400% 300%",
      aspectRatio: "1 / 1",
      category: "sports",
      status: "ready"
    },
    foods: {
      file: "images/foods.png",
      size: "400% 400%",
      aspectRatio: "1 / 1",
      category: "food",
      status: "ready"
    },
    vegetables: {
      file: "images/veg.png",
      size: "300% 300%",
      aspectRatio: "1 / 1",
      category: "vegetables",
      status: "ready"
    },
    fruit: {
      file: "images/fruit.png",
      size: "300% 400%",
      aspectRatio: "1 / 1",
      category: "fruit",
      status: "ready"
    },
    stationery: {
      file: "images/stationary.png",
      size: "400% 300%",
      aspectRatio: "1 / 1",
      category: "stationery",
      status: "needs-card-map",
      note: "Uploaded asset is named stationary.png. Keep that exact filename in code."
    }
  };

  function sprite(sheet, position, extra = {}) {
    const info = IMAGE_SHEETS[sheet];
    if (!info) throw new Error("Unknown image sheet: " + sheet);

    return {
      type: "sprite",
      sheet,
      src: assetUrl(info.file),
      size: info.size,
      position,
      flip: false,
      cropTop: 0,
      ...extra
    };
  }

  const CATEGORIES = {
    greetings: [
      { id: "finland", word: "Terve", sentence: "Finland", textbook: true, visual: sprite("flags", "66.15% 0%") },
      { id: "china", word: "Nǐ hǎo", native: "你好", sentence: "China", textbook: true, visual: sprite("flags", "66.6667% 100%") },
      { id: "germany", word: "Guten Tag", sentence: "Germany", textbook: true, visual: sprite("flags", "100% 0%") },
      { id: "japan", word: "Konnichiwa", sentence: "Japan", textbook: true, visual: sprite("flags", "33.3333% 50%") },
      { id: "kenya", word: "Jambo", sentence: "Kenya", textbook: true, visual: sprite("flags", "66.6667% 50%") },
      { id: "india", word: "Namaste", native: "नमस्ते", sentence: "India", textbook: true, visual: sprite("flags", "0% 50%") },
      {
        id: "korea",
        word: "Annyeonghaseyo",
        native: "안녕하세요",
        sentence: "Korea",
        textbook: true,
        visual: { type: "special", key: "korea-flag", flip: false }
      },
      { id: "usa", word: "Hello", sentence: "USA", textbook: true, visual: sprite("flags", "100% 100%") },
      { id: "australia", word: "Hello", sentence: "Australia", textbook: true, visual: sprite("flags", "0% 0%") }
    ],

    feelings: [
      { id: "happy", word: "happy", sentence: "I’m happy.", textbook: true, visual: sprite("emotions", "0% 0%") },
      { id: "tired", word: "tired", sentence: "I’m tired.", textbook: true, visual: sprite("emotions", "64% 93%", { cropTop: 3 }) },
      { id: "hungry", word: "hungry", sentence: "I’m hungry.", textbook: true, visual: sprite("emotions", "96% 0%") },
      { id: "sleepy", word: "sleepy", sentence: "I’m sleepy.", textbook: true, visual: sprite("emotions", "31% 93%") },
      { id: "sad", word: "sad", sentence: "I’m sad.", textbook: true, visual: sprite("emotions", "0% 93%") },
      { id: "fine", word: "fine", sentence: "I’m fine.", textbook: true, visual: sprite("emotions", "93% 93%", { flip: true, cropTop: 3 }) },
      { id: "good", word: "good", sentence: "I’m good.", textbook: false, visual: sprite("emotions", "93% 93%", { cropTop: 3 }) },
      { id: "great", word: "great", sentence: "I’m great.", textbook: false, visual: sprite("emotions", "64% 0%") },
      { id: "wonderful", word: "wonderful", sentence: "I’m wonderful.", textbook: false, visual: sprite("emotions", "33.3333% 0%") }
    ],

    numbers: [
      1,2,3,4,5,6,7,8,9,10,
      11,12,13,14,15,16,17,18,19,20,
      30,40,50,60,70,80,90,100
    ].map(number => ({
      id: "number-" + number,
      word: String(number),
      value: number,
      visual: { type: "text" }
    })),

    colours: [
      ["red", "#E53935", true],
      ["pink", "#F28AB2", true],
      ["yellow", "#FFD928", true],
      ["blue", "#27A7DF", true],
      ["light-blue", "#8DDCF4", false, "light blue"],
      ["green", "#2DAA4F", true],
      ["light-green", "#A9D96A", false, "light green"],
      ["orange", "#F5A51B", true],
      ["purple", "#A65AA6", true],
      ["black", "#111111", true],
      ["white", "#F8F8F4", true],
      ["brown", "#A94D09", true],
      ["gray", "#9FA4A8", false]
    ].map(([id, fill, textbook, label]) => ({
      id: id + "-color",
      word: label || id,
      sentence: "I like " + (label || id) + ".",
      textbook,
      visual: { type: "generated-colour", fill }
    })),

    sports: [
      ["baseball", "0% 0%"],
      ["dodgeball", "33.333% 0%"],
      ["soccer", "66.667% 0%"],
      ["basketball", "100% 0%"],
      ["swimming", "0% 50%"]
    ].map(([word, position]) => ({
      id: word,
      word,
      sentence: "I like " + word + ".",
      textbook: true,
      visual: sprite("sports", position)
    })),

    food: [
      ["ice-cream", "ice cream", "0% 0%", true, "I like ice cream."],
      ["pudding", "pudding", "33.333% 0%", true],
      ["milk-blue", "milk", "66.667% 0%", true],
      ["orange-juice", "orange juice", "100% 0%", true],
      ["hamburger", "hamburger", "0% 33.333%", true],
      ["pizza", "pizza", "33.333% 33.333%", true],
      ["spaghetti", "spaghetti", "66.667% 33.333%", true],
      ["sushi", "sushi", "100% 33.333%", true],
      ["steak", "steak", "0% 66.667%", true],
      ["salad", "salad", "33.333% 66.667%", true],
      ["cake", "cake", "66.667% 66.667%", true],
      ["egg", "egg", "100% 66.667%", true, "I like eggs."],
      ["jam", "jam", "0% 100%", true],
      ["noodles", "noodles", "33.333% 100%", true],
      ["rice-ball", "rice ball", "66.667% 100%", true, "I like rice balls."],
      ["milk-red", "milk", "100% 100%", false]
    ].map(([id, word, position, textbook, sentence]) => ({
      id,
      word,
      sentence: sentence || ("I like " + word + "."),
      textbook,
      visual: sprite("foods", position)
    })),

    vegetables: [
      ["onion", "onion", "0% 0%", "I like onions."],
      ["green-pepper", "green pepper", "50% 0%", "I like green peppers."],
      ["cucumber", "cucumber", "100% 0%", "I like cucumbers."],
      ["carrot", "carrot", "0% 50%", "I like carrots."]
    ].map(([id, word, position, sentence]) => ({
      id,
      word,
      sentence,
      textbook: true,
      visual: sprite("vegetables", position)
    })),

    fruit: [
      ["grapes", "grapes", "0% 0%", "I like grapes."],
      ["orange", "orange", "50% 0%", "I like oranges."],
      ["pineapple", "pineapple", "100% 0%", "I like pineapples."],
      ["peach", "peach", "0% 33.333%", "I like peaches."],
      ["melon", "melon", "50% 33.333%", "I like melons."],
      ["banana", "banana", "100% 33.333%", "I like bananas."],
      ["kiwi", "kiwi", "0% 66.667%", "I like kiwis."],
      ["lemon", "lemon", "50% 66.667%", "I like lemons."]
    ].map(([id, word, position, sentence]) => ({
      id,
      word,
      sentence,
      textbook: true,
      visual: sprite("fruit", position)
    })),

    // Awaiting reconstruction of the lost corrected Unit 5 mapping.
    stationery: []
  };

  const UNIT_SETS = {
    1: { title: "Hello!", categories: ["greetings"] },
    2: { title: "How are you?", categories: ["feelings"] },
    3: { title: "How many?", categories: ["numbers"] },
    4: { title: "I like blue.", categories: ["colours", "sports", "food", "vegetables", "fruit"] },
    5: { title: "What do you like?", categories: ["stationery"], status: "rebuild-needed" },
    6: { title: "ALPHABET", categories: ["alphabet"], status: "data-needed" },
    7: { title: "This is for you.", categories: [], status: "data-needed" },
    8: { title: "What’s this?", categories: [], status: "data-needed" },
    9: { title: "Who are you?", categories: [], status: "data-needed" }
  };

  function cloneCards(cards) {
    return cards.map(card => ({
      ...card,
      visual: card.visual ? { ...card.visual } : undefined
    }));
  }

  function getCategory(name) {
    return cloneCards(CATEGORIES[name] || []);
  }

  function getUnitCards(unitNumber) {
    const unit = UNIT_SETS[unitNumber];
    if (!unit) return [];
    return unit.categories.flatMap(name => getCategory(name));
  }

  function getImageSheet(name) {
    const sheet = IMAGE_SHEETS[name];
    return sheet ? { ...sheet, src: assetUrl(sheet.file) } : null;
  }

  global.LETS_TRY_DATA = Object.freeze({
    version: 1,
    imageSheets: IMAGE_SHEETS,
    categories: CATEGORIES,
    units: UNIT_SETS,
    assetUrl,
    sprite,
    getCategory,
    getUnitCards,
    getImageSheet
  });
})(window);
