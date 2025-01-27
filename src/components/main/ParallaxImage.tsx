"use client";
// packages
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
// functions
import { parallaxOnScroll } from "@/lib/functions";

const ParallaxImage = ({
	headerImage,
}: Readonly<{ headerImage: string | null }>) => {
	const [parallaxValue, setParallaxValue] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);
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
				className="relative flex w-full bg-black justify-center overflow-hidden segment-header-image"
			>
				<Image
					ref={headerImageEl}
					style={{ top: parallaxValue + "px" }}
					width={2560}
					height={500}
					className="opacity-0 absolute w-[200vw] h-auto xl:w-screen"
					alt={headerImage}
					src={process.env.NEXT_PUBLIC_CDN + "/images/" + headerImage}
				/>
			</div>
		);
	}
};

export default ParallaxImage;
