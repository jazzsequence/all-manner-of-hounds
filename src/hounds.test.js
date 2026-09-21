import { describe, expect, it } from 'vitest';
import { drawHounds, hounds, houndsFor, initials } from './hounds.js';

describe('the manuscript data', () => {
	it('holds all 1,065 names', () => {
		expect(hounds).toHaveLength(1065);
	});

	it('has no blank entries left over from the transcription', () => {
		expect(hounds.filter((hound) => !hound.trim())).toEqual([]);
	});

	it('holds no leftover OCR damage', () => {
		// The OCR read broken type as digits, braces, slashes and stray periods.
		// Carets are kept on purpose: they are the edition's own expansions.
		expect(hounds.filter((hound) => /[^A-Za-z<>-]/.test(hound))).toEqual([]);
	});

	it('writes yoghs as g rather than m', () => {
		expect(hounds).toContain('Dere-ybowgt');
		expect(hounds).not.toContain('Dere-ybowmt');
	});

	it('has no name that is a bare bracketed word', () => {
		// A caret around part of a word marks a letter the source wasn't sure
		// of (see docs/transcription.md); a caret around the whole word, as
		// "<Dyamound>" used to be, isn't that, and reads as broken in the app.
		expect(hounds.filter((hound) => /^<[^<>]*>$/.test(hound))).toEqual([]);
		expect(hounds).toContain('Dyamound');
	});
});

describe('houndsFor', () => {
	it('returns every name when given no letter', () => {
		expect(houndsFor()).toHaveLength(hounds.length);
		expect(houndsFor('')).toHaveLength(hounds.length);
	});

	it('filters on the initial, whatever case it is given in', () => {
		const upper = houndsFor('Z');
		expect(upper.length).toBeGreaterThan(0);
		expect(upper).toEqual(houndsFor('z'));
		expect(upper.every((hound) => hound.startsWith('Z'))).toBe(true);
	});

	it('covers every initial the filter offers', () => {
		for (const initial of initials) {
			expect(houndsFor(initial).length).toBeGreaterThan(0);
		}
	});
});

describe('drawHounds', () => {
	it('draws the number asked for', () => {
		expect(drawHounds(6)).toHaveLength(6);
	});

	it('does not repeat a name within one draw', () => {
		const drawn = drawHounds(40);
		expect(new Set(drawn).size).toBe(drawn.length);
	});

	it('stops when the pool runs dry rather than repeating', () => {
		const pool = houndsFor('Z');
		expect(drawHounds(pool.length + 10, { initial: 'Z' })).toHaveLength(pool.length);
	});

	it('honours the letter filter', () => {
		expect(drawHounds(5, { initial: 'B' }).every((hound) => hound.startsWith('B'))).toBe(true);
	});

	it('takes the first name when the randomness always returns zero', () => {
		expect(drawHounds(2, { random: () => 0 })).toEqual(hounds.slice(0, 2));
	});
});
