import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "../globals.css";
import SidePanel from "@/components/dashboard/SidePanel";
import prisma from "@/lib/prisma";
import { Message, Tickets, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";

const lato = Lato({
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
});

export const viewport: Viewport = {
    initialScale: 1,
    width: "device-width",
    minimumScale: 1,
    themeColor: "#131313",
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    title: "TMW | Dashboard",
    description:
        "The Media Workshop is a digital production and development company who work creatively with new media and developing technologies.",
    openGraph: {
        title: "The Media Workshop Ltd",
        description:
            "The Media Workshop is a digital production and development company who work creatively with new media and developing technologies.",
        url: "https://themediaworkshop.co.uk/",
        siteName: "The Media Workshop Ltd",
        locale: "en-US",
        type: "website",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    var user: User | null = null;
    if (session) {
        user = await prisma.user.findUnique({
            where: {
                id: session.user.id as string,
            },
        });
    }
    const messages: Message[] = await prisma.message.findMany({
        orderBy: [
            {
                createdAt: "desc",
            },
            { name: "asc" },
        ],
    });

    const tickets: Tickets[] = await prisma.tickets.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <html lang="en">
            <body
                className={
                    lato.className +
                    " bg-neutral-900 text-white m-0 w-screen overflow-x-hidden"
                }>
                <main className="xl:flex xl:h-auto min-h-screen">
                    <div className="relative xl:h-auto xl:basis-1/6">
                        {/* Side panel for dashboard showing user information */}
                        <SidePanel
                            messages={messages}
                            session={session}
                            tickets={tickets}
                            avatar={
                                user !== null
                                    ? user.image
                                        ? user.image
                                        : undefined
                                    : undefined
                            }
                        />
                    </div>
                    <div className="xl:basis-5/6 min-h-screen">{children}</div>
                </main>
            </body>
        </html>
    );
}
