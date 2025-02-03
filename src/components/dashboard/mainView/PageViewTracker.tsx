"use client";
// packages
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Tooltip as TooltipNextUI } from "@heroui/react";
// functions
import { countViews } from "@/lib/utils/countViews";
import getSevenDays from "@/lib/utils/getSevenDays";
// types
import { serviceRequest } from "@prisma/client";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Weekly Page Traffic",
		},
	},
	scales: {
		x: {
			grid: {
				color: "rgba(255, 255, 255, 0.25)",
			},
		},
		y: {
			ticks: {
				stepSize: 1,
			},
			grid: {
				color: "rgba(255, 255, 255, 0.25)",
			},
		},
	},
};

const colors = [
	{
		borderColor: "rgb(234, 88, 12)",
		backgroundColor: "rgba(234, 88, 12, 0.5)",
	},
	{
		borderColor: "rgb(255, 99, 132)",
		backgroundColor: "rgba(255, 99, 132, 0.5)",
	},
	{
		borderColor: "rgb(0, 21, 209)",
		backgroundColor: "rgba(0, 21, 209, 0.5)",
	},
	{
		borderColor: "rgb(27, 204, 0)",
		backgroundColor: "rgba(27, 204, 0, 0.5)",
	},
	{
		borderColor: "rgb(185, 13, 219)",
		backgroundColor: "rgba(185, 13, 219, 0.5)",
	},
	{
		borderColor: "rgb(9, 230, 222)",
		backgroundColor: "rgba(9, 230, 222, 0.5)",
	},
];

const PageViewTracker = ({ requests }: { requests: serviceRequest[] }) => {
	const [visits, setVisits] = useState<{ page: string; views: number[] }[]>(
		[]
	);
	const [sevenDays, setSevenDays] = useState<string[]>([]);

	useEffect(() => {
		setVisits(countViews(requests));
		setSevenDays(getSevenDays());
	}, []);

	const dataSets = visits.map((visit) => ({
		label: visit.page + " (" + visit.views[6] + ")",
		data: visit.views,
		borderColor: colors[visits.indexOf(visit)].borderColor,
		backgroundColor: colors[visits.indexOf(visit)].backgroundColor,
	}));

	const chartData = {
		labels: sevenDays,
		datasets: dataSets,
	};

	return (
		<TooltipNextUI
			offset={-20}
			closeDelay={0}
			className="dark"
			content={
				<div className="max-w-72">
					<div className="text-xl w-full border-b pb-2 mb-2">
						Page View
					</div>
					<div>
						Here you can see how many times each page has been
						loaded. This does not work as a tracker and does not use
						cookies. It is an anonymous click event that is saved to
						the database. Data shown is over a 7 day period.
					</div>
				</div>
			}
		>
			<div className="mt-6 mb-10 cursor-help min-h-72 bg-zinc-900 shadow-xl border border-orange-600 p-2 rounded-xl">
				<Line options={options} data={chartData} />
			</div>
		</TooltipNextUI>
	);
};

export default PageViewTracker;
