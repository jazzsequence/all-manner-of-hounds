#!/usr/bin/env node
/**
 * Importer for src/data/raw.txt, which is OCR output taken from a printed
 * edition of the manuscript list. The edition is set in two columns, so a
 * single raw line can hold one entry from each, and the OCR mangled the
 * edition's type in ways that are mostly but not entirely predictable. See
 * docs/transcription.md.
 *
 * This produced the F-Z portion of src/data/hounds.json, and it is kept so the
 * readings can be checked and argued with. To correct one, edit the READINGS
 * or CONJECTURAL table below and re-apply:
 *
 *   node scripts/transcribe-raw.mjs          # print the recovered names
 *   node scripts/transcribe-raw.mjs --write  # write them into hounds.json
 */
import { readFileSync, writeFileSync } from 'node:fs';

/**
 * Names at the head of hounds.json that were transcribed by hand from the
 * manuscript rather than recovered from raw.txt. --write leaves them alone.
 */
export const HAND_TRANSCRIBED = 223;

/** Column and section headings from the manuscript, as the OCR mangled them. */
const HEADINGS =
	/\bH\s*[o0]un[a-z0-9]*\b|\bBra[ck][a-z0-9]*es\b|\bGreybicches\b|\bGrey(?![a-z])|\b(?:na1r,es|nanies|rzames|na,rzes|narnes|names|ames)\b/g;

