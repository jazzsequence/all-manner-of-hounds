const ORDINALS = ['Firste', 'Seconde', 'Thirde', 'Fourthe', 'Fyfthe', 'Sixthe'];

export default function HoundList({ hounds }) {
	if (!hounds.length) {
		return (
			<p className="empty" role="status">
				No houndis yet. Sette the kennel loose.
			</p>
		);
	}

	return (
		<ol className="hound-list" aria-label="Generated hound names">
			{hounds.map((hound, index) => (
				<li key={`${hound}-${index}`}>
					<span className="hound-ordinal" aria-hidden="true">
						{ORDINALS[index] ?? index + 1}
					</span>
					<span className="hound-name">{hound}</span>
				</li>
			))}
		</ol>
	);
}
