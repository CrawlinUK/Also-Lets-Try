# Master category and unit map

The machine-readable source is `js/lets-try-data.js`.

## Tag-driven unit rule

Each vocabulary item may have one or more `defaultIn` tags:

```js
item("finland", ["1-1"])
item("china", ["1-1", "2-1"])
item("sausage")
```

A tag uses `book-unit` notation:

- `1-1` = Let’s Try! 1, Unit 1
- `2-7` = Let’s Try! 2, Unit 7

When a unit opens:

1. The master data scans all categories for that unit tag.
2. If a category contains at least one matching tag, the whole category is available in Settings.
3. Items carrying the tag are selected by default.
4. Untagged items in that category remain optional extras.

This means unit definitions no longer repeat category names or default word lists.

## Visual asset rule

Vocabulary membership and physical image location are separate.

Examples:

- sausage belongs to Food but is physically stored in `fruit.png`
- flags are stored in one shared SVG sprite
- numbers and alphabet are text, not bitmap images
- colours have shared hex values in the Colours category; colour splodges are generated where needed
- shapes use the seven individual SVG files in `images/shapes/`

## Existing shared image assets

- `images/flags.svg` — 16 vector flags
- `images/emotions.jpg` — feelings
- `images/foods.png` — food/drink sheet
- `images/fruit.png` — 11 fruits + sausage
- `images/veg.png` — 9 vegetables
- `images/sports.png` — 12 sports pictures; seven names currently mapped
- `images/stationary.png` — 12 stationery pictures
- `images/shapes/` — circle, triangle, square, rectangle, heart, diamond and star SVGs; mapped to the Shapes category
- `images/Adjectives.png` — 8 describing-word pictures in a 4 × 2 sheet; mapped
- `images/BodyParts.png` — 8 body-part pictures in a 4 × 2 sheet; mapped
- `images/animals.jpg` — 17 animal pictures; exact grid/cell order still to verify
- `images/days.png` — 7 day icons + 1 empty cell in a 4 × 2 sheet; mapped
- `images/sports_original.png` — reference copy

## Book 1 / Book 2 source artwork still to integrate

Animals, body parts, describing words and days now have shared image sheets in GitHub. The animal sheet still needs its exact grid/cell order verified before it is wired into units.

Exact picture-only source files already exist in `AllImages.zip` for:

- tree
- weather
- clothes
- play activities
- daily-time cards
- most school places
- most daily-routine cards

Exact source images still need resolving for:

- school nurse’s office
- wake up
- have breakfast
- dream a wonderful dream

Close reusable sources exist for all four:
`schoolnurse`, `wakeuptime`, `breakfast` / `breakfasttime`, and `dreamtime`.


## LT1 Unit 7

LT1 Unit 7 uses the seven Shapes as its flashcard deck. Number (1–5) and colour are live shape modifiers rather than separate flashcards. Each shape remembers its own colour assignment; the rainbow control randomises all seven to different colours. The colour tower uses the shared Colours category, including brown, orange, gray, light blue and light green. Five copies use a domino-five layout.
