import manuscript from './data/hounds.json';

export const { name: title, description: incipit } = manuscript;

/** Every name in the manuscript, in the order it gives them. */
export const hounds = manuscript.data;

/** The initials that actually occur, for the filter control. */
export const initials = [...new Set(hounds.map((hound) => hound[0].toUpperCase()))].sort();

/** The names starting with `initial`, or all of them when it is falsy. */
export function houndsFor(initial) {
	if (!initial) return hounds;
	return hounds.filter((hound) => hound[0].toUpperCase() === initial.toUpperCase());
}

/**
 * Draw `count` names at random, without repeating one until the pool runs out.
 * `random` is injectable so tests do not have to stub Math.random.
 */
export function drawHounds(count, { initial, random = Math.random } = {}) {
	const pool = [...houndsFor(initial)];
	const drawn = [];
	while (drawn.length < count && pool.length) {
		drawn.push(...pool.splice(Math.floor(random() * pool.length), 1));
	}
	return drawn;
}
