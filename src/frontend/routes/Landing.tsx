import { useState } from "react";
import { ResetButton } from "~/components/ResetButton";
import { ToggleButton } from "~/components/ToggleButton";
import { AddItemDrawer } from "~/components/manage/AddItemDrawer";
import { useAllItems } from "~/hooks/queries/useItems";

export function Landing() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const db = useAllItems();

	if (!db) {
		return <p>Waiting for access to local database...</p>;
	}

	const { vwItems: items } = db;
	const selectedItems = items?.filter((item) => item.isSelected) || [];

	return (
		<>
			<article className="prose dark:prose-invert px-4 pb-20">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
					{selectedItems.slice(0, 6).map((item) => (
						<ToggleButton key={item.id} item={item} />
					))}
				</div>
				<div className="flex flex-col w-full justify-center items-center mt-8">
					<ResetButton />
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
