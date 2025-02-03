"use client";
// packages
import { Children, useRef, createContext, useContext, useMemo } from "react";

const accordionBaseHeight = "3.5rem";

type SegmentAccordionContextType = {
	toggleAccordion: (index: number) => void;
};

const SegmentAccordionContext = createContext<SegmentAccordionContextType>(
	{} as SegmentAccordionContextType
);

const SegmentAccordion = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const accordionItem = useRef<HTMLDivElement[]>([]);

	const toggleAccordion = (index: number) => {
		const items = accordionItem.current;
		items.forEach((item, i) => {
			if (i === index) {
				if (item.style.height === accordionBaseHeight) {
					item.style.height = `${item.scrollHeight}px`;
				} else {
					item.style.height = accordionBaseHeight;
				}
			} else {
				item.style.height = accordionBaseHeight;
			}
		});
	};

	const accordionContextValue = useMemo(
		() => ({
			toggleAccordion,
		}),
		[toggleAccordion]
	);

	return (
		<div id="segment-accordion" className="mb-10">
			{Children.map(children, (child, index) => {
				return (
					<div
						key={"accordion-" + index}
						id={"accordion-" + index}
						ref={(el: HTMLDivElement) => {
							accordionItem.current![index] = el;
						}}
						style={{ height: accordionBaseHeight }}
						className="drop-shadow-lg overflow-hidden transition-all rounded-lg mx-2 mb-2 bg-zinc-800"
					>
						<SegmentAccordionContext.Provider
							value={accordionContextValue}
						>
							{child}
						</SegmentAccordionContext.Provider>
					</div>
				);
			})}
		</div>
	);
};
export const useSegmentAccordion = () => useContext(SegmentAccordionContext);
export default SegmentAccordion;
