import { formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { parse } from "valibot";
import { ActivityCharts } from "~/components/viz/ActivityCharts";
import { useAllItems } from "~/hooks/queries/useItems";
import { useZustand } from "~/hooks/use-zustand";
import { ActivitySchema } from "~/lib/schema";

export const RawDatabaseView = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { selectedItem, setSelectedItem } = useZustand();

	const db = useAllItems();

	const selectedItemLabel = useMemo(() => {
		if (!selectedItem) return "";
		const { label } = parse(ActivitySchema, selectedItem.activityJson);
		return label;
	}, [selectedItem]);

	useEffect(() => {
		if (!db) return;

		const { vwItems: items } = db;
		const selectedItems = items?.filter((item) => item.isSelected) || [];

		// Only set selected item if no item is currently selected
		if (!selectedItem && (selectedItems?.length ?? 0) > 0) {
			setSelectedItem(selectedItems[0]);
		}
	}, [db, selectedItem, setSelectedItem]);

	if (!db) {
		return <p>Loading all items view...</p>;
	}

	const { vwItems: items, vwActivity } = db;
	const selectedItems = items?.filter((item) => item.isSelected) || [];

	const filteredActivities = vwActivity?.filter(
		(activity) => activity.itemId === selectedItem?.id,
	);

	const filteredActivitiesToShowRaw = filteredActivities?.map((fa) => {
		const timestamp = new Date(Number(fa.timestamp));
		const relativeDateString = formatDistanceToNow(timestamp, {
			addSuffix: true,
		});
		const { label } = parse(ActivitySchema, fa.activityJson);
		return {
			date: timestamp.toLocaleDateString(),
			time: timestamp.toLocaleTimeString(),
			when: relativeDateString,
			activityType: fa.activityType,
			score: fa.score,
			label,
			category: fa.categoryName,
		};
	});

	return (
		<div>
			<div className="flex flex-row items-center justify-between">
				<div className="font-xl text-primary-content">Activity Log</div>
				<div>
					<details className="dropdown dropdown-end" open={isDropdownOpen}>
						<summary
							className="btn m-1"
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									setIsDropdownOpen(!isDropdownOpen);
								}
							}}
						>
							{selectedItemLabel} <i className="fa-solid fa-angle-down" />
						</summary>
						<ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
							{selectedItems.map((item) => {
								const { label } = parse(ActivitySchema, item.activityJson);
								return (
									<li
										key={item.id}
										className="text-right"
										onClick={() => {
											setIsDropdownOpen(false);
											setSelectedItem(item);
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												setIsDropdownOpen(false);
												setSelectedItem(item);
											}
										}}
									>
										{label}
									</li>
								);
							})}
						</ul>
					</details>
				</div>
			</div>

			{vwActivity ? (
				<>
					<div className="w-full">
						<ActivityCharts
							data={filteredActivities || []}
							selectedItemLabel={selectedItemLabel}
						/>
					</div>
					<pre>{JSON.stringify(filteredActivitiesToShowRaw, null, 2)}</pre>
				</>
			) : (
				<p>Initializing database...</p>
			)}
		</div>
	);
};
