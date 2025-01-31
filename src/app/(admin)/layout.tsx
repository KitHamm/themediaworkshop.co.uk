// prisma
import prisma from "@/lib/prisma";
// packages
import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { signOut } from "next-auth/react";
// fonts
import { Lato } from "next/font/google";
// styles
import "../globals.css";
// functions
import { getViewport } from "@/data/getViewport";
import { getMetadata } from "@/data/getMetaData";
// components
import DesktopSideBar from "@/components/dashboard/layout/DesktopSideBar";
import MobileNav from "@/components/dashboard/layout/MobileNav";
// types
import { Message, Tickets, User } from "@prisma/client";

const lato = Lato({
	weight: ["100", "300", "400", "700", "900"],
	subsets: ["latin"],
});

export const viewport: Viewport = getViewport("#131313");

export const metadata: Metadata = getMetadata("TMW | Dashboard");

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authOptions);
	let messages: Message[] = [];
	let tickets: Tickets[] = [];
	let user: User | null = null;

	try {
		messages = await prisma.message.findMany({
			orderBy: [
				{
					createdAt: "desc",
				},
				{ name: "asc" },
			],
		});
		tickets = await prisma.tickets.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

		if (session) {
			user = await prisma.user.findUnique({
				where: {
					id: session.user.id as string,
				},
			});
		}
	} catch (error) {
		console.log("Unexpected error:", error);
	}

	if (!session || !user) {
		return signOut({ callbackUrl: "/" });
	}

	return (
		<html lang="en">
			<body
				className={
					lato.className +
					" bg-neutral-900 text-white m-0 w-screen overflow-x-hidden"
				}
			>
				<main className="xl:flex xl:h-auto min-h-screen">
					<div className="relative xl:h-auto xl:basis-1/6">
						<DesktopSideBar
							messages={messages}
							tickets={tickets}
							user={user}
						/>
						<MobileNav
							messages={messages}
							tickets={tickets}
							user={user}
						/>
					</div>
					<div className="xl:basis-5/6 min-h-screen">{children}</div>
				</main>
			</body>
		</html>
	);
}
