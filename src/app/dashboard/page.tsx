//  Prisma
import prisma from "@/lib/prisma";
//  Components
import SidePanel from "@/components/dashboard/SidePanel";
import DashboardMain from "@/components/dashboard/DashboardMain";
//  Types
import { Message, Page } from "@prisma/client";
//  Functions
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { revalidatePath } from "next/cache";

export default async function Dashboard() {
    // Function for revalidating the dashboard route as well as the page route that the content relates to
    async function revalidateDashboard(route: string) {
        "use server";
        revalidatePath("/dashboard", "page");
        revalidatePath(route, "page");
    }
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
                include: { casestudy: { orderBy: { order: "asc" } } },
            },
        },
    });

    const messages: Message = await prisma.message.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="xl:flex xl:h-auto min-h-screen">
            <div className="relative xl:h-auto xl:basis-1/6">
                {/* Side panel for dashboard showing user information */}
                <SidePanel messages={messages} session={session} />
            </div>
            <div className="xl:basis-5/6 min-h-screen">
                {/* Main dashboard panel with all views available */}
                <DashboardMain
                    messages={messages}
                    revalidateDashboard={revalidateDashboard}
                    session={session}
                    data={data}
                />
            </div>
        </main>
    );
}
