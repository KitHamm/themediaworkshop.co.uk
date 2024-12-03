import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

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
    title: "The Media Workshop Ltd",
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
    return (
        <html lang="en">
            <body
                className={
                    lato.className +
                    " bg-neutral-900 text-white m-0 w-screen overflow-x-hidden"
                }>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
