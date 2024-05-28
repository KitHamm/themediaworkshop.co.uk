// Prisma
import prisma from "@/lib/prisma";
// Components
import MainPage from "@/components/MainPage";
// Types
import { Page, Segment, CaseStudy } from "@prisma/client";
interface ExtendedPage extends Page {
    segment: ExtendedSegment[];
}
interface ExtendedSegment extends Segment {
    casestudy: CaseStudy[];
}
export default async function Home() {
    // Collect page data for specified page
    var pageData: ExtendedPage = null as any;
    const data = await prisma.page.findUnique({
        where: {
            title: "light",
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
    if (data !== null) {
        pageData = data as ExtendedPage;
    }
    // Main page component
    return <MainPage data={pageData} logoImages={logoImages} />;
}
