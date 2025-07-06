import { createConsole, createTime } from "@evolu/common";
import { useQuery } from "@evolu/react";
import { unique } from "radash";
import { useMemo } from "react";
import { parse } from "valibot";
import { LoggingLevel, Themes } from "~/constants";
import { useActivityLogMutations, useAllItems } from "~/hooks/queries/useItems";
import { useItem } from "~/hooks/queries/useSpecificItem";
import { useSounds } from "~/hooks/use-sounds";
import { useThemes } from "~/hooks/use-themes";
import { useLocalStorageZustand } from "~/hooks/use-zustand";
import { createLogger } from "~/lib/loggerUtils";
import { ActivitySchema, type Item } from "~/lib/schema";
import { calculateStartOfWeek } from "~/lib/timeUtils";

interface ToggleButtonProps {
	item: Item;
}

export const ToggleButton = ({  item }: ToggleButtonProps) => {
	const { dailyToggles, setDailyToggles } = useLocalStorageZustand();
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

	const progressString = useMemo(() => {
		if (!activityLogData) return 0;

		const startOfWeekTimestamp = calculateStartOfWeek({
			time: createTime(),
			logger: createLogger(
				createConsole({ enableLogging: LoggingLevel.DATE_CALCS !== 0 }),
			),
		});

		const netScoreSinceStartOfWeek = activityLogData.reduce(
			(
				acc: number,
				curr: { timestamp: string | null; score: number | null },
			) => {
				const timestamp = curr.timestamp ? Number(curr.timestamp) : 0;
				return (
					acc + (timestamp >= startOfWeekTimestamp ? (curr.score ?? 0) : 0)
				);
			},
			0,
		);
		return `${100 - Math.round((netScoreSinceStartOfWeek / 7) * 100)}`;
	}, [activityLogData]);

	const handleClick = () => {
		const isActiveBeforeClick = dailyToggles.includes(item.id);
		// this is a non-blocking asynchronous operation, we don't wait for it to complete
		createActivityLog({
			itemId: item.id,
			activityType: isActiveBeforeClick ? "unclick" : "click",
			score: isActiveBeforeClick ? -1 : 1,
		});

		setDailyToggles(
			isActiveBeforeClick
				? dailyToggles.filter((id) => id !== item.id)
				: unique([...dailyToggles, item.id]),
		);

		if ("vibrate" in navigator) {
			navigator.vibrate(100);
		}

		playAudio("click");
	};

	const isActive = dailyToggles.includes(item.id);

	return (
		<div className="card w-full max-w-sm flex flex-col justify-center items-center gap-2">
			<button
				type="button"
				className={`${isActive ? `btn btn-circle ${themeName === Themes.DARK ? "bg-primary-content" : "bg-primary/10"}` : "radial-progress text-primary-content/80 bg-accent"} flex flex-col items-center gap-2`}
				style={
					{
						"--value": progressString,
						"--size": "10rem",
						"--thickness": "0.75rem",
					} as React.CSSProperties
				}
				onClick={handleClick}
			>
				<span
					className={`${isActive ? "text-primary" : "text-primary-content"} text-4xl`}
				>
					<i className={`fa-solid fa-${faIcon}`} />
				</span>
				<span
					className={`uppercase ${isActive ? "text-primary" : "text-primary-content"} text-sm`}
				>
					{cumulativeScore ?? "0"}
				</span>
			</button>
			<span
				className={`uppercase font-bold ${themeName === Themes.DARK ? "text-primary-content" : "text-primary"} text-sm`}
			>
				{label}
			</span>
		</div>
	);
};
