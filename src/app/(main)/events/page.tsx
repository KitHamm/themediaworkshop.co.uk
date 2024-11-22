// Prisma
import prisma from "@/lib/prisma";
// Types
import MainHeader from "@/components/MainHeader";
import TickerTape from "@/components/TickerTape";
import PageSegment from "@/components/PageSegment";
import { ExtendedPage, ExtendedSegment } from "@/lib/types";
export default async function Home() {
    // Collect data for specified page

    const data = await prisma.page.findUnique({
        where: {
            title: "events",
        },
        include: {
            segment: {
                where: { published: true },
                orderBy: { order: "asc" },
                include: {
                    casestudy: {
                        where: { published: true },
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
    });
    const logoImages = await prisma.logos.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <>
            {/* Full size background video */}
            <MainHeader data={data as ExtendedPage} logoImages={logoImages} />
            {/* Top Ticker Tape */}
            {logoImages.length > 0 && (
                <div className="my-8">
                    <TickerTape start={true} logoImages={logoImages} />
                </div>
            )}
            {/* Iterate over segments and display in sequence */}
            {data?.segment.map((segment: ExtendedSegment, index: number) => {
                return (
                    <div key={segment.title}>
                        <PageSegment segment={segment} index={index} />
                    </div>
                );
            })}
            {/* Bottom Ticker Tape */}
            {logoImages.length > 0 && (
                <TickerTape start={false} logoImages={logoImages} />
            )}
        </>
    );
}
