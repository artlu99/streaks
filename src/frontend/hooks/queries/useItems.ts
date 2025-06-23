import { useQuery } from "@evolu/react";
import { retry } from "radash";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useEvolu } from "~/hooks/use-evolu";
import { useZustand } from "~/hooks/use-zustand";
import { evoluInstance } from "~/lib/evolu";
import type { Item } from "~/lib/schema";

export const useAllItems = () => {
	const { isEvoluReady, setIsEvoluReady } = useZustand();

	const allCategories = evoluInstance.createQuery((db) =>
		db
			.selectFrom("itemCategory")
			.select(["id", "name"])
			.where("isDeleted", "is", null),
	);

	const itemsView = evoluInstance.createQuery((db) =>
		db
			.selectFrom("item")
			.leftJoin("itemCategory", "itemCategory.id", "item.categoryId")
			.leftJoin("itemOrder", "itemOrder.itemId", "item.id")
			.select([
				"item.id",
				"item.title",
				"item.isSelected",
				"item.activityJson",
				"itemCategory.name as categoryName",
				"item.updatedAt",
				"itemOrder.orderIndex",
			])
			.where("item.isDeleted", "is", null)
			.where("itemCategory.isDeleted", "is", null)
			.where("itemOrder.isDeleted", "is", null)
			.orderBy("itemOrder.orderIndex", "asc")
			.orderBy("item.updatedAt", "desc"),
	);

	const activityLogs = evoluInstance.createQuery((db) =>
		db
			.selectFrom("activityLog")
			.leftJoin("item", "item.id", "activityLog.itemId")
			.leftJoin("itemCategory", "itemCategory.id", "item.categoryId")
			.select([
				"activityLog.timestamp",
				"item.title",
				"activityLog.activityType",
				"activityLog.score",
				"itemCategory.name as categoryName",
				"item.activityJson",
				"item.id as itemId",
			])
			.where("activityLog.isDeleted", "is", null)
			.where("item.isDeleted", "is", null)
			.where("itemCategory.isDeleted", "is", null)
			.orderBy("activityLog.timestamp", "desc"),
	);

	const categories = useQuery(allCategories);
	const vwItems: Item[] = useQuery(itemsView).map((row) => ({
		...row,
		isSelected: row.isSelected === 1,
	}));
	const vwActivity = useQuery(activityLogs);

	// exponential backoff to wait for Evolu instance initialization
	useEffect(() => {
		const checkInitialization = async () => {
			try {
				await retry(
					{ delay: 100, backoff: (count) => 2 ** count * 100, times: 4 },
					async () => {
						// Check if we have data or if the database is still initializing
						if (vwItems?.length > 0 && categories?.length > 0) {
							return true; // Success - we have data
						}

						// If we still have no data after multiple retries, assume initialization is complete
						// and the database is genuinely empty
						throw new Error("Still initializing");
					},
				);

				// If we get here, we have data or initialization is complete
				setIsEvoluReady(true);
			} catch (error) {
				// After all retries, assume initialization is complete
				console.log("Initialization check complete, database ready");
				setIsEvoluReady(true);
			}
		};

		!isEvoluReady && checkInitialization();
	}, [vwItems, categories, isEvoluReady, setIsEvoluReady,]);

	// Only return the result when we're ready
	return isEvoluReady ? { categories, vwItems, vwActivity } : null;
};

const upsertItem = (
	insert: ReturnType<typeof useEvolu>["insert"],
	update: ReturnType<typeof useEvolu>["update"],
	itemData: {
		id?: string;
		label: string;
		faIcon: string;
		categoryId?: string;
		isSelected?: boolean;
	},
) => {
	const { id, label, faIcon, categoryId, isSelected = true } = itemData;

	if (id) {
		return update("item", {
			id,
			title: faIcon,
			activityJson: {
				label,
				faIcon,
				count: 0,
			},
		});
	}

	if (!categoryId) {
		throw new Error("categoryId is required for creating new items");
	}

	return insert("item", {
		title: faIcon,
		isSelected,
		activityJson: {
			label,
			faIcon,
			count: 0,
		},
		categoryId,
	});
};

export const useItemMutations = () => {
	const { insert, update } = useEvolu();

	const createItem = async ({
		label,
		faIcon,
		categoryId,
	}: { label: string; faIcon: string; categoryId: string }) => {
		const itemResult = insert("item", {
			title: faIcon,
			isSelected: true,
			activityJson: {
				label,
				faIcon,
				count: 0,
			},
			categoryId,
		});

		if (!itemResult.ok) {
			throw new Error("Failed to create item");
		}

		const orderResult = insert("itemOrder", {
			itemId: itemResult.value.id,
			orderIndex: 0, // TODO: Calculate actual next order index
		});

		if (!orderResult.ok) {
			throw new Error("Failed to create item order");
		}

		return itemResult.value;
	};

	const updateItem = async ({
		id,
		label,
		faIcon,
	}: { id: string; label: string; faIcon: string }) => {
		const result = upsertItem(insert, update, {
			id,
			label,
			faIcon,
		});

		if (!result.ok) {
			throw new Error("Failed to update item");
		}

		return result.value;
	};

	const deleteItem = async ({ id }: { id: string }) => {
		const itemResult = update("item", {
			id,
			isDeleted: true,
		});

		if (!itemResult.ok) {
			throw new Error("Failed to delete item");
		}

		return itemResult.value;
	};

	const toggleItemSelection = async ({
		id,
		isSelected,
	}: { id: string; isSelected: boolean }) => {
		const result = update("item", {
			id,
			isSelected,
		});

		if (!result.ok) {
			throw new Error("Failed to toggle item selection");
		}

		return result.value;
	};

	return {
		createItem,
		updateItem,
		deleteItem,
		toggleItemSelection,
	};
};

export const useActivityLogMutations = () => {
	const { insert } = useEvolu();

	const createActivityLog = async ({
		itemId,
		activityType,
		score,
	}: { itemId: string; activityType: string; score: number }) => {
		const result = insert("activityLog", {
			itemId,
			activityType,
			timestamp: Date.now().toString(),
			score,
		});

		if (!result.ok) {
			toast.error("Failed to create activity log");
			throw new Error(JSON.stringify(result.error));
		}

		return result.value;
	};

	return { createActivityLog };
};