/** Footnote references the edition prints after an entry. */
const FOOTNOTES = /(?<=[a-z!}\]])\s*[14](?![A-Za-z0-9)'])/g;

/**
 * OCR damage that can be undone without guessing. The edition's "w" was read
 * as assorted combinations of v, comma, period, slash and backslash, and stray
 * full stops landed in the middle of words.
 */
const MECHANICAL = [
	[/I-I/g, 'H'],
	[/\\N/g, 'W'],
	[/vV/g, 'w'],
	[/v\.[r,/l]/g, 'w'],
	[/[,\\]v/g, 'w'],
	[/vv/g, 'w'],
	[/!/g, 'l'],
	[/\./g, ''],
	[/\s+/g, ''],
	[/[{}]/g, ''],
];

/**
 * Readings for entries the mechanical rules cannot resolve. The edition's
 * broken type produced ambiguous ligatures: "l1" and "ll" stand for h, u or n
 * depending on the word, "n1"/"1n"/"rn" for m or ru, "i1" for n, "t1" for u or
 * n, "tm" for wn. Anything marked CONJECTURAL below is a best reading of badly
 * damaged OCR rather than a confident transcription.
 */
const READINGS = {
	Cll1bbe: 'Clubbe',
	Cacl1epoll: 'Cachepoll',
	Caccl1ecurse: 'Cacchecurse',
	Cl1apelet: 'Chapelet',
	Cl1ekke: 'Chekke',
	Cl1ilde: 'Childe',
	Cl1ampyll: 'Champyn',
	Clellcl1e: 'Clenche',
	Cn1ell: 'Cruell',
	Colyll: 'Colyn',
	Dascl1elake: 'Daschelake',
	Frankeleylle: 'Frankeleyne',
	Fore1noste: 'Foremoste',
	Fretl1erike: 'Fretherike',
	'Go-byl1ynde': 'Go-byhynde',
	Gwm1ore: 'Gwmore',
	Haliblltte: 'Halibutte',
	Haly1note: 'Halymote',
	Hawkyll: 'Hawkyn',
	Hl1rle: 'Hurle',
	Hun1ette: 'Humette',
	Hurlebllcke: 'Hurlebucke',
	Jakernyn: 'Jakemyn',
	Jru1gelor: 'Jangelor',
	Jllstyne: 'Justyne',
	'Joyou[s': 'Joyous',
	Kenewaie: 'Kenewale',
	Kercl1efe: 'Kerchefe',
	Kynnys1nan: 'Kynnysman',
	Lllske: 'Luske',
	Lllste: 'Luste',
	Lt1bike: 'Lubike',
	Ltrrdeyne: 'Lurdeyne',
	Ludrnan: 'Ludman',
	Lwfkyll: 'Lwfkyn',
	Lyrnnore: 'Lymnore',
	Makel1itgood: 'Makehitgood',
	Marcl1awi1t: 'Marchawnt',
	Meyntellawnse: 'Meyntenawnse',
	Mirtl1e: 'Mirthe',
	Molynellx: 'Molyneux',
	Mowi1an1y: 'Mownamy',
	Mt1starde: 'Mustarde',
	Nosllcl1e: 'Nosuche',
	Nowthlls: 'Nowthus',
	Nt1rtt1re: 'Nurture',
	Nytyngaie: 'Nytyngale',
	Olllfawnte: 'Olifawnte',
	Olllllere: 'Oliuere',
	Pagellte: 'Pagente',
	Plentivolls: 'Plentivous',
	Plesallnce: 'Plesaunce',
	Pllilomene: 'Philomene',
	Pllrcl1ase: 'Purchase',
	Pllrveyowre: 'Purveyowre',
	Pllsse: 'Pusse',
	Pursyvawi1te: 'Pursyvawnte',
	Pyncl1e: 'Pynche',
	Qllyte: 'Quyte',
	Qt1erister: 'Querister',
	Qt1ester: 'Quester',
	Qt1onyam: 'Quonyam',
	"Qtl)'ppe": 'Quyppe',
	Qtll1Iette: 'Quillette',
	Queyntatmse: 'Queyntawnse',
	Radisscl1e: 'Radissche',
	Raggernan: 'Raggeman',
	Rai1gere: 'Rangere',
	Re1nowi1de: 'Remownde',
	Recl1ernenere: 'Rechemenere',
	Ret1erence: 'Reuerence',
	Riche1nowi1de: 'Richemownde',
	Robyllette: 'Robynette',
	Rornwlt1s: 'Romulus',
	'Rude-yllowgh': 'Rude-ynowgh',
	Saresyll: 'Saresyn',
	Sclat1eyne: 'Sclaueyne',
	Sojome: 'Sojorne',
	Soyowruaunte: 'Soyowrnaunte',
	Staullchere: 'Staunchere',
	Stayllesn1ore: 'Staynesmore',
	StLrrdy: 'Sturdy',
	Streccl1eofrtl1e: 'Strecche-forthe', // CONJECTURAL
	Goodyllwe: 'Goodynowge', // attested as Goodynowȝe; yogh written as g
	Lodismfill: 'Lodisman',
	Sy1nbale: 'Symbale',
	Yolai1te: 'Yolante',
	Syllgerre: 'Syngerre',
	Synfll1l: 'Synfull',
	Triatmte: 'Triawnte',
	Tullyrnully: 'Tullymully',
	Vailaullt: 'Vailaunt',
	Vllgayne: 'Vngayne',
	Wencl1e: 'Wenche',
	Wisedo1ne: 'Wisedome',
	'Wise-ynoWe': 'Wise-ynowe',
};

/**
 * Entries the OCR damaged beyond a confident reading. The least bad option is
 * recorded so the data has no obvious garbage in it, but every one of these is
 * a guess. Replace them from the printed edition when you can; see
 * `npm run transcribe:apply` in the readme.
 */
export const CONJECTURAL = {
	Asglldde: 'Asgudde', // CONJECTURAL
	Aven1s: 'Avems', // CONJECTURAL
	Awntn1s: 'Awntms', // CONJECTURAL
	Bry1n: 'Brym', // CONJECTURAL
	Brellte: 'Brente', // CONJECTURAL
	'Dow1)': 'Dowty', // CONJECTURAL
	'J[erownde': 'Jerownde', // CONJECTURAL
	J1mosse: 'Jimosse', // CONJECTURAL
	MalifawJlte: 'Malifawlte', // CONJECTURAL
	Men1aylus: 'Menaylus', // CONJECTURAL
	Mm1tayne: 'Mowntayne', // CONJECTURAL
	Mowiueraullt: 'Mowneraunt', // CONJECTURAL
	Mynen1e: 'Myneme', // CONJECTURAL
	Neyn1ys: 'Neymys', // CONJECTURAL
	Olifen1e: 'Olifeme', // CONJECTURAL
	Rossllngdaie: 'Rossyngdale', // CONJECTURAL
	Sowdiowfe: 'Sowdiowre', // CONJECTURAL
	Tnwnket: 'Trunket', // CONJECTURAL
	Vapllruawnt: 'Vapuruawnt', // CONJECTURAL
	Visen1ellte: 'Visemente', // CONJECTURAL
	Watinnan: 'Watman', // CONJECTURAL
	Wbirre: 'Whirre', // CONJECTURAL
	Wellawt1de: 'Wellawnde', // CONJECTURAL
	Wellyfowt1de: 'Wellyfownde', // CONJECTURAL
};

/**
 * Entries the mechanical rules resolved cleanly enough to leave alone, but
 * which still read oddly. Less doubtful than CONJECTURAL, still worth checking.
 */
export const DOUBTFUL = [
	'Bribtrr',
	'Frowmwnde',
	'Gwmore',
	'Gyrunownde',
	'Lainprwi',
	'Lyllyrmore',
	'Moremai',
	'Peete', // likely Feete: it sits in a run of F names
	'Ryngebome',
	'Thlewe',
	'Yevai',
	'Yllkir',
];

/** Every name in the data that is not a confident transcription. */
export const UNCERTAIN = [...Object.values(CONJECTURAL), ...DOUBTFUL].sort();


const LETTER = /[A-Za-z]/;
const letterIndex = (name) => {
	const found = LETTER.exec(name);
	return found ? found[0].toUpperCase().charCodeAt(0) - 65 : -1;
};

/** Split one raw line into its column cells; "~" marks a heading. */
function cellsOf(line) {
	const text = line
		.replace(FOOTNOTES, ' ')
		.replace(HEADINGS, ' ~ ')
		.replace(/(?:~\s*)+/g, '~ ');
	return text
		.split(/\s{2,}|(?<=[a-z}\])~,])\s(?=[A-Z{[\\~])/)
		.map((cell) => cell.trim())
		.filter(Boolean);
}

