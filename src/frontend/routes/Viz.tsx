import { RawDatabaseView } from "~/components/viz/ViewDatabase";

export function Viz() {
	return (
		<>
			<article className="prose dark:prose-invert max-w-4xl mx-auto px-4">
				<RawDatabaseView />
			</article>
		</>
	);
}
