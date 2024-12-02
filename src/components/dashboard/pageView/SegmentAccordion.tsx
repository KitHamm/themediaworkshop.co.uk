"use client";

import { ExtendedSegment } from "@/lib/types";
import { useRef } from "react";
import EditSegmentAccordionInner from "./EditSegmentAccordionInner";

const accordionBaseHeight = "3.5rem";

export default function SegmentAccordion(props: {
    segments: ExtendedSegment[];
}) {
    const { segments } = props;
    const accordionItem = useRef<HTMLDivElement[]>([]);

    function toggleAccordion(index: number) {
        for (let i = 0; i < accordionItem.current.length; i++) {
            if (accordionItem.current[i].id === "accordion-" + index) {
                if (
                    accordionItem.current[i].style.height ===
                    accordionBaseHeight
                ) {
                    accordionItem.current[i].style.height =
                        accordionItem.current[i].scrollHeight + "px";
                } else {
                    accordionItem.current[i].style.height = accordionBaseHeight;
                }
            } else {
                accordionItem.current[i].style.height = accordionBaseHeight;
            }
        }
    }

    return (
        <div id="segment-accordion" className="mb-10">
            {segments.map((segment: ExtendedSegment, index: number) => {
                return (
                    <div
                        id={"accordion-" + index}
                        ref={(el: HTMLDivElement) => {
                            accordionItem.current![index] = el;
                        }}
                        key={"segment-" + index + "-accordion"}
                        style={{ height: accordionBaseHeight }}
                        className="drop-shadow-lg overflow-hidden transition-all rounded-lg mx-2 mb-2 bg-zinc-800">
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                toggleAccordion(index);
                            }}
                            className="xl:hover:bg-neutral-700 truncate transition-all w-full h-14 cursor-pointer flex px-4 gap-4">
                            <div className="my-auto flex gap-4">
                                {segment.published ? (
                                    <div className="text-green-600 font-bold">
                                        LIVE
                                    </div>
                                ) : (
                                    <div className="text-red-400 font-bold">
                                        DRAFT
                                    </div>
                                )}
                                <div className="xl:text-base">
                                    {segment.title
                                        ? segment.title
                                        : "Untitled Segment"}
                                </div>
                            </div>
                        </div>
                        <div className="px-4">
                            <EditSegmentAccordionInner segment={segment} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
