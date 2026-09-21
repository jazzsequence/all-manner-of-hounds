import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONJECTURAL, DOUBTFUL, HAND_TRANSCRIBED, transcribe } from './transcribe-raw.mjs';

// Vitest runs from the repository root.
const raw = readFileSync('src/data/raw.txt', 'utf8');
const names = transcribe(raw);

describe('transcribe', () => {
	it('recovers the F-Z portion of the list', () => {
		expect(names).toHaveLength(842);
	});

	it('drops column headings and footnote markers', () => {
		expect(names).not.toContain('Braches');
		expect(names).not.toContain('Grey');
		expect(names.filter((name) => /[0-9]/.test(name))).toEqual([]);
		// The footnote marker on "Foy4" goes; the name stays.
		expect(names).toContain('Foy');
	});

	it('leaves nothing with unrepaired OCR damage', () => {
		expect(names.filter((name) => /[^A-Za-z<>-]/.test(name))).toEqual([]);
	});

	it('repairs the ligatures the broken type produced', () => {
		expect(names).toContain('Childe'); // Cl1ilde
		expect(names).toContain('Hurle'); // Hl1rle
		expect(names).toContain('Cruell'); // Cn1ell
		expect(names).toContain('Richemownde'); // Riche1nowi1de
		expect(names).toContain('Quester'); // Qt1ester
		expect(names).toContain('Queyntawnse'); // Queyntatmse
		expect(names).toContain('Haywarde'); // Ha.yvvarde
		expect(names).toContain('Nosewise'); // Nose\vise
	});

	it('keeps the edition-expanded readings in carets', () => {
		expect(names).toContain('Mo<r>gan');
		expect(names).toContain('Gal<aw>nte');
	});

	it('agrees with the data committed to hounds.json', async () => {
		// Run `npm run transcribe:apply` after changing a reading.
		const { hounds } = await import('../src/hounds.js');
		expect(hounds.slice(HAND_TRANSCRIBED)).toEqual(names);
	});
});

describe('the uncertain readings', () => {
	const docs = readFileSync('docs/transcription.md', 'utf8');

	it('all end up in the data', () => {
		for (const name of [...Object.values(CONJECTURAL), ...DOUBTFUL]) {
			expect(names).toContain(name);
		}
	});

	it('are documented, and nothing stale is left documented', () => {
		for (const [ocr, reading] of Object.entries(CONJECTURAL)) {
			expect(docs).toContain(`| \`${ocr}\` | ${reading} |`);
		}
		const table = docs.split('## Entries that are still guesses')[1].split('###')[0];
		const documented = [...table.matchAll(/^\| `(?<ocr>[^`]+)` \|/gm)].map((row) => row.groups.ocr);
		expect(documented.sort()).toEqual(Object.keys(CONJECTURAL).sort());
		for (const name of DOUBTFUL) {
			expect(table).toContain(`\`${name}\``);
		}
	});
});
