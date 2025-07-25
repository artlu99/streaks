import { useState } from "react";
import { FrequencySelector } from "~/components/FrequencySelector";
import { AddItemDrawer } from "~/components/manage/AddItemDrawer";
import { GithubLink } from "~/components/manage/GithubLink";
import { ItemList } from "~/components/manage/ItemList";
import { useAllItems } from "~/hooks/queries/useItems";
import { useLocalStorageZustand } from "~/hooks/use-zustand";

export function Manage() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { frequency } = useLocalStorageZustand();

	const db = useAllItems();

	if (!db) {
		return <p>Loading database...</p>;
	}

	const { vwItems } = db;
	const items = vwItems.filter((i) => {
		const { frequency: freq } = JSON.parse(i.activityJson ?? "{}");
		return freq === frequency;
	});

	return (
		<>
			<article className="prose dark:prose-invert px-4 pb-20">
				<div className="max-w-2xl mx-auto">
					<div className="flex justify-between items-center">
						<GithubLink />
						<FrequencySelector />
					</div>
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
