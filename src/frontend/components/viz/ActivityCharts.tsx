import { useEffect, useMemo, useState } from "react";

// Import ApexCharts directly since this is a Vite project
import Chart from "react-apexcharts";

interface ActivityData {
	timestamp: string | null;
	activityType: string | null;
	score: number | null;
	itemId: string | null;
}

interface ActivityChartsProps {
	data: ActivityData[];
	selectedItemLabel: string;
}

export const ActivityCharts = ({ data }: ActivityChartsProps) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Process data for different chart types
	const chartData = useMemo(() => {
		if (!data || data.length === 0) return null;

		// Filter out null values and group by date
		const validData = data.filter(
			(activity) => activity.timestamp && activity.score !== null,
		);

		if (validData.length === 0) return null;

		// Helper function to parse timestamp safely
		const parseTimestamp = (timestamp: string): Date => {
			const timestampNum = Number.parseInt(timestamp, 10);
			// Check if it's a valid timestamp (seconds or milliseconds)
			if (timestampNum > 1000000000000) {
				// Likely milliseconds
				return new Date(timestampNum);
			}
			// Likely seconds, convert to milliseconds
			return new Date(timestampNum * 1000);
		};

		// Group by date and calculate daily scores
		const dailyScores = validData.reduce(
			(acc, activity) => {
				const date = parseTimestamp(
					activity.timestamp || "0",
				).toLocaleDateString();
				acc[date] = (acc[date] || 0) + (activity.score || 0);
				return acc;
			},
			{} as Record<string, number>,
		);

		// Ensure we have at least one data point
		if (Object.keys(dailyScores).length === 0) return null;

		// Convert to arrays for charts
		const sortedEntries = Object.entries(dailyScores).sort(
			([a], [b]) => new Date(a).getTime() - new Date(b).getTime(),
		);

		const lineData = sortedEntries.map(([date, score]) => ({
			x: date,
			y: Math.max(0, score || 0),
		}));

		const barData = sortedEntries.slice(-7).map(([date, score]) => ({
			x: date,
			y: Math.max(0, score || 0),
		}));

		// Create timeline data - only include dates that actually have activity
		// Get unique dates from the data and sort them
		const uniqueDates = [
			...new Set(
				validData.map((activity) =>
					parseTimestamp(activity.timestamp || "0").toLocaleDateString(),
				),
			),
		].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

		// Take only the last 7 unique dates to avoid overwhelming the chart
		const recentDates = uniqueDates.slice(-7);

		const timelineData = recentDates.map((date) => {
			const activities = validData.filter((activity) => {
				const activityDate = parseTimestamp(
					activity.timestamp || "0",
				).toLocaleDateString();
				return activityDate === date;
			});

			return {
				date,
				activities: activities.map((activity) => ({
					time: parseTimestamp(activity.timestamp || "0").toLocaleTimeString(
						[],
						{
							hour: "2-digit",
							minute: "2-digit",
						},
					),
					type: activity.activityType || "unknown",
					score: activity.score || 0,
				})),
			};
		});

		// Calculate activity type distribution
		const activityTypes = validData.reduce(
			(acc, activity) => {
				if (activity.activityType) {
					acc[activity.activityType] = (acc[activity.activityType] || 0) + 1;
				}
				return acc;
			},
			{} as Record<string, number>,
		);

		const pieData = Object.entries(activityTypes).map(([type, count]) => ({
			x: type,
			y: Math.max(0, count || 0),
		}));

		return { lineData, barData, timelineData, pieData };
	}, [data]);

	if (!isClient) {
		return (
			<div className="flex items-center justify-center h-96 bg-base-200 rounded-2xl border border-base-300">
				<div className="text-center">
					<div className="text-4xl mb-4 opacity-50">📊</div>
					<p className="text-base-content/60 text-lg font-medium">
						Loading charts...
					</p>
				</div>
			</div>
		);
	}

	if (!chartData) {
		return (
			<div className="flex items-center justify-center h-96 bg-base-200 rounded-2xl border border-base-300">
				<div className="text-center">
					<div className="text-4xl mb-4 opacity-50">📊</div>
					<p className="text-base-content/60 text-lg font-medium">
						No activity data to display
					</p>
					<p className="text-base-content/40 text-sm mt-2">
						Start tracking your activities to see beautiful charts!
					</p>
				</div>
			</div>
		);
	}

	// Timeline chart configuration
	const timelineChartOptions = {
		chart: {
			type: "scatter" as const,
			height: 280,
			background: "transparent",
			toolbar: {
				show: false,
			},
			animations: {
				enabled: true,
				easing: "easeinout" as const,
				speed: 800,
			},
		},
		series: [
			{
				name: "Activities",
				data: chartData.timelineData.flatMap((day) =>
					day.activities.map((activity) => ({
						x: new Date(`${day.date} ${activity.time}`).getTime(),
						y: activity.type === "click" ? 1 : 0,
						activity: activity,
					})),
				),
			},
		],
		xaxis: {
			type: "datetime" as const,
			labels: {
				style: {
					colors: "#E5E7EB",
					fontSize: "12px",
					fontFamily: "Inter, sans-serif",
				},
				format: "MMM dd",
				rotate: -45,
				rotateAlways: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
			// Set range based on actual data dates
			min:
				chartData.timelineData.length > 0
					? new Date(chartData.timelineData[0].date).getTime()
					: undefined,
			max:
				chartData.timelineData.length > 0
					? new Date(
							chartData.timelineData[chartData.timelineData.length - 1].date,
						).getTime() +
						24 * 60 * 60 * 1000 // Add one day
					: undefined,
		},
		yaxis: {
			labels: {
				show: false,
			},
			min: -0.5,
			max: 1.5,
		},
		colors: ["#60A5FA"],
		markers: {
			size: 8,
			colors: ["#60A5FA"],
			strokeColors: "#1F2937",
			strokeWidth: 2,
			hover: {
				size: 10,
			},
		},
		grid: {
			borderColor: "#374151",
			strokeDashArray: 4,
			xaxis: {
				lines: {
					show: true,
				},
			},
			yaxis: {
				lines: {
					show: false,
				},
			},
		},
		tooltip: {
			theme: "dark",
			style: {
				fontSize: "14px",
				fontFamily: "Inter, sans-serif",
			},
			custom: ({
				seriesIndex,
				dataPointIndex,
				w,
			}: {
				seriesIndex: number;
				dataPointIndex: number;
				w: { globals: { series: unknown[][] } };
			}) => {
				try {
					const data = w.globals.series[seriesIndex][dataPointIndex] as {
						activity?: { type: string; time: string; score: number };
					};

					if (!data || !data.activity) {
						return '<div class="p-2">No activity data</div>';
					}

					const activity = data.activity;
					return `
						<div class="p-2">
							<div class="font-medium">${activity.type || "Unknown"}</div>
							<div class="text-sm opacity-70">${activity.time || "Unknown time"}</div>
							<div class="text-sm opacity-70">Score: ${activity.score || 0}</div>
						</div>
					`;
				} catch (error) {
					return '<div class="p-2">Error loading activity data</div>';
				}
			},
		},
		dataLabels: {
			enabled: false,
		},
	};

	const barChartOptions = {
		chart: {
			type: "bar" as const,
			height: 350,
			background: "transparent",
			toolbar: {
				show: false,
			},
			animations: {
				enabled: true,
				easing: "easeinout" as const,
				speed: 800,
			},
		},
		series: [
			{
				name: "Daily Score",
				data: chartData.barData.map((d) => d.y),
			},
		],
		xaxis: {
			categories: chartData.barData.map((d) => d.x),
			labels: {
				style: {
					colors: "#E5E7EB",
					fontSize: "12px",
					fontFamily: "Inter, sans-serif",
				},
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: "#E5E7EB",
					fontSize: "12px",
					fontFamily: "Inter, sans-serif",
				},
			},
		},
		colors: ["#3B82F6"],
		plotOptions: {
			bar: {
				borderRadius: 8,
				columnWidth: "60%",
			},
		},
		grid: {
			borderColor: "#374151",
			strokeDashArray: 4,
		},
		tooltip: {
			theme: "dark",
			style: {
				fontSize: "14px",
				fontFamily: "Inter, sans-serif",
			},
		},
		dataLabels: {
			enabled: false,
		},
	};

	return (
		<div className="space-y-6">
			{/* Activity Timeline Chart */}
			<div className="bg-base-200 rounded-xl p-4 border border-base-300">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-medium text-base-content">
						Activity Timeline
					</h3>
					<div className="flex items-center gap-2 text-xs text-base-content/60">
						<div className="w-2 h-2 bg-blue-400 rounded-full" />
						<span>
							{chartData.timelineData.length === 1
								? "1 Day"
								: `${chartData.timelineData.length} Days`}
						</span>
					</div>
				</div>
				<Chart
					options={timelineChartOptions}
					series={timelineChartOptions.series}
					type="scatter"
					height={280}
				/>
			</div>

			{/* Last 7 Days Bar Chart */}
			<div className="bg-base-200 rounded-xl p-4 border border-base-300">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-medium text-base-content">
						Last 7 Days Activity
					</h3>
					<div className="flex items-center gap-2 text-xs text-base-content/60">
						<div className="w-2 h-2 bg-blue-500 rounded-full" />
						<span>Daily Breakdown</span>
					</div>
				</div>
				<Chart
					options={barChartOptions}
					series={barChartOptions.series}
					type="bar"
					height={280}
				/>
			</div>
		</div>
	);
};
