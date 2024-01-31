import prisma from "@/lib/prisma";
import { Page } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import SidePanel from "@/components/dashboard/SidePanel";
import DashboardTop from "@/components/dashboard/DashboardTop";
import DashboardMain from "@/components/dashboard/DashboardMain";
import { revalidatePath } from "next/cache";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    const data: Page = await prisma.page.findMany({
        include: {
            segment: { include: { casestudy: true } },
        },
    });

    async function revalidateDashboard() {
        "use server";
        revalidatePath("/dashboard", "page");
    }

    return (
        <>
            <main className="xl:flex xl:min-h-screen">
                <div className="xl:basis-1/6">
                    <SidePanel session={session} />
                </div>
                <div className="xl:basis-5/6">
                    <DashboardTop />
                    <DashboardMain
                        revalidateDashboard={revalidateDashboard}
                        data={data}
                    />
                </div>
            </main>
        </>
    );
}
