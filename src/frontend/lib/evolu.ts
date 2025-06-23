import { assert, SimpleName, createEvolu, getOrThrow } from "@evolu/common";
import { evoluReactWebDeps } from "@evolu/react-web";
import { EVOLU_INSTANCE } from "~/constants";
import { Schema } from "~/lib/schema";

export const evoluInstance = createEvolu(evoluReactWebDeps)(Schema, {
	name: getOrThrow(SimpleName.from(EVOLU_INSTANCE)),

	// Disable sync for development to avoid WebSocket connection issues
	// syncUrl: undefined, // optional, defaults to https://free.evoluhq.com

	// TODO: remove this once we have a real initial data
	initialData: (evolu) => {
		try {
			const itemCategory = evolu.insert("itemCategory", { name: "daily" });
			assert(itemCategory.ok, "invalid initial data - itemCategory");

			const item1 = evolu.insert("item", {
				title: "glass-water",
				isSelected: true,
				activityJson: {
					label: "Drink",
					faIcon: "glass-water",
					count: 0,
				},
				categoryId: itemCategory.value.id,
			});
			assert(item1.ok, "invalid initial data - item1");

			const itemOrder1 = evolu.insert("itemOrder", {
				itemId: item1.value.id,
				orderIndex: 0,
			});
			assert(itemOrder1.ok, "invalid initial data - itemOrder1");

			const item2 = evolu.insert("item", {
				title: "person-running",
				isSelected: true,
				activityJson: {
					label: "Exercise",
					faIcon: "person-running",
					count: 0,
				},
				categoryId: itemCategory.value.id,
			});
			assert(item2.ok, "invalid initial data - item2");

			const itemOrder2 = evolu.insert("itemOrder", {
				itemId: item2.value.id,
				orderIndex: 1,
			});
			assert(itemOrder2.ok, "invalid initial data - itemOrder2");
		} catch (error) {
			console.error("Error in initialData:", error);
		}
	},
});
