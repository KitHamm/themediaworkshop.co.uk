"use client";

// Components
import PageEdit from "./PageEdit";

// React Components
import { useState, useEffect } from "react";

// Next Components
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Types
import { Page, Segment, CaseStudy, Videos, Images } from "@prisma/client";
interface ExtendedPage extends Page {
    segment: ExtendedSegment[];
}
interface ExtendedSegment extends Segment {
    casestudy: CaseStudy[];
}
export default function Pages(props: {
    hidden: boolean;
    data: Page[];
    videos: Videos[];
    images: Images[];
    segments: Segment[];
    caseStudies: CaseStudy[];
}) {
    // State list of background videos
    // Search params for which page edit to display
    const searchParams = useSearchParams();
    const pageEdit: string = searchParams.get("pageEdit")
        ? searchParams.get("pageEdit")!
        : "home";

    return (
        <>
            <div
                className={`${
                    props.hidden ? "hidden" : ""
                } xl:mx-20 mx-4 fade-in`}>
                <div className="xl:my-10 mb-4 border-b py-4 text-3xl font-bold capitalize">
                    Pages
                </div>
                {/* Links for which page edit to display */}
                <div className="grid grid-cols-3 xl:grid-cols-6 xl:flex-nowrap gap-2 xl:gap-4">
                    <Link
                        className={`${
                            pageEdit === "home"
                                ? "bg-orange-600"
                                : "bg-gray-400"
                        } xl:w-full text-center xl:mx-4 px-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=home"}>
                        Home
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "film"
                                ? "bg-orange-600"
                                : "bg-gray-400"
                        } xl:w-full text-center xl:mx-4 px-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=film"}>
                        Film
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "digital"
                                ? "bg-orange-600"
                                : "bg-gray-400"
                        } xl:w-full text-center xl:mx-4 px-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=digital"}>
                        Digital
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "light"
                                ? "bg-orange-600"
                                : "bg-gray-400"
                        } xl:w-full text-center xl:mx-4 px-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=light"}>
                        Light
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "events"
                                ? "bg-orange-600"
                                : "bg-gray-400"
                        } xl:w-full text-center xl:mx-4 px-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=events"}>
                        Events
                    </Link>
                    <Link
                        className={`${
                            pageEdit === "art" ? "bg-orange-600" : "bg-gray-400"
                        } xl:w-full text-center xl:mx-4 px-4 py-2 rounded`}
                        href={"?view=pages&pageEdit=art"}>
                        Art
                    </Link>
                </div>
                {/* Pre render and hide unselected pages to preserve form states */}
                {props.data.map((data: Page, index: number) => {
                    return (
                        <PageEdit
                            key={"page-" + index}
                            hidden={pageEdit !== data.title}
                            segments={props.segments}
                            images={props.images}
                            data={data}
                            videos={props.videos}
                            caseStudies={props.caseStudies}
                        />
                    );
                })}
            </div>
        </>
    );
}
