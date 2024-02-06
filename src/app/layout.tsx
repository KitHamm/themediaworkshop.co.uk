import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
    weight: ["100", "300", "400", "700", "900"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "The Media Workshop",
    description:
        "The Media Workshop is made up of a wide network of digital specialists, producers and creative professionals with a vast level of experience in a range of specialist areas. We are built around an ethos of creative innovation, developing the potential in technology for a range of clients and markets.",
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
