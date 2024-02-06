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
            title: "art",
        },
        include: {
            segment: {
                orderBy: { order: "asc" },
                include: { casestudy: true },
            },
        },
    });
    // Main page component
    return <MainPage data={data} />;
}
