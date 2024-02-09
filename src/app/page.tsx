// Prisma
import prisma from "@/lib/prisma";
// Components
import MainPage from "@/components/MainPage";
// Types
import { Page } from "@prisma/client";

export default async function Home() {
    // Collect page data for specified page
    const data: Page = await prisma.page.findUnique({
        where: {
            title: "home",
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
    // Main page component
    return <MainPage data={data} />;
}
