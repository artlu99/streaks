import {
	type DateIsoString,
	FiniteNumber,
	NonEmptyString,
	NonEmptyString1000,
	SqliteBoolean,
	id,
	json,
	maxLength,
	nullOr,
	object,
} from "@evolu/common";
import * as v from "valibot";

const ItemId = id("Item");
export type ItemId = typeof ItemId.Type;

const ItemCategoryId = id("ItemCategory");
type ItemCategoryId = typeof ItemCategoryId.Type;

const ItemOrderId = id("ItemOrder");
type ItemOrderId = typeof ItemOrderId.Type;

const ActivityLogId = id("ActivityLog");
type ActivityLogId = typeof ActivityLogId.Type;

const NonEmptyString50 = maxLength(50)(NonEmptyString);
type NonEmptyString50 = typeof NonEmptyString50.Type;

const Activity = object({
	label: NonEmptyString50,
	frequency: NonEmptyString50,
	faIcon: NonEmptyString50,
	count: FiniteNumber,
});
type Activity = typeof Activity.Type;

const ActivityJson = json(Activity, "ActivityJson");
type ActivityJson = typeof ActivityJson.Type; // string & Brand<"ActivityJson">

export const ActivitySchema = v.pipe(
	v.string(),
	v.transform((input) => JSON.parse(input)),
	v.object({
		label: v.pipe(v.string(), v.nonEmpty(), v.maxLength(50)),
		faIcon: v.pipe(v.string(), v.nonEmpty(), v.maxLength(50)),
		count: v.pipe(v.number(), v.finite()),
	}),
);

export const Schema = {
	item: {
		id: ItemId,
		title: NonEmptyString1000,
		isSelected: nullOr(SqliteBoolean),
		categoryId: nullOr(ItemCategoryId),
		activityJson: nullOr(ActivityJson),
	},
	itemCategory: {
		id: ItemCategoryId,
		name: NonEmptyString50,
	},
	itemOrder: {
		id: ItemOrderId,
		itemId: ItemId,
		orderIndex: FiniteNumber,
	},
	activityLog: {
		id: ActivityLogId,
		itemId: ItemId,
		activityType: NonEmptyString50,
		timestamp: NonEmptyString50,
		score: FiniteNumber,
	},
};

// a type to be used in a view
export type Item = {
	id: ItemId;
	title: NonEmptyString1000 | null;
	isSelected: boolean;
	activityJson: ActivityJson | null;
	categoryName: NonEmptyString50 | null;
	updatedAt: DateIsoString;
	orderIndex: FiniteNumber | null;
};
