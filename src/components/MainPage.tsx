// Components
import Image from "next/image";
import Header from "./header";
import Navbar from "./Navbar";
import PageSegment from "./PageSegment";
import Footer from "./Footer";
// Types
import { Page, Segment } from "@prisma/client";

export default function MainPage(props: { data: Page }) {
    return (
        <>
            {/* Navbar with specified active page */}
            <Navbar active={props.data.title} />
            {/* Full size background video */}
            <header id="header" className="w-full h-full">
                <section
                    id="bg-video-container"
                    className="relative top-0 left-0 w-full h-[100dvh] overflow-hidden">
                    <video
                        id="bg-video"
                        className="h-[100dvh] w-auto xl:w-full xl:h-auto fade-in"
                        autoPlay={true}
                        muted
                        loop
                        src={
                            process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                            props.data?.video
                        }
                    />
                    {/* Header section with content over full size video */}
                    <Header
                        home={props.data.title === "home" ? true : false}
                        header={props.data.header}
                        description={props.data.description}
                        showreel={props.data.showreel}
                    />
                </section>
            </header>
            {/* Iterate over segments and display in sequence */}
            {props.data?.segment.map((segment: Segment, index: number) => {
                return (
                    <div key={segment.title}>
                        <PageSegment segment={segment} index={index} />
                    </div>
                );
            })}
            <Footer />
        </>
    );
}
