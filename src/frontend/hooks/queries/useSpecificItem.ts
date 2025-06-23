import { useZustand } from "~/hooks/use-zustand";
import { evoluInstance } from "~/lib/evolu";
import type { ItemId } from "~/lib/schema";

export const useItem = (itemId: ItemId) => {
	const { isEvoluReady } = useZustand();

	const activityLog = evoluInstance.createQuery((db) =>
		db
			.selectFrom("activityLog")
			.select([
				"activityLog.timestamp",
				"activityLog.activityType",
				"activityLog.score",
			])
			.where("activityLog.itemId", "is", itemId)
			.where("activityLog.isDeleted", "is", null)
			.orderBy("activityLog.createdAt", "desc"),
	);

	return isEvoluReady ? { activityLog } : null;
};
