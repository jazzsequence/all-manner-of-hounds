# Transcription notes

`src/data/hounds.json` holds all 1,065 names. Roughly the first fifth (A through
early F) was transcribed by hand from the manuscript. The rest came out of
`src/data/raw.txt`, which is OCR output taken from a printed edition of the
list, and was recovered by `scripts/transcribe-raw.mjs`.

The script is kept around so the readings below can be checked and argued with.
It prints the F–Z portion of the data to stdout:

```sh
node scripts/transcribe-raw.mjs
```

## What the OCR did to the text

The edition is set in two columns, so a single line of `raw.txt` can hold one
entry from each column — `Garlik Juell` is two dogs, not one. Entries are put
back by splitting each line into a left and a right stream and reading each
page down the left column and then the right. Column and section headings
(`Houndis names`, `Braches names`, `Grey`, `Greybicches`) and the edition's
footnote markers are dropped.

Damage that could be undone without guessing:

| OCR | Reading | Example |
| --- | --- | --- |
| `vv`, `,v`, `\v`, `v.r`, `v.,`, `v./`, `v.l` | `w` | `Ha.yvvarde` → `Haywarde` |
| `I-I` | `H` | `I-Iun1ette` → `Humette` |
| `!` | `l` | `Oriel!` → `Oriell` |
| stray `.` | — | `Sa.ge` → `Sage` |
| `{ }` | — | `{Drynkall}` → `Drynkall` |

Angle brackets are left as carets, as elsewhere in the data: they are the
edition's expansions of scribal abbreviations, not OCR damage.

Everything else needed a judgement call, because the edition's broken type gave
the same OCR sequence for different letters:

| OCR | Stands for | Examples |
| --- | --- | --- |
| `l1` | `h` or `u` | `Cl1ilde` → `Childe`, `Hl1rle` → `Hurle` |
| `ll` | `h`, `u` or `n` | `Pllilomene` → `Philomene`, `Lllske` → `Luske`, `Pagellte` → `Pagente` |
| `1n`, `n1`, `rn` | `m` or `ru` | `Wisedo1ne` → `Wisedome`, `Cn1ell` → `Cruell` |
| `i1` | `n` | `Rai1gere` → `Rangere` |
| `t1` | `u` or `n` | `Qt1ester` → `Quester`, `Sclat1eyne` → `Sclaueyne` |
| `tm` | `wn` | `Queyntatmse` → `Queyntawnse` |
| `trr` | `ur` | `Ltrrdeyne` → `Lurdeyne` |
| trailing `aie` | `ale` | `Nytyngaie` → `Nytyngale` |

These are listed one by one in the `READINGS` table in the script rather than
applied as rules, since no rule gets them all right.

## Entries that are still guesses

The OCR for these was too badly broken to read with any confidence. The best
available option was recorded; the entries are marked `CONJECTURAL` in the
script's `READINGS` table, and anyone with access to the edition should replace
them.

`Asgudde`, `Avems`, `Awntms`, `Brente`, `Brym`, `Dowty`, `Goodynowe`,
`Jerownde`, `Jimosse`, `Malifawlte`, `Menaylus`, `Mowneraunt`, `Mowntayne`,
`Myneme`, `Neymys`, `Olifeme`, `Rossyngdale`, `Sowdiowre`, `Strecche-forthe`,
`Trunket`, `Vapuruawnt`, `Visemente`, `Watman`, `Wellawnde`, `Wellyfownde`,
`Whirre`

A handful more came through the mechanical rules cleanly enough to keep as-is,
but still read oddly and may well be wrong: `Bribtrr`, `Frowmwnde`,
`Gyrunownde`, `Gwmore`, `Lainprwi`, `Lodismfill`, `Lyllyrmore`, `Moremai`,
`Peete` (likely `Feete` — it sits in a run of F names), `Ryngebome`, `Thlewe`,
`Yevai`, `Yllkir`.

## Ordering

Names run in roughly the order the manuscript gives them, which is only roughly
alphabetical to begin with. For the OCR-derived portion the order is
approximate: recovering the exact sequence would mean knowing where each page of
the edition broke, and the OCR does not record that. The generator picks at
random, so this has no effect on the app.

## Yoghs

Some names use a character that looks like a numeral 3 — a
[yogh](https://sites.ualberta.ca/~sreimer/ms-course/course/eng-chrs.htm), which
is effectively the letter `g`. A first pass through the hand-transcribed portion
rendered these as `m`; they are written as `g` now. `Dere-ybowmt` became
`Dere-ybowgt`, which is the only one in that portion that a `g` makes sense of.
