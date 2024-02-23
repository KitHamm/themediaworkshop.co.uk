// Prisma
import prisma from "@/lib/prisma";
// Components
import MainPage from "@/components/MainPage";
// Types
import { Logos, Page } from "@prisma/client";

export default async function Home() {
    // Collect page data for specified page
    const data: Page = await prisma.page.findUnique({
        where: {
            title: "digital",
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
    const logoImages: Logos = await prisma.logos.findMany();
    // Main page component
    return <MainPage data={data} logoImages={logoImages} />;
}
