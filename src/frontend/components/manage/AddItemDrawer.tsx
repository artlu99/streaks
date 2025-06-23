import { useState } from "react";
import toast from "react-hot-toast";
import { dailyIcons } from "~/constants";
import { useAllItems, useItemMutations } from "~/hooks/queries/useItems";

interface AddItemDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export const AddItemDrawer = ({ isOpen, onClose }: AddItemDrawerProps) => {
	const [label, setLabel] = useState("");
	const [selectedIcon, setSelectedIcon] = useState(dailyIcons[0]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { createItem } = useItemMutations();
	const db = useAllItems();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!label.trim() || !db?.categories?.[0]?.id) return;

		setIsSubmitting(true);
		try {
			await createItem({
				label: label.trim(),
				faIcon: selectedIcon,
				categoryId: db.categories[0].id.toString(),
			});
			toast.success("Item added successfully!");
			setLabel("");
			setSelectedIcon(dailyIcons[0]);
			onClose();
		} catch (error) {
			console.error("Failed to create item:", error);
			toast.error("Failed to add item. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		if (!isSubmitting) {
			setLabel("");
			setSelectedIcon(dailyIcons[0]);
			onClose();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape") {
			handleClose();
		}
	};

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40"
					onClick={handleClose}
					onKeyDown={handleKeyDown}
					role="button"
					tabIndex={0}
				/>
			)}

			{/* Drawer */}
			<div
				className={`fixed bottom-0 left-0 right-0 bg-base-100 rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
					isOpen ? "translate-y-0" : "translate-y-full"
				}`}
			>
				{/* Handle */}
				<div className="flex justify-center pt-3 pb-2">
					<div className="w-12 h-1 bg-base-300 rounded-full" />
				</div>

				<div className="px-6 pb-8">
					<h2 className="text-2xl font-bold mb-6 text-center">Add New Item</h2>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Icon Selection */}
						<fieldset>
							<legend className="label">
								<span className="label-text font-semibold">Choose Icon</span>
							</legend>
							<div className="grid grid-cols-5 gap-3">
								{dailyIcons.map((icon) => (
									<button
										key={icon}
										type="button"
										className={`btn btn-circle ${
											selectedIcon === icon ? "btn-primary" : "btn-outline"
										}`}
										onClick={() => setSelectedIcon(icon)}
										aria-label={`Select ${icon} icon`}
										aria-pressed={selectedIcon === icon}
									>
										<i className={`fa-solid fa-${icon}`} />
									</button>
								))}
							</div>
						</fieldset>

						{/* Label Input */}
						<div>
							<label htmlFor="item-label" className="label">
								<span className="label-text font-semibold">Label</span>
							</label>
							<input
								id="item-label"
								type="text"
								className="input input-bordered w-full"
								placeholder="Enter item label..."
								value={label}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setLabel((e.target as HTMLInputElement).value)
								}
								maxLength={50}
								required
							/>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3 pt-4">
							<button
								type="button"
								className="btn btn-outline flex-1"
								onClick={handleClose}
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary flex-1"
								disabled={isSubmitting || !label.trim()}
							>
								{isSubmitting ? (
									<span className="loading loading-spinner loading-sm" />
								) : (
									"Add Item"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};
