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

Angle brackets are left as carets, as elsewhere in the data: the edition marks
a letter or two it wasn't fully certain of that way, and that's a real
ambiguity in the source, not OCR damage. Six entries carry this over from the
edition: `Mo<r>gan`, `R<e>lefe`, `Ri<s>chawde`, `Sel<w>de`, `Gal<aw>nte`,
`Wo<n>ell`.

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

The OCR for these was too broken to read with confidence. The least bad option
is recorded so the data has no obvious garbage in it, but every one is a guess.
They live in the `CONJECTURAL` table in `scripts/transcribe-raw.mjs`.

| OCR | Reading |
| --- | --- |
| `Asglldde` | Asgudde |
| `Aven1s` | Avems |
| `Awntn1s` | Awntms |
| `Brellte` | Brente |
| `Bry1n` | Brym |
| `Dow1)` | Dowty |
| `J[erownde` | Jerownde |
| `J1mosse` | Jimosse |
| `MalifawJlte` | Malifawlte |
| `Men1aylus` | Menaylus |
| `Mm1tayne` | Mowntayne |
| `Mowiueraullt` | Mowneraunt |
| `Mynen1e` | Myneme |
| `Neyn1ys` | Neymys |
| `Olifen1e` | Olifeme |
| `Rossllngdaie` | Rossyngdale |
| `Sowdiowfe` | Sowdiowre |
| `Tnwnket` | Trunket |
| `Vapllruawnt` | Vapuruawnt |
| `Visen1ellte` | Visemente |
| `Watinnan` | Watman |
| `Wbirre` | Whirre |
| `Wellawt1de` | Wellawnde |
| `Wellyfowt1de` | Wellyfownde |

A dozen more came through the mechanical rules cleanly enough to leave alone,
but still read oddly. They are the `DOUBTFUL` list in the same file:

`Bribtrr`, `Frowmwnde`, `Gwmore`, `Gyrunownde`, `Lainprwi`, `Lyllyrmore`, `Moremai`, `Peete`, `Ryngebome`, `Thlewe`, `Yevai`, `Yllkir`

### Correcting one

If you have the printed edition, fixing a reading is two steps:

1. Edit the entry in `READINGS` or `CONJECTURAL` in `scripts/transcribe-raw.mjs`
   — or, if it turns out to be right, move it out of `CONJECTURAL` into
   `READINGS`. Drop an entry from `DOUBTFUL` once you have confirmed it.
2. Run `npm run transcribe:apply`, which rewrites the OCR-derived portion of
   `src/data/hounds.json` and leaves the hand-transcribed names alone.

`npm test` checks that `hounds.json` matches what the script produces, and that
the tables above still match the code, so drift between the two gets caught.

## Corrections already made this way

| Was | Now | Why |
| --- | --- | --- |
| `Cleuche` | `Clenche` | `Clellcl1e` gives `Clenche` under the `ll` → n and `cl1` → ch rules, and `Clenche` is attested as a hound name |
| `Goodynowe` | `Goodynowge` | The edition reads `Goodynowȝe`; the yogh is written as `g` here, as elsewhere in the data |
| `Lodismfill` | `Lodisman` | `Lodisman` (a guide or pilot) is attested in the list; nothing else in the data is close to it |
| `<Dyamound>` | `Dyamound` | Hand-transcribed, not from the edition or the OCR, so the brackets weren't the edition's own abbreviation mark. Multiple published listings of the manuscript reproduce it plainly, and it fits the gem names already in the data (`Emerawde`, `Amatiste`, `Argente`) |

Three more hand-transcribed entries carry brackets the same way `Dyamound`
did — `Chawmpir-n<o>wne`, `Ca<mi>ot`, `Chol<s>ey` — but nothing turned up to
confirm or correct them, so they're left as transcribed.

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
