import { useCallback, useEffect, useRef, useState } from 'react';
import { drawHounds, houndsFor, initials } from '../hounds.js';
import HoundList from './HoundList.jsx';

const COUNTS = [1, 3, 6];

export default function Kennel() {
	const [count, setCount] = useState(3);
	const [initial, setInitial] = useState('');
	const [drawn, setDrawn] = useState([]);
	const [copied, setCopied] = useState(false);
	const firstDraw = useRef(true);

	const draw = useCallback(() => {
		setDrawn(drawHounds(count, { initial }));
		setCopied(false);
	}, [count, initial]);

	// Start with a kennel already full rather than an empty page.
	useEffect(() => {
		if (!firstDraw.current) return;
		firstDraw.current = false;
		draw();
	}, [draw]);

	async function copy() {
		try {
			await navigator.clipboard.writeText(drawn.join('\n'));
			setCopied(true);
		} catch {
			setCopied(false);
		}
	}

	const available = houndsFor(initial).length;

	return (
		<section className="kennel">
			<div className="controls">
				<fieldset>
					<legend>How many houndis?</legend>
					<div className="count-options">
						{COUNTS.map((option) => (
							<label key={option} className="count-option">
								<input
									type="radio"
									name="count"
									value={option}
									checked={count === option}
									onChange={() => setCount(option)}
								/>
								{option}
							</label>
						))}
					</div>
				</fieldset>

				<label className="initial-filter">
					After the a.b.c.
					<select value={initial} onChange={(event) => setInitial(event.target.value)}>
						<option value="">Any lettre</option>
						{initials.map((letter) => (
							<option key={letter} value={letter}>
								{letter}
							</option>
						))}
					</select>
				</label>
			</div>

			<div className="actions">
				<button type="button" className="primary" onClick={draw}>
					Nameth the houndis
				</button>
				<button type="button" onClick={copy} disabled={!drawn.length}>
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>

			<HoundList hounds={drawn} />

			<p className="tally">
				{available.toLocaleString()} {available === 1 ? 'name' : 'names'} in the kennel
				{initial ? ` under ${initial.toUpperCase()}` : ''}.
			</p>
		</section>
	);
}
