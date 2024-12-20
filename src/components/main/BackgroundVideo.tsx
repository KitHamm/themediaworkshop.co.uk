"use client";

import { CircularProgress } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

export default function BackgroundVideo(props: {
    backgroundVideo: string | null | undefined;
}) {
    const { backgroundVideo } = props;

    // Video ref
    const video = useRef<HTMLVideoElement>(null);
    // Video loading
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (video.current && video.current.readyState > 3) {
            setLoading(false);
        }
    }, [video.current?.readyState]);

    if (!backgroundVideo) {
        return <div className="no-video" />;
    }

    const posterUrl = backgroundVideo.split(".")[0] + ".webp";

    return (
        <>
            <video
                ref={video}
                playsInline
                disablePictureInPicture
                id="bg-video"
                className={`fade-in h-screen w-auto xl:w-full z-20`}
                poster={
                    process.env.NEXT_PUBLIC_CDN + "/videos/posters/" + posterUrl
                }
                autoPlay={true}
                muted
                loop
                src={process.env.NEXT_PUBLIC_CDN + "/videos/" + backgroundVideo}
            />
            {/* <div
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
            </div> */}
        </>
    );
}
