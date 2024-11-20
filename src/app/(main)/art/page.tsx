// Prisma
import prisma from "@/lib/prisma";
// Types
import MainHeader from "@/components/MainHeader";
import TickerTape from "@/components/TickerTape";
import PageSegment from "@/components/PageSegment";
import { ExtendedPage, ExtendedSegment } from "@/components/types/customTypes";
export default async function Home() {
    // Collect data for specified page

    const data = await prisma.page.findUnique({
        where: {
            title: "art",
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
                <div className="mt-8">
                    <TickerTape top={true} logoImages={logoImages} />
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
                <TickerTape top={false} logoImages={logoImages} />
            )}
        </>
    );
}
