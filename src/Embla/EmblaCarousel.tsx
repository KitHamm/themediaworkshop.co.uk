// packages
import Image from "next/image";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
// components
import {
	PrevButton,
	NextButton,
	usePrevNextButtons,
} from "../Embla/EmblaCarouselArrowButtons";

// Carousel for segment inner main view
export const EmblaCarouselCaseStudyInner = ({
	slides,
}: Readonly<{
	slides: string[];
}>) => {
	const OPTIONS: EmblaOptionsType = { align: "start", loop: true };
	const [emblaRef] = useEmblaCarousel(OPTIONS, [Autoplay({ delay: 3000 })]);

	return (
		<div className="embla">
			<div className="embla__viewport" ref={emblaRef}>
				<div className="embla__container">
					{slides.map((image: string, index: number) => (
						<div className="embla__slide w-full h-auto" key={index}>
							<Image
								className="embla__slide__img cursor-pointer"
								width={900}
								height={500}
								src={
									process.env.NEXT_PUBLIC_CDN +
									"/images/" +
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
};

// Carousel for segment focused view
export const EmblaCarouselCaseStudyView = ({
	slides,
}: Readonly<{
	slides: string[];
}>) => {
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
		<div className="embla relative">
			{/* <div className="embla__buttons"> */}
			<PrevButton
				onClick={onPrevButtonClick}
				disabled={prevBtnDisabled}
			/>
			<NextButton
				onClick={onNextButtonClick}
				disabled={nextBtnDisabled}
			/>
			{/* </div> */}
			<div className="embla__viewport" ref={emblaRef}>
				<div className="embla__container">
					{slides.map((image: string, index: number) => (
						<div className="embla__slide w-full h-auto" key={index}>
							<Image
								className="embla__slide__img cursor-pointer"
								width={900}
								height={500}
								src={
									process.env.NEXT_PUBLIC_CDN +
									"/images/" +
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
};
