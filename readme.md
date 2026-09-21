# The Names of All Manner of Hounds

[![GitHub Workflow Status](https://github.com/jazzsequence/all-manner-of-hounds/actions/workflows/test.yml/badge.svg)](https://github.com/jazzsequence/all-manner-of-hounds/actions)

**[Live site](https://jazzsequence.github.io/all-manner-of-hounds/)** — deploys automatically from `main`.

> Here begynnyth the names of all maner of houndis after the a.b.c. Firste to begynne with .a. for houndis names...

![Medieval Image of houndis](https://cdn8.openculture.com/2022/11/24222653/Livre_de_Chasse_40v-1.jpg)

This project is based on the [Medieval manuscript shared by OpenCulture](https://www.openculture.com/2022/11/a-list-of-1065-medieval-dog-names-nosewise-garlik-havegoodday-more.html) that simply lists 1,065 dog names. No big woof. (yukka yukka)

The thought was, _what could be done with 1,065 medeival dog names?_ and the answer, of course, is always Dungeons & Dragons. Therefore, this project is to build/provide a TTRPG name generator that randomly chooses from these names for whatever purpose you may need it for.

## Running it

```sh
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Vitest suite |
| `npm run lint` | ESLint |
| `npm run transcribe` | Re-runs the OCR importer and prints its names |
| `npm run transcribe:apply` | Writes the importer's output back into `hounds.json` |

Pick how many names you want, optionally narrow to a starting letter, and copy
the result. Names are drawn without repeats within a single draw.

### Deploying

`.github/workflows/deploy.yml` builds and publishes `main` to GitHub Pages on
every push, via `actions/deploy-pages` — no `gh-pages` branch. One manual step
first: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**
(only needs doing once). The build passes `BASE_PATH=/<repo-name>/` so assets
resolve correctly at `https://<user>.github.io/<repo-name>/`.

### Keeping dependencies current

`.github/dependabot.yml` checks weekly for updates to the npm dependencies and
to the Actions used in the workflows, and opens a PR for each. Patch and minor
bumps are grouped into one PR per ecosystem; a major version still gets its
own PR, since those are the ones worth reading before merging.

### Layout

* `src/data/hounds.json` — all 1,065 names, the thing you actually want
* `src/data/raw.txt` — the OCR the F–Z portion was recovered from
* `src/hounds.js` — loading, filtering and drawing
* `src/components/` — the app
* `scripts/transcribe-raw.mjs` — the OCR importer, kept for provenance

## Notes
* In some cases, a name included a character that, as best as I can tell, is literally a numeral 3. According to [this document](https://sites.ualberta.ca/~sreimer/ms-course/course/eng-chrs.htm) (the only one I could find with a quick Google), this is a "yogh" and is basically the letter "g". Some of these characters were replaced with an "m" on a first pass before I found that information; they are written as "g" now.
* In some cases, one or more characters is wrapped with `<` and `>` characters. I've left these in place as carets.
* The names are presented in the JSON file in as alphabetical an order as they were presented in the manuscript (which isn't strictly alphabetical, despite the note). For the portion recovered from OCR the order is approximate — see [docs/transcription.md](docs/transcription.md).
* The OCR was rough, and 36 names are guesses rather than confident readings. They are all listed in [docs/transcription.md](docs/transcription.md), along with how to correct one: edit the reading in `scripts/transcribe-raw.mjs` and run `npm run transcribe:apply`. The test suite catches any drift between the two.

## TODO
* ~~Finish transcribing names from OCR-read raw text file into json.~~
* ~~Replace yogh characters represented with an "m" with "g" characters instead.~~
* ~~Build a react app for the name generator~~
* ~~Add styling to the app~~
* Build a WP plugin to display the random names? (possible future implementation)
