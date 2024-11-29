"use client";

import { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function SegmentImage(props: {
    index: number;
    images: string[];
}) {
    const { index, images } = props;

    const OPTIONS: EmblaOptionsType = { align: "start", loop: true };
    const OPTIONSRTL: EmblaOptionsType = {
        align: "start",
        direction: "rtl",
        loop: true,
    };

    const [emblaRef] = useEmblaCarousel(OPTIONS, [Autoplay({ delay: 6000 })]);
    const [emblaRefRTL] = useEmblaCarousel(OPTIONSRTL, [
        Autoplay({ delay: 6000 }),
    ]);

    return (
        <div className="text-center">
            <div
                className={`${
                    index % 2 === 0 ? "ms-0 xl:-ms-24" : "ms-0 xl:-me-24"
                }  relative`}>
                {images.length > 1 ? (
                    <div
                        className="embla"
                        dir={index % 2 === 0 ? "ltr" : "rtl"}>
                        <div
                            className="embla__viewport"
                            ref={index % 2 === 0 ? emblaRef : emblaRefRTL}>
                            <div className="embla__container">
                                {images.map((image: string, index: number) => {
                                    return (
                                        <div
                                            className="embla__slide w-full h-auto"
                                            key={index}>
                                            <Image
                                                width={900}
                                                height={500}
                                                className="embla__slide__img"
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                    image
                                                }
                                                alt={image}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Image
                        width={900}
                        height={500}
                        src={process.env.NEXT_PUBLIC_BASE_IMAGE_URL + images[0]}
                        alt={images[0]}
                        className="w-full h-auto"
                    />
                )}
                <div
                    className={
                        index % 2 === 0 ? "gradient-left" : "gradient-right"
                    }
                />
            </div>
        </div>
    );
}
