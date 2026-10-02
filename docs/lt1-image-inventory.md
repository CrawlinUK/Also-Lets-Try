# Let’s Try! 1 image/data inventory

The shared source of truth for vocabulary and image mappings is:

`js/lets-try-data.js`

## Current image assets

| Asset | Purpose | State |
|---|---|---|
| `images/flags.png` | Unit 1 greetings / countries | Mapped |
| `images/emotions.jpg` | Unit 2 feelings | Mapped |
| `images/sports.png` | Sports sprite sheet | Mapped (all 12 cells) |
| `images/foods.png` | Unit 4 food | Mapped |
| `images/fruit.png` | Fruit + sausage sprite sheet | Mapped (all 12 cells) |
| `images/veg.png` | Vegetable sprite sheet | Mapped (all 9 cells) |
| `images/stationary.png` | Stationery sprite sheet | Uploaded; mapping still to reconstruct |
| `images/sports_original.png` | Original/reference sports sheet | Reference only |

## No bitmap file required

- Unit 3 numbers are text.
- Unit 4 colours are generated programmatically.

## Next work

- Reconstruct the twelve stationery card definitions and their final crop/position corrections.
- Complete Let’s Try! 1 vocabulary/image sets for Units 6–9 from the textbook/master list.
- After checking the shared data against the current working units, migrate Units 1–4 so their duplicated card/image definitions can be removed.

## Rule going forward

Once a category has moved into `js/lets-try-data.js`, sprite positions and image filenames should not be duplicated in individual unit HTML files. Fixing an image alignment should then require one change only.
