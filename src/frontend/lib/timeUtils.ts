import type { TimeDep } from "@evolu/common";
import { formatDistanceToNow, isSunday, previousSunday, startOfDay } from "date-fns";
import type { LoggerDep } from "./loggerUtils";

// dpendency injection pattern for more composable, testable code
// see https://www.evolu.dev/docs/dependency-injection
export const calculateStartOfWeek = (deps: TimeDep & Partial<LoggerDep>) => {
	const currentTime = deps.time.now();
	deps.logger?.log(`[info] currentTime: ${currentTime}`);

	const startingSunday = isSunday(currentTime)
		? currentTime
		: previousSunday(currentTime);

	const startOfWeek = startOfDay(startingSunday).getTime();
	deps.logger?.log(`[info] startOfWeek: ${startOfWeek}`);

	return startOfWeek;
};

export const formatTimeElapsed = (timestamp: string | null): string => {
	if (!timestamp) return "Never clicked";

	try {
		const timestampNum = Number(timestamp);
		const date = new Date(timestampNum);

		// Check if the date is valid
		if (Number.isNaN(date.getTime())) {
			return "Never clicked";
		}

		return formatDistanceToNow(date, { addSuffix: true });
	} catch (error) {
		return "Never clicked";
	}
};
