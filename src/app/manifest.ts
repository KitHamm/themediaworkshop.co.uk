import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "The Media Workshop Ltd",
        short_name: "The Media Workshop Ltd",
        description:
            "The Media Workshop is a digital production and development company who work creatively with new media and developing technologies.",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#fff",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
