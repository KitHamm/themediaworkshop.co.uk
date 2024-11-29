"use client";

import { useEffect, useRef } from "react";
import Markdown from "react-markdown";

export default function HeaderCopy(props: { description: string }) {
    const { description } = props;
    const copyText = useRef<HTMLDivElement>(null);

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
            ref={copyText}
            className="copy-text slide-up min-h-20 xl:min-w-96 px-4 py-4 xl:py-0 text-justify text-md xl:text-lg">
            <Markdown>{description}</Markdown>
        </div>
    );
}
