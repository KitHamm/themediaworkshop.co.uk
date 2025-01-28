"use client";
// packages
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Markdown from "react-markdown";
// functions
import addAnchorLinks from "@/lib/utils/pageUtils/addAnchorLinks";
// types
import { toLink } from "@prisma/client";

const SegmentText = ({
	children,
	index,
	linkTo,
	title,
	copy,
}: Readonly<{
	children: React.ReactNode;
	index: number;
	linkTo: toLink;
	title: string | null;
	copy: string | null;
}>) => {
	const copyText = useRef<HTMLDivElement>(null);
	const { ref, inView } = useInView({
		threshold: 0.1,
	});

	useEffect(() => {
		const el = document.getElementById(`fade-${index}`);
		if (!el || !inView) return;

		if (el.classList.contains("opacity-0")) {
			const animationClass =
				index % 2 === 0 ? "slide-in-right" : "slide-in-left";
			el.classList.replace("opacity-0", animationClass);
		}
	}, [index, inView]);

	useEffect(() => {
		addAnchorLinks(copyText.current);
	}, []);

	return (
		<div
			id={"fade-" + index}
			className={`${
				index % 2 === 0 ? "xl:order-first" : "xl:order-last"
			} order-first grid grid-cols-1 opacity-0 text-center my-auto z-20`}
		>
			<div className="xl:h-20 flex justify-center">
				{linkTo !== "NONE" ? (
					<Link
						className="hover:text-orange-600 transition-all uppercase font-bold mt-auto text-3xl"
						href={"/" + linkTo.toLowerCase()}
					>
						{title}
					</Link>
				) : (
					<div className="uppercase font-bold text-3xl mt-auto">
						{title}
					</div>
				)}
			</div>
			<div ref={ref}>
				<div
					ref={copyText}
					className="copy-text text-justify text-md xl:text-lg my-4"
				>
					<Markdown>{copy}</Markdown>
				</div>
			</div>
			<div className="xl:h-20 flex justify-center">{children}</div>
		</div>
	);
};

export default SegmentText;
