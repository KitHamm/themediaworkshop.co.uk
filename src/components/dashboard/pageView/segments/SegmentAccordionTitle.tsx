"use client";

import { ExtendedSegment } from "@/lib/types";
import { useSegmentAccordion } from "./SegmentAccordion";

const SegmentAccordionTitle = ({
	segment,
	index,
}: Readonly<{ segment: ExtendedSegment; index: number }>) => {
	const { toggleAccordion } = useSegmentAccordion();
	return (
		<button
			type="button"
			onClick={() => {
				toggleAccordion(index);
			}}
			className="xl:hover:bg-neutral-700 truncate transition-all w-full h-14 cursor-pointer flex px-4 gap-4"
		>
			<div className="my-auto flex gap-4">
				{segment.published ? (
					<div className="text-green-600 font-bold">LIVE</div>
				) : (
					<div className="text-red-400 font-bold">DRAFT</div>
				)}
				<div className="xl:text-base">
					{segment.title ? segment.title : "Untitled Segment"}
				</div>
			</div>
		</button>
	);
};

export default SegmentAccordionTitle;
