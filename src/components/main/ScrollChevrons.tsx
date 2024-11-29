"use client";

import { handleChevronOnScroll } from "@/lib/functions";
import { useEffect, useRef } from "react";

export default function ScrollChevrons() {
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
    }, []);

    return (
        <div
            ref={chevron}
            className="transition-opacity ease-in-out opacity-0 w-full absolute left-0 right-0 text-center bottom-40 xl:bottom-10">
            <div className="flex flex-col gap-4">
                <i
                    aria-hidden
                    className="chevron fa-solid fa-chevron-down fa-xl"
                />
                <i
                    aria-hidden
                    className="chevron fa-solid fa-chevron-down fa-xl"
                />
                <i
                    aria-hidden
                    className="chevron fa-solid fa-chevron-down fa-xl"
                />
            </div>
        </div>
    );
}
