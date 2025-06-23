import { useState } from "react";
import { AddItemDrawer } from "~/components/manage/AddItemDrawer";
import { GithubLink } from "~/components/manage/GithubLink";
import { ItemList } from "~/components/manage/ItemList";
import { useAllItems } from "~/hooks/queries/useItems";

export function Manage() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const db = useAllItems();

	if (!db) {
		return <p>Loading database...</p>;
	}

	const { vwItems: items } = db;

	return (
		<>
			<article className="prose dark:prose-invert px-4 pb-20">
				<div className="max-w-2xl mx-auto">
					<GithubLink />
					<ItemList items={items ?? []} />
				</div>
			</article>

			{/* FAB */}
			<button
				type="button"
				className="btn btn-primary btn-circle fixed bottom-20 right-4 z-50 shadow-lg"
				onClick={() => setIsDrawerOpen(true)}
			>
				<i className="fa-solid fa-plus text-xl" />
			</button>

			{/* Sliding Drawer */}
			<AddItemDrawer
				isOpen={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
			/>
		</>
	);
}
