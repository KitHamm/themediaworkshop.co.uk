"use client";

import { CircularProgress } from "@nextui-org/react";
import { CaseStudy, Logos, Page, Segment } from "@prisma/client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Header from "./header";

interface ExtendedPage extends Page {
    segment: ExtendedSegment[];
}
interface ExtendedSegment extends Segment {
    casestudy: CaseStudy[];
}
export default function MainHeader(props: {
    data: ExtendedPage;
    logoImages: Logos[];
}) {
    // Video ref
    const video = useRef<HTMLVideoElement>(null);
    // Video loading
    const [loading, setLoading] = useState(true);
    // Contact form states

    useEffect(() => {
        if (
            video.current?.readyState === 3 ||
            video.current?.readyState === 4
        ) {
            setLoading(false);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        // axios.post("/api/service", { page: props.data.title });
    }, []);

    return (
        <header id="header" className="w-full h-full">
            <section
                id="bg-video-container"
                className="relative top-0 left-0 w-full h-screen overflow-hidden">
                {props.data.video ? (
                    <>
                        <video
                            ref={video}
                            playsInline
                            disablePictureInPicture
                            id="bg-video"
                            className={`${
                                !loading ? "fade-in" : "opacity-0"
                            } h-screen w-auto xl:w-full z-20`}
                            autoPlay={true}
                            muted
                            onCanPlayThrough={() => setLoading(false)}
                            loop
                            src={
                                process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                props.data?.video
                            }
                        />
                        <div
                            className={`${
                                !loading ? "hidden" : "flex fade-in"
                            } absolute w-screen z-10 h-screen top-0 left-0 flex justify-center`}>
                            <CircularProgress
                                classNames={{
                                    track: "text-orange-600",
                                    indicator: "text-orange-600",
                                }}
                                aria-label="Loading..."
                            />
                        </div>
                    </>
                ) : (
                    <div className="no-video" />
                )}
                {/* Header section with content over full size video */}
                <Header
                    subTitle={props.data.subTitle ? props.data.subTitle : ""}
                    home={props.data.title === "home" ? true : false}
                    header={props.data.header ? props.data.header : ""}
                    description={
                        props.data.description ? props.data.description : ""
                    }
                    showreel={props.data.showreel ? props.data.showreel : ""}
                    year={props.data.year ? props.data.year : ""}
                    videoOneButtonText={
                        props.data.videoOneButtonText
                            ? props.data.videoOneButtonText
                            : ""
                    }
                    videoTwoButtonText={
                        props.data.videoTwoButtonText
                            ? props.data.videoTwoButtonText
                            : ""
                    }
                />
            </section>
        </header>
    );
}
