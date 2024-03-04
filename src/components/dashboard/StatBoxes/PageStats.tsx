"use client";

import axios from "axios";
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
            grid: {
                color: "rgba(255, 255, 255, 0.25)",
            },
        },
    },
};

export default function PageStats() {
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

        axios
            .get("/api/service")
            .then((res) => {
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
                    for (let j = 0; j < res.data.data.length; j++) {
                        const visitDate = new Date(res.data.data[j].createdAt);
                        if (visitDate.getDate() === date.getDate()) {
                            if (res.data.data[j].page === "home") {
                                homeCount = homeCount + 1;
                            } else if (res.data.data[j].page === "film") {
                                filmCount = filmCount + 1;
                            } else if (res.data.data[j].page === "digital") {
                                digitalCount = digitalCount + 1;
                            } else if (res.data.data[j].page === "light") {
                                lightCount = lightCount + 1;
                            } else if (res.data.data[j].page === "events") {
                                eventsCount = eventsCount + 1;
                            } else if (res.data.data[j].page === "art") {
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
            })
            .catch((err) => console.log(err));
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
    return <Line options={options} data={chartData} />;
}