function repair(cell) {
	const cleaned = MECHANICAL.reduce((name, [pattern, to]) => name.replace(pattern, to), cell);
	return READINGS[cleaned] ?? CONJECTURAL[cleaned] ?? cleaned;
}

/**
 * Walk the rows, keeping a left and a right column. Rows that yielded two
 * cells say which column each belongs to; for a row with one cell, pick the
 * column whose last entry it follows most closely in the alphabet, since both
 * columns run roughly A-Z.
 */
export function transcribe(raw) {
	const pages = [{ left: [], right: [] }];
	let lastLeft = -1;
	let lastRight = -1;

	const distance = (last, index) => (last < 0 ? 100 : index >= last ? index - last : 26 + (last - index));
	const newPage = (index, last) => index >= 0 && (index < last || index - last >= 3);

	for (const line of raw.split('\n')) {
		const cells = cellsOf(line);
		if (!cells.length) continue;

		if (cells.length > 1) {
			const [left, right] = cells;
			const leftIndex = left === '~' ? -1 : letterIndex(left);
			const rightIndex = right === '~' ? -1 : letterIndex(right);
			const page = pages[pages.length - 1];
			// Both columns skipping ahead at once means a new page of the edition.
			if (newPage(leftIndex, lastLeft) && newPage(rightIndex, lastRight) && page.left.length) {
				pages.push({ left: [], right: [] });
				lastLeft = -1;
				lastRight = -1;
			}
			const current = pages[pages.length - 1];
			if (left !== '~') {
				current.left.push(repair(left));
				lastLeft = leftIndex;
			}
			if (right !== '~') {
				current.right.push(repair(right));
				lastRight = rightIndex;
			}
			continue;
		}

		const [only] = cells;
		if (only === '~') continue;
		const index = letterIndex(only);
		const page = pages[pages.length - 1];
		if (distance(lastLeft, index) <= distance(lastRight, index)) {
			page.left.push(repair(only));
			lastLeft = index;
		} else {
			page.right.push(repair(only));
			lastRight = index;
		}
	}

	// Each page of the edition reads down the left column, then the right.
	return pages.flatMap((page) => [...page.left, ...page.right]);
}

if (import.meta.filename === process.argv[1]) {
	const rawPath = new URL('../src/data/raw.txt', import.meta.url);
	const names = transcribe(readFileSync(rawPath, 'utf8'));

	if (!process.argv.includes('--write')) {
		process.stdout.write(JSON.stringify(names, null, '\t') + '\n');
	} else {
		const jsonPath = new URL('../src/data/hounds.json', import.meta.url);
		const manuscript = JSON.parse(readFileSync(jsonPath, 'utf8'));
		manuscript.data = [...manuscript.data.slice(0, HAND_TRANSCRIBED), ...names];
		writeFileSync(jsonPath, JSON.stringify(manuscript, null, '\t') + '\n');
		process.stderr.write(`Wrote ${manuscript.data.length} names to src/data/hounds.json\n`);
	}
}
