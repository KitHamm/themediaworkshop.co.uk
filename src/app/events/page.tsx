import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import { Page } from "@prisma/client";
import Header from "@/components/header";

export default async function Home() {
    const data: Page = await prisma.page.findUnique({
        where: {
            title: "events",
        },
    });
    return (
        <>
            <Navbar active="events" />
            <header id="header" className="w-full h-full">
                <section
                    id="bg-video-container"
                    className="relative top-0 left-0 w-full h-screen overflow-hidden">
                    <video
                        id="bg-video"
                        className="w-full h-auto fade-in"
                        autoPlay={true}
                        muted
                        loop
                        src={process.env.BASE_VIDEO_URL + data?.video}
                    />
                    <Header
                        home={false}
                        header={data?.header}
                        description={data?.description}
                    />
                </section>
            </header>
        </>
    );
}
