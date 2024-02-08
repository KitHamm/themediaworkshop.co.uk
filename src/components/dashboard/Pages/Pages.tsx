"use client";

// Components
import PageEdit from "./PageEdit";

// React Components
import { useState, useEffect } from "react";

// Next Components
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Types
import { Page, Videos } from "@prisma/client";

export default function Pages(props: {
    hidden: boolean;
    data: Page;
    revalidateDashboard: any;
}) {
    // State list of background videos
    const [bgVideos, setBgVideos] = useState<Videos>([]);
    // Search params for which page edit to display
    const searchParams = useSearchParams();
    const pageEdit: string = searchParams.get("pageEdit")
        ? searchParams.get("pageEdit")!
        : "home";

    // Get initial videos
    useEffect(() => {
        fetch("/api/videos", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setBgVideos(json))
            .catch((err) => console.log(err));
    }, [props.data]);

    return (
        <>
            <div className={`${props.hidden ? "hidden" : ""} mx-20 fade-in`}>
                <div className="my-10 border-b py-4 text-3xl font-bold capitalize">
                    Pages
                </div>
                {/* Links for which page edit to display */}
                <div className="flex justify-evenly">
                    <Link
                        className={`${
                            pageEdit === "home"
                                ? "bg-orange-400"
                                : "bg-gray-400"
                        } w-full text-center mx-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=home"}>
                        Home
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "film"
                                ? "bg-orange-400"
                                : "bg-gray-400"
                        } w-full text-center mx-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=film"}>
                        Film
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "digital"
                                ? "bg-orange-400"
                                : "bg-gray-400"
                        } w-full text-center mx-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=digital"}>
                        Digital
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "light"
                                ? "bg-orange-400"
                                : "bg-gray-400"
                        } w-full text-center mx-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=light"}>
                        Light
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "events"
                                ? "bg-orange-400"
                                : "bg-gray-400"
                        } w-full text-center mx-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=events"}>
                        Events
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "art" ? "bg-orange-400" : "bg-gray-400"
                        } w-full text-center mx-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=art"}>
                        Art
                    </Link>
                </div>
                {/* Pre load all page edits and hide non selected */}
                {props.data.map((page: Page, index: number) => {
                    return (
                        <div key={index}>
                            <PageEdit
                                bgVideos={bgVideos}
                                revalidateDashboard={props.revalidateDashboard}
                                data={page}
                                hidden={pageEdit === page.title ? false : true}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
