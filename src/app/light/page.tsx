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
            title: "light",
        },
        include: {
            segment: {
                orderBy: { order: "asc" },
                include: { casestudy: { orderBy: { order: "asc" } } },
            },
        },
    });
    // Main page component
    return <MainPage data={data} />;
}
