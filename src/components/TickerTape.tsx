"use client";

// Embla Carousel Components
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import { Logos } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TickerTape(props: { logoImages: Logos[] }) {
    const [emblaHeight, setEmblaHeight] = useState("auto");
    const OPTIONS: EmblaOptionsType = {
        align: "start",
        loop: true,
        watchDrag: false,
    };
    const [logos, setLogos] = useState<string[]>([]);
    useEffect(() => {
        let tempArray = [];
        for (let i = 0; i < props.logoImages.length; i++) {
            tempArray.push(props.logoImages[i].name);
        }
        tempArray.sort(function (a, b) {
            return a - b;
        });
        setLogos(tempArray);
    }, [props.logoImages]);

    const [emblaRef] = useEmblaCarousel(OPTIONS, [AutoScroll({ speed: 1 })]);
    return (
        <div className="w-full h-fit overflow-hidden bg-neutral-800">
            <div className="embla my-5 h-fit xl:my-6">
                <div className="embla__viewport" ref={emblaRef}>
                    <div
                        style={{ height: emblaHeight }}
                        className="embla__container">
                        {logos.map((image: string, index: number) => (
                            <div className="embla__slide_2 my-0" key={index}>
                                <Image
                                    onLoad={(e) => {
                                        if (emblaHeight === "auto") {
                                            setEmblaHeight(
                                                e.currentTarget.scrollHeight +
                                                    "px"
                                            );
                                            console.log(
                                                e.currentTarget.scrollHeight +
                                                    "px"
                                            );
                                        }
                                    }}
                                    className=" h-fit embla__slide__img_2"
                                    width={250}
                                    height={250}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_LOGO_URL +
                                        image
                                    }
                                    alt={image}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
