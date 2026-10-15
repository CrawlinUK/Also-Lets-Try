# Vocabulary database: current structure and planned editor

## Where the data lives today

The current database is ordinary JavaScript, not SQL or JSON yet:

- `js/lets-try-data.js` contains vocabulary records, category labels,
  textbook default tags, image sheets, sprite-cell positions and the
  canonical `getWordVisual(categoryId, itemId)` resolver.
- `js/lets-try-card-factory.js` turns a category's records into flashcards.
  It can select **all**, **none**, or **tagged** words by default. It also
  supports category lists, a unit grammar template containing `[word]`,
  and optional named word forms (for example, `grammarForm: "like"`).
- `config/categories.js` uses the shared card generator for six
  standalone category decks (World Greetings, Greetings, Feelings, Sports,
  Food & Drink, Fruit).
- `config/units/lt1-unit5.js` is now a **declarative** unit containing
  only settings, categories (`sports`, `food`, `fruit`) and the grammar form.
  `js/lets-try-unit-loader.js` automatically creates its card list.
- `config/units/lt1-unit1.js`, `lt1-unit2.js` and `lt2-unit1.js`
  also use the shared generator. Other units still have bespoke card-building
  logic and must be migrated carefully.
- `vocabulary-viewer.html` is the first stage of the image calibration editor.
  It uses `getWordVisual` plus the central sprite sheet `cellAspectRatio` to
  preview the actual physical cell geometry rather than forcing square crops.
  Position, scale, flip and top-crop edits are local to the open tab. The
  **Export changes (.txt)** button downloads proposed changes for review;
  it does not update GitHub or the lesson pages.
- `tests/vocabulary-data.test.js` checks mapped images, category decks,
  default selections and the optional Unit 4 clocks.

To run the checks on a local checkout with Node.js installed:

```sh
node tests/vocabulary-data.test.js
```

## Invariants that future edits must preserve

1. A word keeps a stable category-qualified ID (for example,
   `sports/baseball`). Reordering categories must not silently change
   its identity.
2. Image filenames and sprite positioning are defined centrally. Unit
   configurations should not contain a separate copy.
3. Textbook tags such as `1-1` select default words **within** a
   chosen category; untagged words in that category remain selectable.
4. Category pages select every word by default.
5. Unit grammar and sentence variants remain separate from the shared
   word definition. A word may provide named forms, e.g.
   `forms: { like: "strawberries" }`, and a unit may select that form with
   `grammarForm: "like"`. The default `[word]` displays the ordinary word.
6. The unit card generator must not change student-facing wording,
   default selections or picture appearance during migration.

## Planned final format

Move vocabulary records, artwork mappings and book/unit definitions into
versioned JSON files only after the shared generator supports the existing
units without exceptions. Example *target* layout (not created yet):

```text
data/
  categories/
    sports.json
    food.json
    feelings.json
  images/
    sprite-sheets.json
  books/
    lt1.json
    lt2.json
js/
  lets-try-data-loader.js
  lets-try-card-factory.js
vocabulary-viewer.html
```

The image calibration editor already previews and exports proposed artwork
mapping changes. It still needs support for editing vocabulary text,
showing all uses of a word, and validating proposed changes against the
classroom renderer. Exporting a text file is safe on GitHub Pages because
it does not write remotely. Publishing edits directly will require
either exporting validated JSON and committing it manually or connecting
an authenticated, appropriately restricted GitHub save workflow.
Never embed an access token or write credentials into publicly served
JavaScript.

A SQL database is not necessary for this architecture. JSON provides a
portable, inspectable starting point and can later be imported into SQL
if user accounts or simultaneous editing justify it.
