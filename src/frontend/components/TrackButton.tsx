import { useQuery } from "@evolu/react";
import { useMemo } from "react";
import { parse } from "valibot";
import { Themes } from "~/constants";
import { useActivityLogMutations, useAllItems } from "~/hooks/queries/useItems";
import { useItem } from "~/hooks/queries/useSpecificItem";
import { useSounds } from "~/hooks/use-sounds";
import { useThemes } from "~/hooks/use-themes";
import { ActivitySchema, type Item } from "~/lib/schema";
import { formatTimeElapsed } from "~/lib/timeUtils";

interface TrackButtonProps {
	item: Item;
}

export const TrackButton = ({ item }: TrackButtonProps) => {
	const { themeName } = useThemes();
	const { playAudio } = useSounds();
	const { createActivityLog } = useActivityLogMutations();

	const { label, faIcon } = parse(ActivitySchema, item.activityJson);

	const db = useAllItems();
	const { vwActivity } = db ?? {};

	const cumulativeScore = useMemo(() => {
		return vwActivity?.reduce(
			(acc, curr) => acc + (curr.title === item.title ? (curr?.score ?? 0) : 0),
			0,
		);
	}, [vwActivity, item.title]);

	const { activityLog: dbLog } = useItem(item.id) ?? {};
	const activityLogData = dbLog ? useQuery(dbLog) : null;

	const lastClickTime = useMemo(() => {
		if (!activityLogData || activityLogData.length === 0) return null;

		// Find the most recent "click" activity
		const lastClick = activityLogData.find(
			(log) => log.activityType === "click",
		);
		return lastClick?.timestamp || null;
	}, [activityLogData]);

	const timeElapsed = useMemo(() => {
		return formatTimeElapsed(lastClickTime);
	}, [lastClickTime]);

	const handleClick = () => {
		// this is a non-blocking asynchronous operation, we don't wait for it to complete
		createActivityLog({
			itemId: item.id,
			activityType: "click",
			score: 1,
		});

		if ("vibrate" in navigator) {
			navigator.vibrate(100);
		}

		playAudio("click");
	};

	const isActive = true;

	return (
		<div className="card w-full max-w-sm flex flex-col justify-center items-center gap-4">
			<button
				type="button"
				className={`${isActive ? `btn btn-lg ${themeName === Themes.DARK ? "bg-primary-content hover:bg-primary-content/90" : "bg-primary/10 hover:bg-primary/20"} border-2 border-primary/20` : "text-primary-content/80 bg-accent"} flex flex-col items-center justify-center gap-4 px-6 py-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl min-h-[120px] w-full`}
				onClick={handleClick}
			>
				<span
					className={`${isActive ? "text-primary" : "text-primary-content"} text-3xl`}
				>
					<i className={`fa-solid fa-${faIcon}`} />
				</span>
				<span
					className={`uppercase ${isActive ? "text-primary" : "text-primary-content"} text-sm font-semibold`}
				>
					{cumulativeScore ?? "0"}
				</span>
				<div
					className={`text-xs ${isActive ? "text-primary/70" : "text-primary-content/70"} text-center`}
				>
					{timeElapsed}
				</div>
			</button>
			<span
				className={`uppercase font-bold ${themeName === Themes.DARK ? "text-primary-content" : "text-primary"} text-sm`}
			>
				{label}
			</span>
		</div>
	);
};
