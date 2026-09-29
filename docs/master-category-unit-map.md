# Master category and unit map

This is the first verified working map built from **LT1book.zip**, **LT2book.zip**, **AllImages.zip**, the current GitHub image folder, and the existing working unit files.

The machine-readable version is `js/lets-try-data.js`.

## Core rule

A **category** owns its full vocabulary.

A **unit** does not own a separate vocabulary list. It references one or more categories and supplies a **default selected subset**. Teachers can then enable other words from those same categories in Settings.

The separate Categories section can use the complete category without any Let’s Try textbook preset.

Physical image-sheet membership is separate from logical category membership. For example, **sausage is physically stored in `fruit.png`, but belongs to the Food category**.

## Categories established so far

- World greetings
- English greetings
- Feelings
- Numbers
- Colours
- Sports
- Food & drink
- Fruit
- Vegetables
- Alphabet
- Shapes
- Animals
- Nature
- Body parts
- Describing words
- Weather
- Clothes
- Play activities
- Days
- Daily times
- Stationery
- School places
- Daily routine

## Let’s Try! 1 unit presets

| Unit | Categories available | Textbook/default selection |
|---|---|---|
| 1 — Hello! | World greetings | Current nine-country LT1 set |
| 2 — How are you? | Feelings | happy, tired, hungry, sleepy, sad, fine |
| 3 — How many? | Numbers | 1–20 |
| 4 — I like blue. | Colours, Sports, Food, Vegetables, Fruit | 10 textbook colours; 5 sports; ice cream, pudding, milk, orange juice; onion, green pepper, cucumber, carrot |
| 5 — What do you like? | Sports, Food, Fruit, Vegetables, Colours | table tennis, volleyball; hamburger through rice ball food set; grapes through lemon fruit set |
| 6 — ALPHABET | Alphabet | A–Z |
| 7 — This is for you. | Shapes, Colours | all 7 shapes |
| 8 — What’s this? | Animals, Nature | cat, panda, bear, spider, elephant; tree |
| 9 — Who are you? | Animals, Body parts, Describing words | 12 animal set; 8 body parts; 8 describing words |

LT1 Unit 9 also reviews colours, shapes and numbers; those are recorded separately as review categories rather than being mixed into its main defaults.

## Let’s Try! 2 unit presets

| Unit | Categories available | Textbook/default selection |
|---|---|---|
| 1 — Hello, world! | World greetings | Russia, Saudi Arabia, India, China, Korea, Japan, Kenya, Indonesia, New Zealand, USA, Brazil |
| 2 — Let’s play cards. | Weather, Clothes, Play activities | sunny/cloudy/rainy/snowy/hot/cold; 6 clothes; 4 play activities |
| 3 — I like Mondays. | Days | Monday–Sunday |
| 4 — What time is it? | Daily times | 10 daily-time cards plus generated clock practice |
| 5 — Do you have a pen? | Stationery | all 12 stationery cards |
| 6 — Alphabet | Alphabet | A–Z |
| 7 — What do you want? | Vegetables, Fruit | 9 vegetables; 9 textbook fruits |
| 8 — This is my favorite place. | School places | 16 school places |
| 9 — This is my day. | Daily routine | 13 daily-routine phrases |

## Existing GitHub image sheets

| File | Physical contents | Logical use | Mapping state |
|---|---:|---|---|
| `flags.png` | existing flag sheet | World greetings | LT1 mapped; LT2 expansion still to verify |
| `emotions.jpg` | 8 cells | Feelings | mapped |
| `foods.png` | 16 cells | Food & drink | mapped; one duplicate milk picture |
| `fruit.png` | 12 cells | 11 Fruit + 1 Food (sausage) | 8 cells currently mapped |
| `veg.png` | 9 cells | Vegetables | 4 cells currently mapped |
| `sports.png` | 12 cells | Sports | 5 cells currently mapped |
| `stationary.png` | 12 cells | Stationery | labels known; cell order still to verify |
| `sports_original.png` | reference | Sports | reference only |

## Confirmed full category counts from the current sheets

- Fruit: **11 fruits**, plus a physical sausage cell.
- Vegetables: **9**.
- Sports: **12**.
- Stationery: **12**, used by Let’s Try! 2 Unit 5.

## AllImages.zip

The supplied image library contains **1,262 PNG files representing 631 concepts**, with picture-only `_c.png` and picture-plus-English `_ce.png` variants.

For the web app, the picture-only `_c.png` source is the preferred starting point because the app can render text itself.

The source library already contains verified picture candidates for the major missing categories, including:

- LT1 animals, body parts and describing words
- LT2 weather, clothes and play activities
- LT2 stationery
- LT2 school places
- LT2 daily routine
- the complete 11-fruit and 9-vegetable vocabulary

## Still to resolve before generating new shared sheets

1. Identify the five remaining pictures/names in the current 12-cell `sports.png`.
2. Complete exact cell positions for all 12 cells in `fruit.png`, all 9 in `veg.png`, all 12 in `sports.png`, and all 12 in `stationary.png`.
3. Verify the English-readable greeting forms for the extra LT2 Unit 1 countries.
4. Decide which categories should intentionally include useful extras beyond both textbooks (for the standalone Categories section).
5. Build shared image sheets for categories not already represented in GitHub.

No live unit HTML has been switched to this data yet.
