"use client";
// packages
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
// functions
import addAnchorLinks from "@/lib/utils/pageUtils/addAnchorLinks";

const HeaderCopy = ({ description }: Readonly<{ description: string }>) => {
	const copyText = useRef<HTMLDivElement>(null);

	useEffect(() => {
		addAnchorLinks(copyText.current);
	}, []);

	return (
		<div
			ref={copyText}
			className="copy-text slide-up min-h-20 xl:min-w-96 px-4 py-4 xl:py-0 text-justify text-md xl:text-lg"
		>
			<Markdown>{description}</Markdown>
		</div>
	);
};

export default HeaderCopy;
