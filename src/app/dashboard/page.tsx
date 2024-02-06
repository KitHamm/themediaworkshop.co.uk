//  Prisma
import prisma from "@/lib/prisma";
//  Components
import SidePanel from "@/components/dashboard/SidePanel";
import DashboardMain from "@/components/dashboard/DashboardMain";
//  Types
import { Page } from "@prisma/client";
//  Functions
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { revalidatePath } from "next/cache";

// Function for revalidating the dashboard route as well as the page route that the content relates to
export async function revalidateDashboard(route: string) {
    "use server";
    revalidatePath("/dashboard", "page");
    revalidatePath(route, "page");
}

export default async function Dashboard() {
    //  Collect session data
    const session = await getServerSession(authOptions);
    //  Collect all page data including segments and case studies for CMS
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

    return (
        <main className="xl:flex xl:min-h-screen">
            <div className="xl:basis-1/6">
                {/* Side panel for dashboard showing user information */}
                <SidePanel session={session} />
            </div>
            <div className="xl:basis-5/6">
                {/* Main dashboard panel with all views available */}
                <DashboardMain
                    revalidateDashboard={revalidateDashboard}
                    session={session}
                    data={data}
                />
            </div>
        </main>
    );
}
