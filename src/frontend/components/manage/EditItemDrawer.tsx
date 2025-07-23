import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { parse } from "valibot";
import { useItemMutations } from "~/hooks/queries/useItems";
import { useLocalStorageZustand } from "~/hooks/use-zustand";
import { getIconsForFrequency } from "~/lib/iconUtils";
import { ActivitySchema, type Item } from "~/lib/schema";

interface EditItemDrawerProps {
	item: Item;
	isOpen: boolean;
	onClose: () => void;
}

export const EditItemDrawer = ({
	item,
	isOpen,
	onClose,
}: EditItemDrawerProps) => {
	const { label: labelFromJson, faIcon } = parse(
		ActivitySchema,
		item.activityJson,
	);

	const [label, setLabel] = useState(labelFromJson);
	const [selectedIcon, setSelectedIcon] = useState(faIcon);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { frequency } = useLocalStorageZustand();
	const { updateItem } = useItemMutations();

	const icons = getIconsForFrequency(frequency);

	// Update form when item changes
	useEffect(() => {
		setLabel(label);
		setSelectedIcon(faIcon);
	}, [label, faIcon]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!label.trim()) return;

		setIsSubmitting(true);
		try {
			await updateItem({
				id: item.id,
				label: label.trim(),
				frequency: frequency,
				faIcon: selectedIcon,
			});
			toast.success("Item updated successfully!");
			onClose();
		} catch (error) {
			console.error("Failed to update item:", error);
			toast.error("Failed to update item. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		if (!isSubmitting) {
			setLabel(label);
			setSelectedIcon(faIcon);
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
					<h2 className="text-2xl font-bold mb-6 text-center">Edit Item</h2>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Icon Selection */}
						<fieldset>
							<legend className="label">
								<span className="label-text font-semibold">Choose Icon</span>
							</legend>
							<div className="grid grid-cols-5 gap-3">
								{icons.map((icon) => (
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
							<label htmlFor="edit-item-label" className="label">
								<span className="label-text font-semibold">Label</span>
							</label>
							<input
								id="edit-item-label"
								type="text"
								className="input input-bordered w-full"
								placeholder="Enter item label..."
								value={label}
								onChange={(e) => setLabel((e.target as HTMLInputElement).value)}
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
									"Save Changes"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};
