// Separate instances of Embla carousels to make sure they all work independently

// Next Components
import Image from "next/image";

// Embla Carousel Components
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons,
} from "../Embla/EmblaCarouselArrowButtons";

// Carousel for segment inner main view
export function EmblaCarouselCaseStudyInner(props: { slides: string[] }) {
    const OPTIONS: EmblaOptionsType = { align: "start", loop: true };
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
        Autoplay({ delay: 3000 }),
    ]);

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {props.slides.map((image: string, index: number) => (
                        <div className="embla__slide w-full h-auto" key={index}>
                            <Image
                                className="embla__slide__img cursor-pointer"
                                width={900}
                                height={500}
                                src={
                                    process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                    image
                                }
                                alt={image}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Carousel for segment focused view
export function EmblaCarouselCaseStudyView(props: { slides: string[] }) {
    const OPTIONS: EmblaOptionsType = {
        align: "start",
        containScroll: "trimSnaps",
        loop: true,
    };
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {props.slides.map((image: string, index: number) => (
                        <div className="embla__slide w-full h-auto" key={index}>
                            <Image
                                className="embla__slide__img cursor-pointer"
                                width={900}
                                height={500}
                                src={
                                    process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                    image
                                }
                                alt={image}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="embla__buttons">
                <PrevButton
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                />
                <NextButton
                    onClick={onNextButtonClick}
                    disabled={nextBtnDisabled}
                />
            </div>
        </div>
    );
}
