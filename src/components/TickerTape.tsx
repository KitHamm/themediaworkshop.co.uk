"use client";

// Embla Carousel Components
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import { Logos } from "@prisma/client";
import Image from "next/image";

export default function TickerTape(props: { logoImages: Logos }) {
    const OPTIONS: EmblaOptionsType = {
        align: "start",
        loop: true,
        watchDrag: false,
    };
    const [emblaRef] = useEmblaCarousel(OPTIONS, [AutoScroll({ speed: 1 })]);
    return (
        <div className="w-full overflow-hidden bg-neutral-800">
            <div className="embla my-5 xl:my-10">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {props.logoImages.map((image: Logos, index: number) => (
                            <div className="embla__slide_2" key={index}>
                                <Image
                                    className="embla__slide__img_2"
                                    width={250}
                                    height={250}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_LOGO_URL +
                                        image.name
                                    }
                                    alt={image.name}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
