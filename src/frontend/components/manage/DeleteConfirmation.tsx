import { useState } from "react";
import toast from "react-hot-toast";
import { parse } from "valibot";
import { useItemMutations } from "~/hooks/queries/useItems";
import { ActivitySchema, type Item } from "~/lib/schema";

interface DeleteConfirmationProps {
	item: Item;
	isOpen: boolean;
	onClose: () => void;
}

export const DeleteConfirmation = ({
	item,
	isOpen,
	onClose,
}: DeleteConfirmationProps) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const { deleteItem } = useItemMutations();

	const { label } = parse(ActivitySchema, item.activityJson);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteItem({ id: item.id });
			toast.success("Item deleted successfully!");
			onClose();
		} catch (error) {
			console.error("Failed to delete item:", error);
			toast.error("Failed to delete item. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 z-40"
				onClick={onClose}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="bg-base-100 rounded-lg shadow-xl max-w-sm w-full p-6">
					<div className="text-center">
						{/* Warning Icon */}
						<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error/10 mb-4">
							<i className="fa-solid fa-exclamation-triangle text-error text-xl" />
						</div>

						{/* Title */}
						<h3 className="text-lg font-semibold mb-2">Delete Item</h3>

						{/* Message */}
						<p className="text-base-content/70 mb-6">
							Are you sure you want to delete{" "}
							<span className="font-semibold">"{label}"</span>? This action
							cannot be undone.
						</p>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<button
								type="button"
								className="btn btn-outline flex-1"
								onClick={onClose}
								disabled={isDeleting}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-error flex-1"
								onClick={handleDelete}
								disabled={isDeleting}
							>
								{isDeleting ? (
									<span className="loading loading-spinner loading-sm" />
								) : (
									"Delete"
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
