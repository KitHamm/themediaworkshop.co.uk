import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "The Media Workshop Ltd",
    description:
        "The Media Workshop is a digital production and development company who work creatively with new media and developing technologies.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <script
                    src="https://kit.fontawesome.com/9923e52d96.js"
                    crossOrigin="anonymous"
                    async
                />
            </head>
            <body className={lato.className + " bg-neutral-900 text-white m-0"}>
                {children}
            </body>
        </html>
    );
}
