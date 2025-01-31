"use client";
// packages
import { useEffect, useRef } from "react";
// functions
import handleChevronOnScroll from "@/lib/utils/pageUtils/onChevronScroll";

const ScrollChevrons = () => {
	const chevron = useRef<HTMLDivElement>(null);

	useEffect(() => {
		window.addEventListener("scroll", () =>
			handleChevronOnScroll(chevron.current!)
		);
		setTimeout(() => {
			if (document.body.getBoundingClientRect().top === 0) {
				chevron.current?.classList.replace("opacity-0", "opacity-100");
			}
		}, 10000);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div
			ref={chevron}
			className="transition-opacity ease-in-out opacity-0 w-full absolute left-0 right-0 text-center bottom-40 xl:bottom-10"
		>
			<div className="flex flex-col gap-4">
				{Array.from({ length: 3 }, (_, i) => (
					<i
						key={"chevron-" + i}
						aria-hidden
						className="chevron fa-solid fa-chevron-down fa-xl"
					/>
				))}
			</div>
		</div>
	);
};

export default ScrollChevrons;
