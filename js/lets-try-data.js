/*
  LET'S TRY! SHARED MASTER DATA
  =============================
  Category-first vocabulary for Let’s Try! 1 and 2.

  Tag rule:
  - Each word may have defaultIn tags such as "1-1" or "2-7".
  - If any word in a category is tagged for a unit, that whole category becomes
    available to that unit.
  - Tagged words are selected by default.
  - Untagged words stay available as optional category extras.
  - Unit definitions therefore only need titles / special metadata; they do not
    repeat category names or default word lists.

  Visual assets are separate from vocabulary membership. A word may belong to
  one logical category while physically living on another sprite sheet.
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

  function item(id, defaultIn = [], extra = {}) {
    return { id, defaultIn, ...extra };
  }

  const CATEGORIES = {
    worldGreetings: {
      label: "World greetings",
      card: { wordField: "greeting", sentenceField: "country", alternateField: "country", teacherAnswerField: "country" },
      items: [
        item("finland", ["1-1"], { country: "Finland", greeting: "Terve" }),
        item("china", ["1-1", "2-1"], { country: "China", greeting: "Nihao" }),
        item("germany", ["1-1"], { country: "Germany", greeting: "Guten Tag" }),
        item("japan", ["1-1", "2-1"], { country: "Japan", greeting: "Konnichiwa" }),
        item("kenya", ["1-1", "2-1"], { country: "Kenya", greeting: "Jambo" }),
        item("india", ["1-1", "2-1"], { country: "India", greeting: "Namaste" }),
        item("korea", ["1-1", "2-1"], { country: "Korea", greeting: "Annyeonghaseyo" }),
        item("usa", ["1-1", "2-1"], { country: "USA", greeting: "Hello" }),
        item("australia", ["1-1"], { country: "Australia", greeting: "Hello" }),
        item("russia", ["2-1"], { country: "Russia", greeting: "Zdravstvuyte" }),
        item("saudi-arabia", ["2-1"], { country: "Saudi Arabia", greeting: "As-salamu alaykum" }),
        item("indonesia", ["2-1"], { country: "Indonesia", greeting: "Selamat siang" }),
        item("new-zealand", ["2-1"], { country: "New Zealand", greeting: "Hello" }),
        item("brazil", ["2-1"], { country: "Brazil", greeting: "Boa tarde" })
      ]
    },

    englishGreetings: {
      label: "Greetings",
      card: { textOnly: true },
      items: [
        item("hello"),
        item("hi"),
        item("good-morning"),
        item("good-afternoon"),
        item("good-night"),
        item("goodbye"),
        item("see-ya"),
        item("see-you-later")
      ]
    },

    feelings: {
      label: "Feelings",
      card: { grammar: "I’m [word]." },
      items: [
        item("happy", ["1-2"]),
        item("tired", ["1-2"]),
        item("hungry", ["1-2"]),
        item("sleepy", ["1-2"]),
        item("sad", ["1-2"]),
        item("fine", ["1-2"]),
        item("good"),
        item("great"),
        item("wonderful")
      ]
    },

    numbers: {
      label: "Numbers",
      generated: true,
      items: [
        item("0"),
        item("1", ["1-3"]), item("2", ["1-3"]), item("3", ["1-3"]), item("4", ["1-3"]), item("5", ["1-3"]),
        item("6", ["1-3"]), item("7", ["1-3"]), item("8", ["1-3"]), item("9", ["1-3"]), item("10", ["1-3"]),
        item("11", ["1-3"]), item("12", ["1-3"]), item("13", ["1-3"]), item("14", ["1-3"]), item("15", ["1-3"]),
        item("16", ["1-3"]), item("17", ["1-3"]), item("18", ["1-3"]), item("19", ["1-3"]), item("20", ["1-3"]),
        item("30"), item("40"), item("50"), item("60"), item("70"), item("80"), item("90"), item("100")
      ]
    },

    colours: {
      label: "Colours",
      items: [
        item("red", ["1-4"], { hex: "#E53935" }),
        item("pink", ["1-4"], { hex: "#F28AB2" }),
        item("yellow", ["1-4"], { hex: "#FFD928" }),
        item("blue", ["1-4"], { hex: "#27A7DF" }),
        item("green", ["1-4"], { hex: "#2DAA4F" }),
        item("orange", ["1-4"], { hex: "#F5A51B" }),
        item("purple", ["1-4"], { hex: "#A65AA6" }),
        item("black", ["1-4"], { hex: "#111111" }),
        item("white", ["1-4"], { hex: "#F8F8F4" }),
        item("brown", ["1-4"], { hex: "#A94D09" }),
        item("light-blue", [], { hex: "#8DDCF4" }),
        item("light-green", [], { hex: "#A9D96A" }),
        item("gray", [], { hex: "#9FA4A8" })
      ]
    },

    sports: {
      label: "Sports",
      expectedImageSheetCount: 12,
      status: "mapped",
      items: [
        item("baseball", ["1-4"]),
        item("dodgeball", ["1-4"]),
        item("soccer", ["1-4", "1-8"]),
        item("basketball", ["1-4"]),
        item("swimming", ["1-4"]),
        item("table-tennis", ["1-5", "1-8"]),
        item("volleyball", ["1-5"]),
        item("tennis"),
        item("badminton"),
        item("gymnastics"),
        item("cricket"),
        item("rugby")
      ],
      note: "sports.png contains 12 pictures, mapped left-to-right and top-to-bottom."
    },

    food: {
      label: "Food & drink",
      items: [
        item("ice-cream", ["1-4"]),
        item("pudding", ["1-4"]),
        item("milk", ["1-4", "1-8"]),
        item("orange-juice", ["1-4"]),
        item("hamburger", ["1-5"], { forms: { like: "hamburgers" } }),
        item("pizza", ["1-5"]),
        item("spaghetti", ["1-5"]),
        item("sushi", ["1-5"]),
        item("steak", ["1-5"]),
        item("salad", ["1-5", "1-8"]),
        item("cake", ["1-5"]),
        item("egg", ["1-5"], { forms: { like: "eggs" } }),
        item("jam", ["1-5"]),
        item("noodle", ["1-5"], { word: "noodles" }),
        item("rice-ball", ["1-5", "1-8"], { forms: { like: "rice balls" } }),
        item("sausage", [], { forms: { like: "sausages" } })
      ],
      note: "Sausage is logically Food although its current sprite cell is physically in fruit.png."
    },

    fruit: {
      label: "Fruit",
      expectedImageSheetCount: 12,
      items: [
        item("apple", ["1-8", "2-7"], { forms: { like: "apples" } }),
        item("strawberry", ["1-8", "2-7"], { forms: { like: "strawberries" } }),
        item("grapes", ["1-5", "1-8"]),
        item("orange", ["1-5", "1-8", "2-7"], { forms: { like: "oranges" } }),
        item("pineapple", ["1-5", "1-8", "2-7"], { forms: { like: "pineapples" } }),
        item("peach", ["1-5", "1-8", "2-7"], { forms: { like: "peaches" } }),
        item("melon", ["1-5", "2-7"], { forms: { like: "melons" } }),
        item("banana", ["1-5", "1-8", "2-7"], { forms: { like: "bananas" } }),
        item("kiwi-fruit", ["1-5", "2-7"]),
        item("lemon", ["1-5"], { forms: { like: "lemons" } }),
        item("cherry", ["2-7"], { forms: { like: "cherries" } })
      ],
      note: "fruit.png has eleven fruit pictures plus one sausage cell."
    },

    vegetables: {
      label: "Vegetables",
      expectedImageSheetCount: 9,
      items: [
        item("onion", ["1-4", "1-8", "2-7"]),
        item("green-pepper", ["1-4", "1-8", "2-7"]),
        item("cucumber", ["1-4", "1-8", "2-7"]),
        item("carrot", ["1-4", "1-8", "2-7"]),
        item("tomato", ["1-8", "2-7"]),
        item("cabbage", ["2-7"]),
        item("corn", ["2-7"]),
        item("mushroom", ["2-7"]),
        item("potato", ["2-7"])
      ]
    },

    alphabet: {
      label: "Alphabet",
      generated: true,
      items: [
        item("A", ["1-6", "2-6"]), item("B", ["1-6", "2-6"]), item("C", ["1-6", "2-6"]),
        item("D", ["1-6", "2-6"]), item("E", ["1-6", "2-6"]), item("F", ["1-6", "2-6"]),
        item("G", ["1-6", "2-6"]), item("H", ["1-6", "2-6"]), item("I", ["1-6", "2-6"]),
        item("J", ["1-6", "2-6"]), item("K", ["1-6", "2-6"]), item("L", ["1-6", "2-6"]),
        item("M", ["1-6", "2-6"]), item("N", ["1-6", "2-6"]), item("O", ["1-6", "2-6"]),
        item("P", ["1-6", "2-6"]), item("Q", ["1-6", "2-6"]), item("R", ["1-6", "2-6"]),
        item("S", ["1-6", "2-6"]), item("T", ["1-6", "2-6"]), item("U", ["1-6", "2-6"]),
        item("V", ["1-6", "2-6"]), item("W", ["1-6", "2-6"]), item("X", ["1-6", "2-6"]),
        item("Y", ["1-6", "2-6"]), item("Z", ["1-6", "2-6"])
      ]
    },

    shapes: {
      label: "Shapes",
      // One set of practice options for both the standalone category and
      // Let's Try! 1 Unit 7. Classroom controls read this shared profile.
      shapePractice: {
        colourCategoryId: "colours",
        counts: [1, 2, 3, 4, 5],
        defaultColours: {
          circle: "purple",
          triangle: "green",
          square: "red",
          rectangle: "white",
          heart: "pink",
          diamond: "blue",
          star: "yellow"
        },
        colourOrder: [
          "green", "black", "blue", "yellow", "purple", "pink", "red", "white",
          "orange", "brown", "light-blue", "light-green", "gray"
        ]
      },
      items: [
        item("circle", ["1-7"]),
        item("triangle", ["1-7"]),
        item("square", ["1-7"]),
        item("rectangle", ["1-7"]),
        item("heart", ["1-7"]),
        item("diamond", ["1-7"]),
        item("star", ["1-7"])
      ]
    },

    animals: {
      label: "Animals",
      items: [
        item("cat", ["1-8"]), item("panda", ["1-8"]), item("bear"),
        item("spider", ["1-8"]), item("elephant", ["1-8"]),
        item("mouse", ["1-8", "1-9"]), item("cow", ["1-9"]), item("tiger", ["1-8", "1-9"]),
        item("rabbit", ["1-8", "1-9"]), item("dragon", ["1-9"]), item("snake", ["1-9"]),
        item("horse", ["1-9"]), item("sheep", ["1-9"]), item("monkey", ["1-8", "1-9"]),
        item("chicken", ["1-9"]), item("dog", ["1-8", "1-9"]), item("wild-boar", ["1-9"]),
        item("crow", ["1-8"]), item("moth", ["1-8"]), item("owl", ["1-8"]),
        item("starfish", ["1-8"]), item("jellyfish", ["1-8"]), item("seahorse", ["1-8"])
      ],
      note: "Bear appears on the source word-card sheet but is not in the requested LT1 Unit 8 deck."
    },

    nature: {
      label: "Nature",
      items: [item("tree", ["1-8"])]
    },

    bodyParts: {
      label: "Body parts",
      items: [
        item("head", ["1-9"]), item("shoulders", ["1-9"]), item("knees", ["1-9"]), item("toes", ["1-9"]),
        item("ears", ["1-9"]), item("eyes", ["1-9"]), item("mouth", ["1-9"]), item("nose", ["1-9"])
      ]
    },

    describingWords: {
      label: "Describing words",
      items: [
        item("long", ["1-9"]), item("short", ["1-9"]), item("big", ["1-9"]), item("small", ["1-9"]),
        item("scary", ["1-9"]), item("furry", ["1-9"]), item("round", ["1-9"]), item("shiny", ["1-9"])
      ]
    },

    weather: {
      label: "Weather",
      items: [
        item("sunny", ["2-2"]), item("cloudy", ["2-2"]), item("rainy", ["2-2"]),
        item("snowy", ["2-2"]), item("hot", ["2-2"]), item("cold", ["2-2"])
      ]
    },

    clothes: {
      label: "Clothes",
      items: [
        item("shorts", ["2-2"]), item("shirt", ["2-2"]), item("pants", ["2-2"]),
        item("jacket", ["2-2"]), item("boots", ["2-2"]), item("cap", ["2-2"])
      ]
    },

    playActivities: {
      label: "Play activities",
      items: [
        item("play-tag", ["2-2"]), item("play-cards", ["2-2"]),
        item("play-dodgeball", ["2-2"]), item("make-a-snowman", ["2-2"])
      ]
    },

    days: {
      label: "Days",
      items: [
        item("Monday", ["2-3"]), item("Tuesday", ["2-3"]), item("Wednesday", ["2-3"]),
        item("Thursday", ["2-3"]), item("Friday", ["2-3"]), item("Saturday", ["2-3"]), item("Sunday", ["2-3"])
      ]
    },

    dailyTimes: {
      label: "Daily times",
      items: [
        item("wake-up-time", ["2-4"]), item("breakfast-time", ["2-4"]), item("study-time", ["2-4"]),
        item("lunch-time", ["2-4"]), item("homework-time", ["2-4"]), item("snack-time", ["2-4"]),
        item("bath-time", ["2-4"]), item("dinner-time", ["2-4"]), item("bed-time", ["2-4"]),
        item("dream-time", ["2-4"])
      ]
    },

    clockTimes: {
      label: "Clock times",
      items: [
        item("1-oclock", ["2-4"]), item("2-oclock", ["2-4"]), item("3-oclock", ["2-4"]), item("4-oclock", ["2-4"]), item("5-oclock", ["2-4"]), item("6-oclock", ["2-4"]), item("7-oclock", ["2-4"]), item("8-oclock", ["2-4"]), item("9-oclock", ["2-4"]), item("10-oclock", ["2-4"]), item("11-oclock", ["2-4"]), item("12-oclock", ["2-4"])
      ]
    },

    stationery: {
      label: "Stationery",
      expectedImageSheetCount: 12,
      items: [
        item("pencil", ["2-5"]), item("eraser", ["2-5"]), item("pencil-case", ["2-5"]),
        item("ruler", ["2-5"]), item("glue-stick", ["2-5"]), item("pen", ["2-5"]),
        item("marker", ["2-5"]), item("calendar", ["2-5"]), item("notebook", ["2-5"]),
        item("stapler", ["2-5"]), item("magnet", ["2-5"]), item("pencil-sharpener", ["2-5"])
      ]
    },

    schoolPlaces: {
      label: "School places",
      items: [
        item("library", ["2-8"]), item("teachers-office", ["2-8"]),
        item("school-principals-office", ["2-8"]), item("school-nurses-office", ["2-8"]),
        item("lunch-room", ["2-8"]), item("cooking-room", ["2-8"]), item("classroom", ["2-8"]),
        item("restroom", ["2-8"]), item("entrance", ["2-8"]), item("school-office", ["2-8"]),
        item("computer-room", ["2-8"]), item("music-room", ["2-8"]),
        item("arts-and-crafts-room", ["2-8"]), item("science-room", ["2-8"]),
        item("gym", ["2-8"]), item("playground", ["2-8"])
      ]
    },

    dailyRoutine: {
      label: "Daily routine",
      items: [
        item("wake-up", ["2-9"]), item("wash-my-face", ["2-9"]), item("brush-my-teeth", ["2-9"]),
        item("put-away-my-futon", ["2-9"]), item("have-breakfast", ["2-9"]),
        item("check-my-school-bag", ["2-9"]), item("leave-my-house", ["2-9"]),
        item("take-out-the-garbage", ["2-9"]), item("go-to-school", ["2-9"]),
        item("go-home", ["2-9"]), item("do-my-homework", ["2-9"]),
        item("finish-my-dinner", ["2-9"]), item("dream-a-wonderful-dream", ["2-9"])
      ]
    }
  };

  const ASSETS = {
    sheets: {
      timeActivities: {
        file: "images/TimeActivities.webp",
        cellAspectRatio: "1 / 1",
        cellMap: "dailyTimes",
        backgroundSize: "500% 200%", grid: "5x2", physicalCells: 10,
        logicalCategories: ["dailyTimes"], status: "mapped"
      },
      clocks: {
        file: "images/clocks.svg",
        cellAspectRatio: "1 / 1",
        cellMap: "clockTimes",
        backgroundSize: "400% 300%", grid: "4x3", physicalCells: 12,
        logicalCategories: ["clockTimes"], status: "mapped"
      },
      flags: {
        file: "images/flags.svg",
        cellAspectRatio: "4 / 3",
        grid: "4x4",
        backgroundSize: "400% 400%",
        physicalCells: 16,
        logicalCategories: ["worldGreetings"],
        status: "mapped",
        note: "Source artwork: lipis/flag-icons (MIT). Includes LT1/LT2 flags plus UK and Philippines."
      },

      emotions: {
        file: "images/emotions.webp",
        cellAspectRatio: "2 / 3",
        backgroundSize: "400% 200%",
        grid: "4x2",
        logicalCategories: ["feelings"],
        status: "mapped"
      },

      foods: {
        file: "images/foods.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "400% 400%",
        grid: "4x4",
        logicalCategories: ["food"],
        status: "mapped",
        note: "Contains a second milk picture as a physical duplicate."
      },

      fruit: {
        file: "images/fruit.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "300% 400%",
        grid: "3x4",
        physicalCells: 12,
        logicalCategories: ["fruit","food"],
        status: "mapped",
        note: "11 fruit + sausage. Sausage belongs to Food."
      },

      vegetables: {
        file: "images/veg.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "300% 300%",
        grid: "3x3",
        physicalCells: 9,
        logicalCategories: ["vegetables"],
        status: "mapped"
      },

      sports: {
        file: "images/sports.webp",
        cellAspectRatio: "9 / 8",
        backgroundSize: "400% 300%",
        grid: "4x3",
        physicalCells: 12,
        logicalCategories: ["sports"],
        status: "mapped"
      },

      stationery: {
        file: "images/stationary.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "400% 300%",
        grid: "4x3",
        physicalCells: 12,
        logicalCategories: ["stationery"],
        status: "mapped",
        note: "Filename is stationary.webp (as uploaded). Cell map follows the physical sheet order."
      },

      adjectives: {
        file: "images/Adjectives.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "400% 200%",
        grid: "4x2",
        physicalCells: 8,
        logicalCategories: ["describingWords"],
        status: "mapped",
        note: "Row-major order: long, short, big, small, scary, furry, round, shiny."
      },

      bodyParts: {
        file: "images/BodyParts.webp",
        cellAspectRatio: "1 / 2",
        backgroundSize: "400% 200%",
        grid: "4x2",
        physicalCells: 8,
        logicalCategories: ["bodyParts"],
        status: "mapped",
        note: "Row-major order: head, shoulders, knees, toes, ears, eyes, mouth, nose."
      },

      animals: {
        file: "images/animals.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "600% 300%",
        grid: "6x3",
        physicalCells: 18,
        logicalCategories: ["animals"],
        status: "mapped",
        note: "6x3 WebP source sheet. Row 1: cat, mouse, horse, panda, cow, sheep; row 2: bear, tiger, monkey, spider, rabbit, chicken; row 3: elephant, dragon, dog, fish, snake, wild-boar."
      },

      animalsExtra: {
        file: "images/animals-extra.webp",
        cellAspectRatio: "1 / 1",
        sizeOverrides: { owl: "210% 315%" },
        backgroundSize: "200% 300%",
        grid: "2x3",
        physicalCells: 6,
        logicalCategories: ["animals"],
        status: "mapped",
        note: "Row-major: crow in nest, moth, owl on branch, starfish, jellyfish, seahorse."
      },

      days: {
        file: "images/days.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "400% 200%",
        grid: "4x2",
        physicalCells: 8,
        logicalCategories: ["days"],
        status: "mapped",
        note: "Seven day icons in Monday-Sunday order with one empty final cell."
      },

      weather: {
        file: "images/weather.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "300% 200%",
        grid: "3x2",
        physicalCells: 6,
        logicalCategories: ["weather"],
        status: "mapped",
        note: "Row-major: sunny, cloudy, rainy, snowy, hot, cold."
      },

      clothes: {
        file: "images/clothes.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "300% 200%",
        grid: "3x2",
        physicalCells: 6,
        logicalCategories: ["clothes"],
        status: "mapped",
        note: "Row-major: shorts, shirt, pants, jacket, boots, cap."
      },

      playActivities: {
        file: "images/activities.webp",
        cellAspectRatio: "1 / 1",
        backgroundSize: "200% 200%",
        grid: "2x2",
        physicalCells: 4,
        logicalCategories: ["playActivities"],
        status: "mapped",
        note: "Row-major: play tag, play cards, play dodgeball, make a snowman."
      }
    },

    knownCells: {
      dailyTimes: {
        "wake-up-time": "0% 0%", "breakfast-time": "25% 0%",
        "study-time": "50% 0%", "lunch-time": "75% 0%",
        "homework-time": "100% 0%", "snack-time": "0% 100%",
        "bath-time": "25% 100%", "dinner-time": "50% 100%",
        "bed-time": "75% 100%", "dream-time": "100% 100%"
      },
      clockTimes: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [
        (index + 1) + "-oclock",
        ["0%","33.333%","66.667%","100%"][index % 4] + " " + ["0%","50%","100%"][Math.floor(index / 4)]
      ])),
      // Physical 4×3 artwork order, independently verified against stationary.webp.
      // Do not infer sprite cells from the vocabulary display order.
      stationery: {
        pencil: "0% 0%",
        eraser: "33.333% 0%",
        "pencil-case": "66.667% 0%",
        ruler: "100% 0%",
        "glue-stick": "0% 50%",
        pen: "33.333% 50%",
        notebook: "66.667% 50%",
        calendar: "100% 50%",
        stapler: "0% 100%",
        "pencil-sharpener": "33.333% 100%",
        marker: "66.667% 100%",
        magnet: "100% 100%"
      },
      // Single source for the Feelings sprite cells, used by units and Categories.
      emotions: {
        happy: { position: "0% 0%", flip: false, cropTop: 0 },
        tired: { position: "64% 93%", flip: false, cropTop: 3 },
        hungry: { position: "96% 0%", flip: false, cropTop: 0 },
        sleepy: { position: "31% 93%", flip: false, cropTop: 0 },
        sad: { position: "0% 93%", flip: false, cropTop: 0 },
        fine: { position: "93% 93%", flip: true, cropTop: 3 },
        good: { position: "93% 93%", flip: false, cropTop: 3 },
        great: { position: "64% 0%", flip: false, cropTop: 0 },
        wonderful: { position: "33.3333% 0%", flip: false, cropTop: 0 }
      },

      flags: {
        australia: "0% 0%",
        brazil: "33.333% 0%",
        china: "66.667% 0%",
        finland: "100% 0%",
        germany: "0% 33.333%",
        india: "33.333% 33.333%",
        indonesia: "66.667% 33.333%",
        japan: "100% 33.45%",
        kenya: "0% 66.667%",
        korea: "33.333% 66.667%",
        "new-zealand": "66.667% 66.667%",
        russia: "100% 66.667%",
        "saudi-arabia": "0% 100%",
        usa: "33.333% 100%",
        "united-kingdom": "66.667% 100%",
        philippines: "100% 100%"
      },

      sports: {
        baseball: "0% 0%",
        dodgeball: "33.333% 0%",
        soccer: "66.667% 0%",
        basketball: "100% 0%",
        swimming: "0% 50%",
        "table-tennis": "33.333% 50%",
        volleyball: "66.667% 50%",
        tennis: "100% 50%",
        badminton: "0% 100%",
        gymnastics: "33.333% 100%",
        cricket: "66.667% 100%",
        rugby: "100% 100%"
      },

      vegetables: {
        onion: "0% 0%",
        "green-pepper": "50% 0%",
        cucumber: "100% 0%",
        carrot: "0% 50%",
        mushroom: "50% 50%",
        potato: "100% 50%",
        tomato: "0% 100%",
        cabbage: "50% 100%",
        corn: "100% 100%"
      },

      fruit: {
        grapes: "0% 0%",
        orange: "50% 0%",
        pineapple: "100% 0%",
        peach: "0% 33.333%",
        melon: "50% 33.333%",
        banana: "100% 33.333%",
        "kiwi-fruit": "0% 66.667%",
        lemon: "50% 66.667%",
        apple: "100% 66.667%",
        strawberry: "0% 100%",
        cherry: "50% 100%",
        sausage: "100% 100%"
      },

      foods: {
        "ice-cream": "0% 0%",
        pudding: "33.333% 0%",
        milk: "66.667% 0%",
        "orange-juice": "100% 0%",
        hamburger: "0% 33.333%",
        pizza: "33.333% 33.333%",
        spaghetti: "66.667% 33.333%",
        sushi: "100% 33.333%",
        steak: "0% 66.667%",
        salad: "33.333% 66.667%",
        cake: "66.667% 66.667%",
        egg: "100% 66.667%",
        jam: "0% 100%",
        noodle: "33.333% 100%",
        "rice-ball": "66.667% 100%",
        "milk-red": "100% 100%"
      },

      adjectives: {
        long: "0% 0%",
        short: "33.333% 0%",
        big: "66.667% 0%",
        small: "100% 0%",
        scary: "0% 100%",
        furry: "33.333% 100%",
        round: "66.667% 100%",
        shiny: "100% 100%"
      },

      bodyParts: {
        head: "0% 0%",
        shoulders: "33.333% 0%",
        knees: "66.667% 0%",
        toes: "100% 0%",
        ears: "0% 100%",
        eyes: "33.333% 100%",
        mouth: "66.667% 100%",
        nose: "100% 100%"
      },

      animals: {
        cat: "0% 0%",
        mouse: "20% 0%",
        horse: "40% 0%",
        panda: "60% 0%",
        cow: "80% 0%",
        sheep: "100% 0%",
        bear: "0% 50%",
        tiger: "20% 50%",
        monkey: "40% 50%",
        spider: "60% 50%",
        rabbit: "80% 50%",
        chicken: "100% 50%",
        elephant: "0% 100%",
        dragon: "20% 100%",
        dog: "40% 100%",
        fish: "60% 100%",
        snake: "80% 100%",
        "wild-boar": "100% 100%"
      },

      animalsExtra: {
        crow: "calc(0% + 0.22%) calc(0% - 1.32%)",
        moth: "100% 0%",
        owl: "calc(0% + 2.42%) calc(50% - 3.52%)",
        starfish: "calc(100% - 0.22%) calc(50% - 4.4%)",
        jellyfish: "calc(0% + 5.94%) calc(100% - 4.84%)",
        seahorse: "calc(100% - 0.44%) calc(100% - 5.28%)"
      },

      days: {
        Monday: "0% 0%",
        Tuesday: "33.333% 0%",
        Wednesday: "66.667% 0%",
        Thursday: "100% 0%",
        Friday: "0% 100%",
        Saturday: "33.333% 100%",
        Sunday: "66.667% 100%"
      },

      weather: {
        sunny: "0% 0%",
        cloudy: "50% 0%",
        rainy: "100% 0%",
        snowy: "0% 100%",
        hot: "50% 100%",
        cold: "100% 100%"
      },

      clothes: {
        shorts: "0% 0%",
        shirt: "50% 0%",
        pants: "100% 0%",
        jacket: "0% 100%",
        boots: "50% 100%",
        cap: "100% 100%"
      },

      playActivities: {
        "play-tag": "0% 0%",
        "play-cards": "100% 0%",
        "play-dodgeball": "0% 100%",
        "make-a-snowman": "100% 100%"
      }
    },

    images: {
      nature: {
        tree: "images/nature/tree.png"
      }
    },

    vectors: {
      shapes: {
        circle: "images/shapes/circle.svg",
        triangle: "images/shapes/triangle.svg",
        square: "images/shapes/square.svg",
        rectangle: "images/shapes/rectangle.svg",
        heart: "images/shapes/heart.svg",
        diamond: "images/shapes/diamond.svg",
        star: "images/shapes/star.svg"
      }
    },

    generated: {
      numbers: "text",
      alphabet: "text",
      colours: "paint-splodge/vector"
    }
  };

  const ALPHABET_COLOURS = Object.freeze({
    palette: Object.freeze({
      orange: "#ff7a00",
      blue: "#2684ff",
      red: "#ef3340",
      yellow: "#ffd400",
      pink: "#ff66b3",
      brown: "#b07a45"
    }),
    uppercase: Object.freeze({
      A: "orange", H: "orange", J: "orange", K: "orange",
      B: "blue", C: "blue", D: "blue", E: "blue", G: "blue", P: "blue", T: "blue", V: "blue", Z: "blue",
      F: "red", L: "red", M: "red", N: "red", S: "red", X: "red",
      I: "yellow", Y: "yellow",
      Q: "pink", U: "pink", W: "pink",
      O: "brown", R: "brown"
    }),
    lowercase: Object.freeze({
      a: "red", e: "red", i: "red", o: "red", u: "red",
      b: "blue", d: "blue", g: "blue", j: "blue", l: "blue", m: "blue", n: "blue", r: "blue", v: "blue", w: "blue", y: "blue", z: "blue",
      c: "orange", f: "orange", h: "orange", k: "orange", p: "orange", q: "orange", s: "orange", t: "orange", x: "orange"
    })
  });

  function getAlphabetColourName(letter) {
    const value = String(letter || "");
    const map = value === value.toLowerCase() && value !== value.toUpperCase()
      ? ALPHABET_COLOURS.lowercase
      : ALPHABET_COLOURS.uppercase;
    return map[value] || null;
  }

  function getAlphabetColour(letter) {
    const name = getAlphabetColourName(letter);
    return name ? ALPHABET_COLOURS.palette[name] || null : null;
  }

  const EXTRA_GAMES = Object.freeze({
    registry: Object.freeze({
      alphabetBoard: Object.freeze({
        name: "Alphabet Board",
        path: "games/alphabet-board.html",
        categories: Object.freeze(["alphabet"]),
        description: "Shuffle, hide and reveal letters for alphabet practice."
      }),
      numberRoller: Object.freeze({
        name: "Number Roller",
        path: "games/number-roller.html",
        categories: Object.freeze(["numbers"]),
        description: "Roll through numbers, switch to dot groups, or choose a random number."
      }),
      colourShapeRoller: Object.freeze({
        name: "Colour & Shape Roller",
        path: "games/colour-shape-roller.html",
        categories: Object.freeze(["shapes"]),
        description: "Roll a random colour-and-shape combination."
      }),
      numberColourShapeRoller: Object.freeze({
        name: "Number, Colour & Shape Roller",
        path: "games/number-colour-shape-roller.html",
        categories: Object.freeze(["numbers", "colours", "shapes"]),
        description: "Roll one colour-and-shape combination with one to five matching shapes.",
        additionalOnly: true
      })
    }),

    byCategory: Object.freeze({
      alphabet: Object.freeze(["alphabetBoard"]),
      numbers: Object.freeze(["numberRoller"]),
      colours: Object.freeze([]),
      shapes: Object.freeze(["colourShapeRoller"])
    })
  });

  function getColourValue(id) {
    const entry = getItem("colours", id);
    return entry && entry.hex ? entry.hex : null;
  }

  function getExtraGame(id) {
    const game = EXTRA_GAMES.registry[id];
    return game
      ? { id, ...game, url: assetUrl(game.path) }
      : null;
  }

  function getExtraGamesForCategories(categoryIds = []) {
    const ids = [];
    categoryIds.forEach((categoryId) => {
      (EXTRA_GAMES.byCategory[categoryId] || []).forEach((gameId) => {
        if (!ids.includes(gameId)) ids.push(gameId);
      });
    });
    return ids.map(getExtraGame).filter(Boolean);
  }

  function getAllExtraGames() {
    return Object.keys(EXTRA_GAMES.registry)
      .map(getExtraGame)
      .filter(Boolean);
  }

  function getExtraGamesPageUrl() {
    return assetUrl("games/index.html");
  }

  const BOOKS = {
    lt1: {
      label: "Let’s Try! 1",
      units: {
        1: { title: "Hello!" },
        2: { title: "How are you?" },
        3: { title: "How many?", supportWords: ["strawberry", "apple", "tomato"] },
        4: { title: "I like blue." },
        5: { title: "What do you like?" },
        6: { title: "ALPHABET" },
        7: { title: "This is for you." },
        8: { title: "What’s this?" },
        9: { title: "Who are you?", reviewCategories: ["colours", "shapes", "numbers"] }
      }
    },

    lt2: {
      label: "Let’s Try! 2",
      units: {
        1: { title: "Hello, world!", status: "greeting-transliterations-to-verify" },
        2: { title: "Let’s play cards." },
        3: { title: "I like Mondays." },
        4: { title: "What time is it?", generatedTimePractice: true },
        5: { title: "Do you have a pen?" },
        6: { title: "Alphabet" },
        7: { title: "What do you want?" },
        8: { title: "This is my favorite place." },
        9: { title: "This is my day." }
      }
    }
  };

  // Canonical artwork resolver used by textbook units, category decks and the viewer.
  // Some logical vocabulary categories share a physical image sheet.
  const CATEGORY_IMAGE_SHEETS = Object.freeze({
    worldGreetings: "flags", feelings: "emotions",
    sports: "sports", food: "foods", fruit: "fruit",
    vegetables: "vegetables", animals: "animals",
    bodyParts: "bodyParts", describingWords: "adjectives",
    days: "days", weather: "weather", clothes: "clothes",
    playActivities: "playActivities", stationery: "stationery",
    dailyTimes: "timeActivities", clockTimes: "clocks"
  });
  const EXTRA_ANIMAL_IMAGE_IDS = new Set([
    "crow", "moth", "owl", "starfish", "jellyfish", "seahorse"
  ]);

  function getWordVisual(categoryId, itemId) {
    const imagePath = ASSETS.images[categoryId] && ASSETS.images[categoryId][itemId];
    const vectorPath = ASSETS.vectors[categoryId] && ASSETS.vectors[categoryId][itemId];
    const standalonePath = imagePath || vectorPath;
    if (standalonePath) {
      // A shape's SVG can be recoloured and repeated by the shared classroom
      // renderer. Keep its standalone-file geometry for the database editor.
      if (categoryId === "shapes" && vectorPath) return {
        type: "shape-svg",
        shapeId: itemId,
        src: assetUrl(vectorPath),
        defaultColourName: CATEGORIES.shapes.shapePractice.defaultColours[itemId],
        aspectRatio: "1 / 1",
        size: "contain", position: "center",
        flip: false, cropTop: 0, cropRight: 0, cropBottom: 0, cropLeft: 0
      };
      return {
        src: assetUrl(standalonePath), size: "contain", position: "center",
        flip: false, cropTop: 0
      };
    }

    let sheetId = CATEGORY_IMAGE_SHEETS[categoryId];
    if (categoryId === "food" && itemId === "sausage") sheetId = "fruit";
    if (categoryId === "animals" && EXTRA_ANIMAL_IMAGE_IDS.has(itemId)) sheetId = "animalsExtra";
    const sheet = ASSETS.sheets[sheetId];
    const cellMapId = sheet?.cellMap || sheetId;
    const cell = ASSETS.knownCells[cellMapId] && ASSETS.knownCells[cellMapId][itemId];
    if (!sheet || !cell) return null;

    const properties = typeof cell === "string" ? { position: cell } : cell;
    return {
      src: assetUrl(sheet.file),
      size: sheet.sizeOverrides?.[itemId] || sheet.backgroundSize,
      aspectRatio: sheet.cellAspectRatio || "1 / 1",
      position: properties.position,
      flip: Boolean(properties.flip),
      cropTop: properties.cropTop || 0,
      cropRight: properties.cropRight || 0,
      cropBottom: properties.cropBottom || 0,
      cropLeft: properties.cropLeft || 0
    };
  }

  function getCategory(id) {
    return CATEGORIES[id] || null;
  }

  // Standalone Categories show what really has pictures in the master
  // mapping. Incomplete categories are usable as soon as ONE picture exists.
  // Textbook units still have access to every original vocabulary record.
  function getCategoryPictureItems(id) {
    const category = getCategory(id);
    if (!category || !Array.isArray(category.items)) return [];
    return category.items.filter(entry => Boolean(getWordVisual(id, entry.id)?.src));
  }

  function hasCategoryPictures(id) {
    return getCategoryPictureItems(id).length > 0;
  }

  function getItem(categoryId, itemId) {
    const category = getCategory(categoryId);
    return category
      ? category.items.find(entry => entry.id === itemId) || null
      : null;
  }

  function getUnit(bookId, unitNumber) {
    return BOOKS[bookId] && BOOKS[bookId].units[unitNumber]
      ? BOOKS[bookId].units[unitNumber]
      : null;
  }

  function getUnitKey(bookId, unitNumber) {
    const bookNumber = bookId === "lt1" ? "1" : bookId === "lt2" ? "2" : String(bookId);
    return `${bookNumber}-${unitNumber}`;
  }

  function getUnitCategoryIds(bookId, unitNumber) {
    const key = getUnitKey(bookId, unitNumber);
    return Object.entries(CATEGORIES)
      .filter(([, category]) =>
        category.items.some(entry => entry.defaultIn.includes(key))
      )
      .map(([categoryId]) => categoryId);
  }

  function getUnitDefaults(bookId, unitNumber) {
    const key = getUnitKey(bookId, unitNumber);
    const result = {};

    Object.entries(CATEGORIES).forEach(([categoryId, category]) => {
      const defaults = category.items
        .filter(entry => entry.defaultIn.includes(key))
        .map(entry => entry.id);

      if (defaults.length) result[categoryId] = defaults;
    });

    return result;
  }

  function getUnitAvailableWords(bookId, unitNumber) {
    const result = {};

    getUnitCategoryIds(bookId, unitNumber).forEach(categoryId => {
      result[categoryId] = CATEGORIES[categoryId].items.map(entry => entry.id);
    });

    return result;
  }

  global.LETS_TRY_DATA = Object.freeze({
    version: 19,
    assetUrl,
    categories: CATEGORIES,
    assets: ASSETS,
    books: BOOKS,
    alphabetColours: ALPHABET_COLOURS,
    extraGames: EXTRA_GAMES,
    getCategory,
    getCategoryPictureItems,
    hasCategoryPictures,
    getWordVisual,
    getItem,
    getUnit,
    getUnitKey,
    getUnitCategoryIds,
    getUnitDefaults,
    getUnitAvailableWords,
    getAlphabetColourName,
    getAlphabetColour,
    getColourValue,
    getExtraGame,
    getExtraGamesForCategories,
    getAllExtraGames,
    getExtraGamesPageUrl
  });
})(window);
