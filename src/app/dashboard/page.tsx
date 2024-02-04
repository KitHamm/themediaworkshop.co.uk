import prisma from "@/lib/prisma";
import { Page } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import SidePanel from "@/components/dashboard/SidePanel";
import DashboardTop from "@/components/dashboard/DashboardTop";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { revalidatePath } from "next/cache";
import fs from "fs";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const data: Page = await prisma.page.findMany({
        orderBy: [
            {
                id: "asc",
            },
        ],
        include: {
            segment: {
                orderBy: { order: "asc" },
                include: { casestudy: true },
            },
        },
    });

    async function revalidateDashboard(route: string) {
        "use server";
        revalidatePath("/dashboard", "page");
        revalidatePath(route, "page");
    }
    // var initialVideos = await getVideos();
    return (
        <>
            <main className="xl:flex xl:min-h-screen">
                <div className="xl:basis-1/6">
                    <SidePanel session={session} />
                </div>
                <div className="xl:basis-5/6">
                    <DashboardMain
                        session={session}
                        revalidateDashboard={revalidateDashboard}
                        data={data}
                    />
                </div>
            </main>
        </>
    );
}
