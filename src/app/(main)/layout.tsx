// packages
import type { Metadata, Viewport } from "next";
// fonts
import { Lato } from "next/font/google";
// styles
import "../globals.css";
// functions
import { getMetadata } from "@/data/getMetaData";
import { getViewport } from "@/data/getViewport";
// components
import Navbar from "@/components/main/layout/Navbar";
import Footer from "@/components/main/layout/Footer";

const lato = Lato({
	weight: ["100", "300", "400", "700", "900"],
	subsets: ["latin"],
});

export const viewport: Viewport = getViewport("#131313");

export const metadata: Metadata = getMetadata("The Media Workshop Ltd");

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
				}
			>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
