import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    return (
        <html lang="en">
            <body
                className={
                    lato.className +
                    " bg-neutral-900 text-white m-0 w-screen overflow-x-hidden"
                }>
                <Navbar active={"home"} />
                {children}
                <Footer />
            </body>
        </html>
    );
}
