"use client";

import { mapNumRange, parallaxOnScroll } from "@/lib/functions";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ParallaxImage(props: { headerImage: string | null }) {
    const { headerImage } = props;

    //  Parallax States
    const [parallaxValue, setParallaxValue] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // Parallax element ref
    const headerImageContainerEl = useRef<HTMLDivElement>(null);
    const headerImageEl = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (headerImageContainerEl.current && headerImageEl.current) {
            parallaxOnScroll(
                headerImageContainerEl.current,
                headerImageEl.current,
                setParallaxValue,
                setContainerHeight
            );
            headerImageEl.current.classList.replace("opacity-0", "fade-in");
            window.addEventListener("scroll", () =>
                parallaxOnScroll(
                    headerImageContainerEl.current!,
                    headerImageEl.current!,
                    setParallaxValue,
                    setContainerHeight
                )
            );
        }
    }, []);

    if (headerImage) {
        return (
            <div
                style={{ height: containerHeight + "px" }}
                ref={headerImageContainerEl}
                className="relative flex w-full bg-black justify-center overflow-hidden segment-header-image">
                <Image
                    ref={headerImageEl}
                    style={{ top: parallaxValue + "px" }}
                    width={2560}
                    height={500}
                    className="opacity-0 absolute w-[200%] h-auto xl:w-full xl:w-full xl:h-auto"
                    alt={headerImage}
                    src={process.env.NEXT_PUBLIC_BASE_IMAGE_URL + headerImage}
                />
            </div>
        );
    }
}
