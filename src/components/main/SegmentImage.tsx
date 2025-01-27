"use client";
// packages
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
// types
import { EmblaOptionsType } from "embla-carousel";

const SegmentImage = ({
	index,
	images,
}: Readonly<{
	index: number;
	images: string[];
}>) => {
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

	const left: boolean = index % 2 === 0;

	return (
		<div className="text-center flex">
			<div
				className={`${
					left ? "ms-0 xl:-ms-24" : "ms-0 xl:-me-24"
				}  relative my-auto`}
			>
				{images.length > 1 ? (
					<div className="embla" dir={left ? "ltr" : "rtl"}>
						<div
							className="embla__viewport"
							ref={left ? emblaRef : emblaRefRTL}
						>
							<div className="embla__container">
								{images.map((image: string) => {
									return (
										<div
											className="embla__slide w-full h-auto"
											key={image}
										>
											<Image
												width={900}
												height={500}
												className="embla__slide__img"
												src={
													process.env
														.NEXT_PUBLIC_CDN +
													"/images/" +
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
						src={
							process.env.NEXT_PUBLIC_CDN + "/images/" + images[0]
						}
						alt={images[0]}
						className="w-full h-auto"
					/>
				)}
				<div className={left ? "gradient-left" : "gradient-right"} />
			</div>
		</div>
	);
};

export default SegmentImage;
