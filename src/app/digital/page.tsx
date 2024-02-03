import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import { Page, Segment } from "@prisma/client";
import Header from "@/components/header";
import PageSegment from "@/components/PageSegment";

export default async function Home() {
    const data: Page = await prisma.page.findUnique({
        where: {
            title: "digital",
        },
        include: { segment: { include: { casestudy: true } } },
    });
    return (
        <>
            <Navbar active="digital" />
            <header id="header" className="h-full w-full">
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
            {data?.segment.map((segment: Segment, index: number) => {
                return (
                    <div key={segment.title}>
                        <PageSegment segment={segment} index={index} />
                    </div>
                );
            })}
        </>
    );
}
