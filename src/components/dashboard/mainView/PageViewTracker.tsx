"use client";

import { serviceRequest } from "@prisma/client";
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
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Tooltip as TooltipNextUI } from "@nextui-org/react";
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

export default function PageViewTracker(props: { requests: serviceRequest[] }) {
    const { requests } = props;

    const [sevenDays, setSevenDays] = useState<any>([]);
    const [homeVisits, setHomeVisits] = useState<any>([]);
    const [filmVisits, setFilmVisits] = useState<any>([]);
    const [digitalVisits, setDigitalVisits] = useState<any>([]);
    const [lightVisits, setLightVisits] = useState<any>([]);
    const [eventsVisits, setEventsVisits] = useState<any>([]);
    const [artVisits, setArtVisits] = useState<any>([]);

    useEffect(() => {
        var week = [];
        for (let i = 0; i < 7; i++) {
            var date = new Date();
            date.setDate(date.getDate() - (6 - i));
            week.push(date.toDateString().split(" ")[0]);
        }
        setSevenDays(week);

        var _homeVisits = [];
        var _filmVisits = [];
        var _digitalVisits = [];
        var _lightVisits = [];
        var _eventsVisits = [];
        var _artVisits = [];

        for (let i = 0; i < 7; i++) {
            var homeCount = 0;
            var filmCount = 0;
            var digitalCount = 0;
            var lightCount = 0;
            var eventsCount = 0;
            var artCount = 0;
            var date = new Date();
            date.setDate(date.getDate() - (6 - i));
            for (let j = 0; j < requests.length; j++) {
                const visitDate = new Date(requests[j].createdAt);
                if (visitDate.getDate() === date.getDate()) {
                    if (requests[j].page === "home") {
                        homeCount = homeCount + 1;
                    } else if (requests[j].page === "film") {
                        filmCount = filmCount + 1;
                    } else if (requests[j].page === "digital") {
                        digitalCount = digitalCount + 1;
                    } else if (requests[j].page === "light") {
                        lightCount = lightCount + 1;
                    } else if (requests[j].page === "events") {
                        eventsCount = eventsCount + 1;
                    } else if (requests[j].page === "art") {
                        artCount = artCount + 1;
                    }
                }
            }
            _homeVisits.push(homeCount);
            _filmVisits.push(filmCount);
            _digitalVisits.push(digitalCount);
            _lightVisits.push(lightCount);
            _eventsVisits.push(eventsCount);
            _artVisits.push(artCount);
        }
        setHomeVisits(_homeVisits);
        setFilmVisits(_filmVisits);
        setDigitalVisits(_digitalVisits);
        setLightVisits(_lightVisits);
        setEventsVisits(_eventsVisits);
        setArtVisits(_artVisits);
    }, []);

    const chartData = {
        labels: sevenDays,
        datasets: [
            {
                label: "Home (" + homeVisits[6] + ")",
                data: homeVisits,
                borderColor: "rgb(234, 88, 12)",
                backgroundColor: "rgba(234, 88, 12, 0.5)",
            },
            {
                label: "Film (" + filmVisits[6] + ")",
                data: filmVisits,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
                label: "Digital (" + digitalVisits[6] + ")",
                data: digitalVisits,
                borderColor: "rgb(0, 21, 209)",
                backgroundColor: "rgba(0, 21, 209, 0.5)",
            },
            {
                label: "Light (" + lightVisits[6] + ")",
                data: lightVisits,
                borderColor: "rgb(27, 204, 0)",
                backgroundColor: "rgba(27, 204, 0, 0.5)",
            },
            {
                label: "Events (" + eventsVisits[6] + ")",
                data: eventsVisits,
                borderColor: "rgb(185, 13, 219)",
                backgroundColor: "rgba(185, 13, 219, 0.5)",
            },
            {
                label: "Art (" + artVisits[6] + ")",
                data: artVisits,
                borderColor: "rgb(9, 230, 222)",
                backgroundColor: "rgba(9, 230, 222, 0.5)",
            },
        ],
    };
    return (
        <>
            <TooltipNextUI
                offset={-20}
                closeDelay={0}
                className="dark"
                content={
                    <div className="max-w-72">
                        <div className="text-xl w-full border-b pb-2 mb-2">
                            Page Views
                        </div>
                        <div>
                            Here you can see how many times each page has been
                            loaded. This does not work as a tracker and does not
                            use cookies. It is an anonymous click event that is
                            saved to the database. Data shown is over a 7 day
                            period.
                        </div>
                    </div>
                }>
                <div className="mt-6 mb-10 cursor-help min-h-72 bg-zinc-900 shadow-xl border border-orange-600 p-2 rounded-xl">
                    <Line options={options} data={chartData} />
                </div>
            </TooltipNextUI>
        </>
    );
}
