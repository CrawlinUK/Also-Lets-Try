/*
  LET'S TRY! SHARED MASTER DATA
  =============================
  Book-independent vocabulary/category definitions plus Let’s Try! 1 and 2
  unit presets.

  Important model:
  - categories = the full vocabulary teachers may choose from.
  - unit categories = categories available to that unit.
  - defaults = the textbook words selected when the unit first opens.
  - assets = where existing shared image sheets live.
  - physical image-sheet membership does NOT define logical category membership.
    Example: sausage is physically on fruit.png but logically belongs to Food.

  Unit 1 now loads this master data directly. Other live units remain unchanged
  while their category data is verified.
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

  const numberWords = [
    0,1,2,3,4,5,6,7,8,9,10,
    11,12,13,14,15,16,17,18,19,20,
    30,40,50,60,70,80,90,100
  ].map(n => String(n));

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const CATEGORIES = {
    worldGreetings: {
      label: "World greetings",
      items: [
        "finland","china","germany","japan","kenya","india","korea","usa","australia",
        "russia","saudi-arabia","indonesia","new-zealand","brazil"
      ],
      entries: {
        finland:        { greeting: "Terve",              country: "Finland" },
        china:          { greeting: "Nǐ hǎo",             country: "China" },
        germany:        { greeting: "Guten Tag",          country: "Germany" },
        japan:          { greeting: "Konnichiwa",         country: "Japan" },
        kenya:          { greeting: "Jambo",              country: "Kenya" },
        india:          { greeting: "Namaste",            country: "India" },
        korea:          { greeting: "Annyeonghaseyo",     country: "Korea" },
        usa:            { greeting: "Hello",              country: "USA" },
        australia:      { greeting: "Hello",              country: "Australia" },
        russia:         { greeting: "Zdravstvuyte",       country: "Russia" },
        "saudi-arabia": { greeting: "As-salamu alaykum",  country: "Saudi Arabia" },
        indonesia:      { greeting: "Selamat siang",      country: "Indonesia" },
        "new-zealand":  { greeting: "Hello",              country: "New Zealand" },
        brazil:         { greeting: "Boa tarde",          country: "Brazil" }
      }
    },

    englishGreetings: {
      label: "Greetings",
      items: [
        "hello","hi","good-morning","good-afternoon","good-night",
        "goodbye","see-ya","see-you-later"
      ]
    },

    feelings: {
      label: "Feelings",
      items: ["happy","tired","hungry","sleepy","sad","fine","good","great","wonderful"]
    },

    numbers: {
      label: "Numbers",
      generated: true,
      items: numberWords
    },

    colours: {
      label: "Colours",
      items: [
        "red","pink","yellow","blue","light-blue","green","light-green",
        "orange","purple","black","white","brown","gray"
      ]
    },

    sports: {
      label: "Sports",
      expectedImageSheetCount: 12,
      status: "partial-name-map",
      items: [
        "baseball","dodgeball","soccer","basketball","swimming",
        "table-tennis","volleyball"
      ],
      note: "The current sports.png contains 12 pictures. Seven textbook sport names are verified; five remaining sheet items still need identification."
    },

    food: {
      label: "Food & drink",
      items: [
        "ice-cream","pudding","milk","orange-juice","hamburger","pizza",
        "spaghetti","sushi","steak","salad","cake","egg","jam","noodle",
        "rice-ball","sausage"
      ],
      note: "Sausage is logically Food although its current sprite cell is physically in fruit.png."
    },

    fruit: {
      label: "Fruit",
      items: [
        "apple","strawberry","grapes","orange","pineapple","peach",
        "melon","banana","kiwi-fruit","lemon","cherry"
      ],
      expectedImageSheetCount: 12,
      note: "fruit.png has eleven fruit pictures plus one sausage cell."
    },

    vegetables: {
      label: "Vegetables",
      items: [
        "onion","green-pepper","cucumber","carrot","tomato",
        "cabbage","corn","mushroom","potato"
      ],
      expectedImageSheetCount: 9
    },

    alphabet: {
      label: "Alphabet",
      generated: true,
      items: alphabet
    },

    shapes: {
      label: "Shapes",
      items: ["circle","triangle","square","rectangle","heart","diamond","star"]
    },

    animals: {
      label: "Animals",
      items: [
        "cat","panda","bear","spider","elephant","mouse","cow","tiger",
        "rabbit","dragon","snake","horse","sheep","monkey","chicken","dog","wild-boar"
      ]
    },

    nature: {
      label: "Nature",
      items: ["tree"]
    },

    bodyParts: {
      label: "Body parts",
      items: ["head","shoulders","knees","toes","ears","eyes","mouth","nose"]
    },

    describingWords: {
      label: "Describing words",
      items: ["long","short","big","small","scary","furry","round","shiny"]
    },

    weather: {
      label: "Weather",
      items: ["sunny","cloudy","rainy","snowy","hot","cold"]
    },

    clothes: {
      label: "Clothes",
      items: ["shorts","shirt","pants","jacket","boots","cap"]
    },

    playActivities: {
      label: "Play activities",
      items: ["play-tag","play-cards","play-dodgeball","make-a-snowman"]
    },

    days: {
      label: "Days",
      items: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    },

    dailyTimes: {
      label: "Daily times",
      items: [
        "wake-up-time","breakfast-time","study-time","lunch-time","homework-time",
        "snack-time","bath-time","dinner-time","bed-time","dream-time"
      ]
    },

    stationery: {
      label: "Stationery",
      items: [
        "pencil","eraser","pencil-case","ruler","glue-stick","pen",
        "marker","calendar","notebook","stapler","magnet","pencil-sharpener"
      ],
      expectedImageSheetCount: 12
    },

    schoolPlaces: {
      label: "School places",
      items: [
        "library","teachers-office","school-principals-office","school-nurses-office",
        "lunch-room","cooking-room","classroom","restroom","entrance","school-office",
        "computer-room","music-room","arts-and-crafts-room","science-room","gym","playground"
      ]
    },

    dailyRoutine: {
      label: "Daily routine",
      items: [
        "wake-up","wash-my-face","brush-my-teeth","put-away-my-futon","have-breakfast",
        "check-my-school-bag","leave-my-house","take-out-the-garbage","go-to-school",
        "go-home","do-my-homework","finish-my-dinner","dream-a-wonderful-dream"
      ]
    }
  };

  const ASSETS = {
    sheets: {
      flags: {
        file: "images/flags.svg",
        grid: "4x4",
        backgroundSize: "400% 400%",
        physicalCells: 16,
        logicalCategories: ["worldGreetings"],
        status: "mapped",
        note: "Source artwork: lipis/flag-icons (MIT). Includes LT1/LT2 flags plus UK and Philippines."
      },

      emotions: {
        file: "images/emotions.jpg",
        grid: "4x2",
        logicalCategories: ["feelings"],
        status: "mapped"
      },

      foods: {
        file: "images/foods.png",
        grid: "4x4",
        logicalCategories: ["food"],
        status: "mapped",
        note: "Contains a second milk picture as a physical duplicate."
      },

      fruit: {
        file: "images/fruit.png",
        grid: "3x4",
        physicalCells: 12,
        logicalCategories: ["fruit","food"],
        status: "partial-cell-map",
        note: "11 fruit + sausage. Sausage belongs to Food."
      },

      vegetables: {
        file: "images/veg.png",
        grid: "3x3",
        physicalCells: 9,
        logicalCategories: ["vegetables"],
        status: "partial-cell-map"
      },

      sports: {
        file: "images/sports.png",
        grid: "4x3",
        physicalCells: 12,
        logicalCategories: ["sports"],
        status: "partial-cell-map"
      },

      sportsOriginal: {
        file: "images/sports_original.png",
        purpose: "reference",
        status: "reference-only"
      },

      stationery: {
        file: "images/stationary.png",
        grid: "4x3",
        physicalCells: 12,
        logicalCategories: ["stationery"],
        status: "cell-map-to-verify",
        note: "Filename is intentionally stationary.png because that is the uploaded asset name."
      }
    },

    knownCells: {
      flags: {
        australia: "0% 0%",
        brazil: "33.333% 0%",
        china: "66.667% 0%",
        finland: "100% 0%",
        germany: "0% 33.333%",
        india: "33.333% 33.333%",
        indonesia: "66.667% 33.333%",
        japan: "100% 33.333%",
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
        swimming: "0% 50%"
      },

      vegetables: {
        onion: "0% 0%",
        "green-pepper": "50% 0%",
        cucumber: "100% 0%",
        carrot: "0% 50%"
      },

      fruit: {
        grapes: "0% 0%",
        orange: "50% 0%",
        pineapple: "100% 0%",
        peach: "0% 33.333%",
        melon: "50% 33.333%",
        banana: "100% 33.333%",
        "kiwi-fruit": "0% 66.667%",
        lemon: "50% 66.667%"
      }
    },

    generated: {
      numbers: "text",
      alphabet: "text",
      colours: "paint-splodge/vector",
      shapes: "vector-capable"
    }
  };

  const BOOKS = {
    lt1: {
      label: "Let’s Try! 1",
      units: {
        1: {
          title: "Hello!",
          categories: ["worldGreetings"],
          defaults: {
            worldGreetings: ["finland","china","germany","japan","kenya","india","korea","usa","australia"]
          }
        },

        2: {
          title: "How are you?",
          categories: ["feelings"],
          defaults: {
            feelings: ["happy","tired","hungry","sleepy","sad","fine"]
          }
        },

        3: {
          title: "How many?",
          categories: ["numbers"],
          defaults: {
            numbers: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]
          },
          supportWords: ["strawberry","apple","tomato"]
        },

        4: {
          title: "I like blue.",
          categories: ["colours","sports","food","vegetables","fruit"],
          defaults: {
            colours: ["red","yellow","blue","green","purple","orange","pink","brown","white","black"],
            sports: ["baseball","dodgeball","soccer","basketball","swimming"],
            food: ["ice-cream","pudding","milk","orange-juice"],
            vegetables: ["onion","green-pepper","cucumber","carrot"],
            fruit: []
          }
        },

        5: {
          title: "What do you like?",
          categories: ["sports","food","fruit","vegetables","colours"],
          defaults: {
            sports: ["table-tennis","volleyball"],
            food: ["hamburger","pizza","spaghetti","sushi","steak","salad","cake","egg","jam","noodle","rice-ball"],
            fruit: ["grapes","orange","pineapple","peach","melon","banana","kiwi-fruit","lemon"],
            vegetables: [],
            colours: []
          }
        },

        6: {
          title: "ALPHABET",
          categories: ["alphabet"],
          defaults: { alphabet }
        },

        7: {
          title: "This is for you.",
          categories: ["shapes","colours"],
          defaults: {
            shapes: ["circle","triangle","square","rectangle","heart","diamond","star"],
            colours: []
          }
        },

        8: {
          title: "What’s this?",
          categories: ["animals","nature"],
          defaults: {
            animals: ["cat","panda","bear","spider","elephant"],
            nature: ["tree"]
          }
        },

        9: {
          title: "Who are you?",
          categories: ["animals","bodyParts","describingWords"],
          reviewCategories: ["colours","shapes","numbers"],
          defaults: {
            animals: ["mouse","cow","tiger","rabbit","dragon","snake","horse","sheep","monkey","chicken","dog","wild-boar"],
            bodyParts: ["head","shoulders","knees","toes","ears","eyes","mouth","nose"],
            describingWords: ["long","short","big","small","scary","furry","round","shiny"]
          }
        }
      }
    },

    lt2: {
      label: "Let’s Try! 2",
      units: {
        1: {
          title: "Hello, world!",
          categories: ["worldGreetings"],
          defaults: {
            worldGreetings: [
              "russia","saudi-arabia","india","china","korea","japan",
              "kenya","indonesia","new-zealand","usa","brazil"
            ]
          },
          status: "greeting-transliterations-to-verify"
        },

        2: {
          title: "Let’s play cards.",
          categories: ["weather","clothes","playActivities"],
          defaults: {
            weather: ["sunny","cloudy","rainy","snowy","hot","cold"],
            clothes: ["shorts","shirt","pants","jacket","boots","cap"],
            playActivities: ["play-tag","play-cards","play-dodgeball","make-a-snowman"]
          }
        },

        3: {
          title: "I like Mondays.",
          categories: ["days"],
          defaults: {
            days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
          }
        },

        4: {
          title: "What time is it?",
          categories: ["dailyTimes"],
          defaults: {
            dailyTimes: [
              "wake-up-time","breakfast-time","study-time","lunch-time","homework-time",
              "snack-time","bath-time","dinner-time","bed-time","dream-time"
            ]
          },
          generatedTimePractice: true
        },

        5: {
          title: "Do you have a pen?",
          categories: ["stationery"],
          defaults: {
            stationery: [
              "pencil","eraser","pencil-case","ruler","glue-stick","pen",
              "marker","calendar","notebook","stapler","magnet","pencil-sharpener"
            ]
          }
        },

        6: {
          title: "Alphabet",
          categories: ["alphabet"],
          defaults: { alphabet }
        },

        7: {
          title: "What do you want?",
          categories: ["vegetables","fruit"],
          defaults: {
            vegetables: ["onion","mushroom","green-pepper","tomato","cabbage","corn","carrot","cucumber","potato"],
            fruit: ["melon","peach","banana","apple","pineapple","orange","strawberry","cherry","kiwi-fruit"]
          }
        },

        8: {
          title: "This is my favorite place.",
          categories: ["schoolPlaces"],
          defaults: {
            schoolPlaces: [
              "library","teachers-office","school-principals-office","school-nurses-office",
              "lunch-room","cooking-room","classroom","restroom","entrance","school-office",
              "computer-room","music-room","arts-and-crafts-room","science-room","gym","playground"
            ]
          }
        },

        9: {
          title: "This is my day.",
          categories: ["dailyRoutine"],
          defaults: {
            dailyRoutine: [
              "wake-up","wash-my-face","brush-my-teeth","put-away-my-futon","have-breakfast",
              "check-my-school-bag","leave-my-house","take-out-the-garbage","go-to-school",
              "go-home","do-my-homework","finish-my-dinner","dream-a-wonderful-dream"
            ]
          }
        }
      }
    }
  };

  function getCategory(id) {
    return CATEGORIES[id] || null;
  }

  function getUnit(bookId, unitNumber) {
    return BOOKS[bookId] && BOOKS[bookId].units[unitNumber]
      ? BOOKS[bookId].units[unitNumber]
      : null;
  }

  function getUnitDefaults(bookId, unitNumber) {
    const unit = getUnit(bookId, unitNumber);
    return unit ? unit.defaults : null;
  }

  function getUnitAvailableWords(bookId, unitNumber) {
    const unit = getUnit(bookId, unitNumber);
    if (!unit) return {};

    const result = {};
    unit.categories.forEach(categoryId => {
      result[categoryId] = CATEGORIES[categoryId]
        ? [...CATEGORIES[categoryId].items]
        : [];
    });
    return result;
  }

  global.LETS_TRY_DATA = Object.freeze({
    version: 2,
    assetUrl,
    categories: CATEGORIES,
    assets: ASSETS,
    books: BOOKS,
    getCategory,
    getUnit,
    getUnitDefaults,
    getUnitAvailableWords
  });
})(window);
