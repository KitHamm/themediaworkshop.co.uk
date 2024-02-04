import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import { Page, Segment } from "@prisma/client";
import Header from "@/components/header";
import PageSegment from "@/components/PageSegment";
import Image from "next/image";

export default async function Home() {
    const data: Page = await prisma.page.findUnique({
        where: {
            title: "home",
        },
        include: {
            segment: {
                orderBy: { order: "asc" },
                include: { casestudy: true },
            },
        },
    });
    return (
        <>
            <Navbar active="home" />
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
                        src={
                            process.env.NEXT_PUBLIC_BASE_VIDEO_URL + data?.video
                        }
                    />
                    <Header
                        home={true}
                        header={data?.header}
                        description={data?.description}
                        showreel={data?.showreel}
                    />
                </section>
            </header>
            {data?.segment.map((segment: Segment, index: number) => {
                return (
                    <div key={segment.title}>
                        {segment.headerimage ? (
                            <div className="relative flex w-full bg-black h-96 overflow-hidden">
                                <Image
                                    width={2560}
                                    height={500}
                                    className="absolute w-full h-auto"
                                    alt={segment.headerimage}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                        segment.headerimage
                                    }
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        <PageSegment segment={segment} index={index} />
                    </div>
                );
            })}
            <Footer />
        </>
    );
}
