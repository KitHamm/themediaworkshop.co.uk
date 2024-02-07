"use client";

// React Components
import { useEffect, useState } from "react";

// Next Components
import Image from "next/image";

// Types
import { Segment } from "@prisma/client";

export default function PageSegment(props: {
    segment: Segment;
    index: number;
}) {
    const [parallaxValue, setParallaxValue] = useState(0);
    useEffect(() => {
        const headerImage = document.getElementById(
            "segment-header-image-" + props.index
        ) as HTMLElement;
        if (headerImage) {
            onScroll();
            headerImage.classList.replace("opacity-0", "fade-in");
            window.addEventListener("scroll", onScroll);
        }
    }, []);

    function onScroll() {
        const headerImageContainer = document.getElementById(
            "segment-header-image-container-" + props.index
        ) as HTMLElement;
        const headerImage = document.getElementById(
            "segment-header-image-" + props.index
        ) as HTMLElement;
        const containerHeight = headerImageContainer.offsetHeight;
        const imageHeight = headerImage.offsetHeight;
        if (
            headerImageContainer.getBoundingClientRect().top <
                window.innerHeight &&
            headerImageContainer.getBoundingClientRect().top >
                0 - containerHeight
        ) {
            setParallaxValue(
                0 -
                    mapNumRange(
                        headerImageContainer.getBoundingClientRect().top,
                        window.innerHeight,
                        0,
                        imageHeight - containerHeight,
                        0
                    )
            );
        }
    }

    const mapNumRange = (
        num: number,
        inMin: number,
        inMax: number,
        outMin: number,
        outMax: number
    ) => ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

    return (
        <>
            {/* If section header image, display image */}
            {props.segment.headerimage ? (
                <div
                    id={"segment-header-image-container-" + props.index}
                    className="relative flex w-full bg-black h-96 overflow-hidden segment-header-image">
                    <Image
                        id={"segment-header-image-" + props.index}
                        style={{ top: parallaxValue + "px" }}
                        width={2560}
                        height={500}
                        className="opacity-0 absolute w-full h-auto"
                        alt={props.segment.headerimage}
                        src={
                            process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                            props.segment.headerimage
                        }
                    />
                </div>
            ) : (
                ""
            )}
            <div className="xl:grid xl:grid-cols-2 w-full px-60 py-10">
                {props.index % 2 === 0 ? (
                    <div className="text-center my-auto z-20">
                        <div className="uppercase font-bold text-3xl mb-4">
                            {props.segment.title}
                        </div>
                        <div className="text-justify text-lg">
                            {props.segment.copy}
                        </div>
                    </div>
                ) : (
                    ""
                )}
                <div className="text-center">
                    <div
                        className={`${
                            props.index % 2 === 0 ? "-ms-24" : "-me-24"
                        }  relative`}>
                        <Image
                            width={900}
                            height={500}
                            src={
                                process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                props.segment.image[0]
                            }
                            alt="Placeholder"
                            className="w-full h-auto"
                        />
                        <div
                            className={
                                props.index % 2 === 0
                                    ? "gradient-left"
                                    : "gradient-right"
                            }
                        />
                    </div>
                </div>
                {props.index % 2 !== 0 ? (
                    <div className="text-center z-20 m-auto">
                        <div className="uppercase font-bold text-3xl mb-4">
                            {props.segment.title}
                        </div>
                        <div className="text-justify text-lg">
                            {props.segment.copy}
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </>
    );
}
