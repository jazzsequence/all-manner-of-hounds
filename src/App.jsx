import Kennel from './components/Kennel.jsx';
import { hounds, incipit, title } from './hounds.js';

const ARTICLE =
	'https://www.openculture.com/2022/11/a-list-of-1065-medieval-dog-names-nosewise-garlik-havegoodday-more.html';

export default function App() {
	return (
		<div className="page">
			<header className="masthead">
				<h1>{title}</h1>
				<blockquote cite={ARTICLE}>{incipit}</blockquote>
			</header>

			<main>
				<Kennel />
			</main>

			<footer>
				<p>
					All {hounds.length.toLocaleString()} names come from a fifteenth-century manuscript,{' '}
					<a href={ARTICLE}>by way of Open Culture</a>. Good for hunting hounds, familiars, war dogs,
					and the odd NPC.
				</p>
			</footer>
		</div>
	);
}
