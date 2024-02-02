"use client";

import { Page } from "@prisma/client";
import Header from "./header";

export default function BackgroundVideo(props: { data?: Page }) {
    <header id="header" className="w-full h-full">
        <section
            style={{ height: window.innerHeight + "px" }}
            id="bg-video-container"
            className="relative top-0 left-0 w-full overflow-hidden">
            <video
                id="bg-video"
                className="w-full h-auto fade-in"
                autoPlay={true}
                muted
                loop
                src={process.env.BASE_VIDEO_URL + props.data?.video}
            />
            <Header
                home={true}
                header={props.data?.header}
                description={props.data?.description}
            />
        </section>
    </header>;
}
