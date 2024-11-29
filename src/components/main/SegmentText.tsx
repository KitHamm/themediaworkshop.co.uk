"use client";

import { CaseStudy, toLink } from "@prisma/client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Markdown from "react-markdown";
import CaseStudyModal from "./modals/CaseStudyModal";
import { useDisclosure } from "@nextui-org/react";

export default function SegmentText(props: {
    index: number;
    linkTo: toLink;
    title: string | null;
    copy: string | null;
    buttonText: string | null;
    caseStudies: CaseStudy[];
}) {
    const { index, linkTo, title, copy, buttonText, caseStudies } = props;

    const { isOpen, onOpenChange } = useDisclosure();

    // Copy text el
    const copyText = useRef<HTMLDivElement>(null);

    // InView declarations
    const { ref, inView } = useInView({
        threshold: 0.1,
    });

    // Handle inView
    useEffect(() => {
        const el = document.getElementById("fade-" + props.index);
        if (el && inView) {
            if (el.classList.contains("opacity-0")) {
                el.classList.replace(
                    "opacity-0",
                    props.index % 2 === 0 ? "slide-in-right" : "slide-in-left"
                );
            }
        }
    }, [inView]);

    // Search copy for links to add target blank
    useEffect(() => {
        const anchors: HTMLAnchorElement[] = [];
        if (copyText.current?.children.length! > 0) {
            for (
                let i = 0;
                i < copyText.current?.children[0].children.length!;
                i++
            ) {
                if (copyText.current?.children[0].children[i].tagName === "A")
                    anchors.push(
                        copyText.current?.children[0].children[
                            i
                        ] as HTMLAnchorElement
                    );
            }
        }
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].setAttribute("target", "_blank");
            anchors[i].setAttribute("rel", "noreferrer");
        }
    }, []);

    return (
        <div
            id={"fade-" + index}
            className={`${
                index % 2 === 0 ? "xl:order-first" : "xl:order-last"
            } order-first relative opacity-0 text-center my-auto z-20`}>
            <div className="xl:absolute xl:left-0 xl:right-0 xl:-top-10">
                {linkTo !== "NONE" ? (
                    <Link
                        className="hover:text-orange-600 transition-all uppercase font-bold text-3xl"
                        href={"/" + linkTo.toLowerCase()}>
                        {title}
                    </Link>
                ) : (
                    <div className="uppercase font-bold text-3xl">{title}</div>
                )}
            </div>
            <div ref={ref}>
                <div
                    ref={copyText}
                    className="copy-text text-justify text-md xl:text-lg xl:mb-0 mt-4 mb-5">
                    <Markdown>{copy}</Markdown>
                </div>
            </div>

            {caseStudies.length > 0 && (
                <div className="xl:absolute xl:left-0 xl:right-0 xl:-bottom-15">
                    <div className="xl:text-center xl:mt-4">
                        <button
                            onClick={onOpenChange}
                            className="transition-all hover:bg-opacity-0 hover:text-orange-600 border border-orange-600 bg-opacity-90 xl:mt-2 mb-6 xl:mb-0 px-4 py-2 bg-orange-600">
                            {buttonText ? buttonText : "Examples"}
                        </button>
                    </div>
                    <CaseStudyModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        segmentTitle={title}
                        caseStudies={caseStudies}
                    />
                </div>
            )}
        </div>
    );
}
