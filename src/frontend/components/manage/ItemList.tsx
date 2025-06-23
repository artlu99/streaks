import { useState } from "react";
import { parse } from "valibot";
import { DeleteConfirmation } from "~/components/manage/DeleteConfirmation";
import { EditItemDrawer } from "~/components/manage/EditItemDrawer";
import { useItemMutations } from "~/hooks/queries/useItems";
import { ActivitySchema, type Item } from "~/lib/schema";

interface ItemListProps {
	items: readonly Item[];
}

export const ItemList = ({ items }: ItemListProps) => {
	const [editingItem, setEditingItem] = useState<Item | null>(null);
	const [deletingItem, setDeletingItem] = useState<Item | null>(null);
	const { toggleItemSelection } = useItemMutations();

	const handleToggleSelection = async (item: Item) => {
		await toggleItemSelection({ id: item.id, isSelected: !item.isSelected });
	};

	return (
		<div className="space-y-3">
			{items.map((item) => {
				const { label, faIcon } = parse(ActivitySchema, item.activityJson);
				return (
					<div
						key={item.id}
						className="card bg-base-200 shadow-sm border border-base-300"
					>
						<div className="card-body p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<button
										type="button"
										className={`btn btn-xl ${item.isSelected ? "btn-primary" : "btn-ghost"}`}
										onClick={() => handleToggleSelection(item)}
									>
										<i className={`fa-solid fa-${faIcon}`} />
									</button>
									<div>
										<h3 className="font-semibold">{label}</h3>
										<p className="text-sm text-base-content/70">
											{item.categoryName}
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button
										type="button"
										className="btn btn-sm btn-ghost"
										onClick={() => setEditingItem(item)}
									>
										<i className="fa-solid fa-edit" />
									</button>
									<button
										type="button"
										className="btn btn-sm btn-ghost text-error"
										onClick={() => setDeletingItem(item)}
									>
										<i className="fa-solid fa-trash" />
									</button>
								</div>
							</div>
						</div>
					</div>
				);
			})}

			{items.length === 0 && (
				<div className="text-center py-8 text-base-content/70">
					<i className="fa-solid fa-list-ul text-4xl mb-4" />
					<p>No items yet. Tap the + button to add your first item!</p>
				</div>
			)}

			{/* Edit Drawer */}
			{editingItem && (
				<EditItemDrawer
					item={editingItem}
					isOpen={!!editingItem}
					onClose={() => setEditingItem(null)}
				/>
			)}

			{/* Delete Confirmation */}
			{deletingItem && (
				<DeleteConfirmation
					item={deletingItem}
					isOpen={!!deletingItem}
					onClose={() => setDeletingItem(null)}
				/>
			)}
		</div>
	);
};
