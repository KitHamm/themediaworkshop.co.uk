import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "../globals.css";
import SidePanel from "@/components/dashboard/SidePanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import prisma from "@/lib/prisma";
import { Message, Tickets, User } from "@prisma/client";

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
    title: "TMW | Dashboard",
    description:
        "The Media Workshop is a digital production and development company who work creatively with new media and developing technologies.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={
                    lato.className +
                    " bg-neutral-900 text-white m-0 w-screen overflow-x-hidden"
                }>
                <main className="xl:flex xl:h-auto min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
