import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "../globals.css";
import SidePanel from "@/components/dashboard/SidePanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import prisma from "@/lib/prisma";
import { Message } from "@prisma/client";

const lato = Lato({
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
});

export const viewport: Viewport = {
    initialScale: 1,
    width: "device-width",
    minimumScale: 1,
};

export const metadata: Metadata = {
    title: "The Media Workshop Ltd",
    description:
        "The Media Workshop is a digital production and development company who work creatively with new media and developing technologies.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    const messages: Message[] = await prisma.message.findMany({
        orderBy: [
            {
                createdAt: "desc",
            },
            { name: "asc" },
        ],
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
                        <SidePanel messages={messages} session={session} />
                    </div>
                    <div className="xl:basis-5/6 min-h-screen">
                        {/* Main dashboard panel with all views available */}
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
